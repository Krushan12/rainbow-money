import asyncHandler from 'express-async-handler';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

// @desc    Upload and process portfolio PDF
// @route   POST /api/upload
// @access  Private
export const uploadPortfolio = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    // Path to the uploaded file
    const filePath = req.file.path;
    
    // Path to the Python script
    const scriptPath = path.join(process.cwd(), 'scripts', 'analyze_pdf.py');

    // Spawn Python process
    const pythonProcess = spawn('python3', [scriptPath, filePath]);

    let jsonOutput = '';
    let errorOutput = '';

    // Collect data from Python script
    pythonProcess.stdout.on('data', (data) => {
      jsonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Handle process completion
    pythonProcess.on('close', async (code) => {
      // Clean up the uploaded file
      fs.unlinkSync(filePath);

      if (code !== 0) {
        console.error('Python script error:', errorOutput);
        res.status(500).json({
          success: false,
          message: 'Failed to process PDF',
          error: errorOutput
        });
        return;
      }

      try {
        // Parse the JSON output
        const portfolioData = JSON.parse(jsonOutput);

        res.json({
          success: true,
          data: portfolioData,
          message: 'Portfolio processed successfully'
        });
      } catch (error) {
        console.error('Error parsing Python output:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to process portfolio data',
          error: error.message
        });
      }
    });
  } catch (error) {
    // Clean up file if it exists
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    throw error;
  }
});
