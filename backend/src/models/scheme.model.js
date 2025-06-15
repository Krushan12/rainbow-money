import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Scheme name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Scheme code is required'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Equity', 'Debt', 'Hybrid', 'Solution Oriented', 'Other'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: String,
  fundHouse: {
    type: String,
    required: true
  },
  nav: {
    type: Number,
    required: true
  },
  navDate: {
    type: Date,
    required: true
  },
  aum: Number,
  expenseRatio: Number,
  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  assetAllocation: {
    equity: Number,
    debt: Number,
    gold: Number,
    cash: Number,
    others: Number
  },
  marketCapAllocation: {
    largeCap: Number,
    midCap: Number,
    smallCap: Number
  },
  sectorAllocation: {
    type: Map,
    of: Number
  },
  returns: {
    oneMonth: Number,
    threeMonth: Number,
    sixMonth: Number,
    oneYear: Number,
    threeYear: Number,
    fiveYear: Number,
    inception: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster searches
schemeSchema.index({ code: 1, fundHouse: 1 });

const Scheme = mongoose.model('Scheme', schemeSchema);

export default Scheme;
