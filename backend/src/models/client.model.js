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
    trim: true,
    uppercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty PAN number
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
      },
      message: 'Please enter a valid PAN number'
    }
  },
  dateOfBirth: {
    type: Date
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
  portfolioData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  notes: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
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
