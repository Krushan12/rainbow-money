import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Client email is required'],
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  accessType: {
    type: String,
    enum: ['FULL', 'LIMITED'],
    default: 'LIMITED',
    required: true
  },
  panNumber: {
    type: String,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
      },
      message: 'Please enter a valid PAN number'
    }
  },
  mfCentralAuthorized: {
    type: Boolean,
    default: false
  },
  riskProfile: {
    type: String,
    enum: ['Conservative', 'Moderate', 'Aggressive'],
    default: 'Moderate'
  },
  investmentGoals: {
    type: [String],
    default: []
  },
  portfolioSource: {
    type: String,
    enum: ['MF_CENTRAL', 'CAMS_PDF', 'MANUAL'],
    default: 'MANUAL'
  },
  lastPortfolioUpdate: {
    type: Date
  },
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for client's age
clientSchema.virtual('age').get(function() {
  return Math.floor((new Date() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
});

// Middleware to update lastUpdated timestamp
clientSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
