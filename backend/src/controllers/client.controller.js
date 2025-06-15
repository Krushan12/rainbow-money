import asyncHandler from 'express-async-handler';
import Client from '../models/client.model.js';
import mongoose from 'mongoose';

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
export const createClient = asyncHandler(async (req, res) => {
  try {
    console.log('Creating new client - Request received');
    console.log('Request body:', req.body);

    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      console.log('Validation failed - Missing required fields');
      res.status(400);
      throw new Error('Name and email are required');
    }

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error('Database connection is not ready');
      console.log('Connection state:', mongoose.connection.readyState);
      res.status(500);
      throw new Error('Database connection is not ready');
    }

    console.log('Checking for existing client with email:', email);
    // Check if client already exists with the same email
    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      console.log('Client already exists with email:', email);
      res.status(400);
      throw new Error('Client with this email already exists');
    }

    console.log('Creating new client document');
    const client = await Client.create({
      name,
      email,
      advisor: req.user._id // Add advisor field
    });

    console.log('Client creation result:', client ? 'Success' : 'Failed', 'advisorId:', req.user._id);
    if (client) {
      console.log('Client created successfully:', client._id);
      res.status(201).json({
        success: true,
        data: client
      });
    } else {
      console.log('Failed to create client - No error but no client returned');
      res.status(400);
      throw new Error('Invalid client data');
    }
  } catch (error) {
    console.error('Client creation error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // Send detailed error response
    res.status(error.status || 500).json({
      success: false,
      message: 'Failed to create client',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// @desc    Get all clients for logged in advisor
// @route   GET /api/clients
// @access  Private
export const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ advisor: req.user._id })
    .select('-__v')
    .sort('-createdAt');

  res.json({
    success: true,
    count: clients.length,
    data: clients
  });
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
export const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    advisor: req.user._id
  });

  if (!client) {
    res.status(404);
    throw new Error('Client not found');
  }

  res.json({
    success: true,
    data: client
  });
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = asyncHandler(async (req, res) => {
  let client = await Client.findOne({
    _id: req.params.id,
    advisor: req.user._id
  });

  if (!client) {
    res.status(404);
    throw new Error('Client not found');
  }

  client = await Client.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    data: client
  });
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
export const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    advisor: req.user._id
  });

  if (!client) {
    res.status(404);
    throw new Error('Client not found');
  }

  await client.remove();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Get client statistics
// @route   GET /api/clients/stats
// @access  Private
export const getClientStats = asyncHandler(async (req, res) => {
  const stats = await Client.aggregate([
    {
      $match: { advisor: req.user._id }
    },
    {
      $group: {
        _id: '$riskProfile',
        count: { $sum: 1 },
        avgAge: { $avg: {
          $divide: [
            { $subtract: [new Date(), '$dateOfBirth'] },
            365.25 * 24 * 60 * 60 * 1000
          ]
        }}
      }
    }
  ]);

  res.json({
    success: true,
    data: stats
  });
});
