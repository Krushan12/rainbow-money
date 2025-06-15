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
  panNumber: {
    type: String,
    required: [true, 'PAN number is required'],
    unique: true,
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
      },
      message: 'Please enter a valid PAN number'
    }
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  riskProfile: {
    type: String,
    enum: ['Conservative', 'Moderate', 'Aggressive'],
    default: 'Moderate'
  },
  investmentGoals: [{
    type: String,
    enum: ['Retirement', 'Education', 'Home', 'Wealth Creation', 'Tax Saving', 'Other']
  }],
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
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
