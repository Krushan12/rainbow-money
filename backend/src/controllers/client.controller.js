import asyncHandler from 'express-async-handler';
import Client from '../models/client.model.js';

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
export const createClient = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    panNumber,
    dateOfBirth,
    riskProfile,
    investmentGoals,
    notes
  } = req.body;

  // Check if client already exists with the same PAN
  const clientExists = await Client.findOne({ panNumber });
  if (clientExists) {
    res.status(400);
    throw new Error('Client with this PAN number already exists');
  }

  const client = await Client.create({
    name,
    email,
    phone,
    panNumber,
    dateOfBirth,
    riskProfile,
    investmentGoals,
    notes,
    advisor: req.user._id
  });

  res.status(201).json({
    success: true,
    data: client
  });
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
