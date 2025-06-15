import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Portfolio name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Mutual Fund', 'Equity', 'Fixed Income', 'Mixed'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  totalInvestment: {
    type: Number,
    default: 0
  },
  currentValue: {
    type: Number,
    default: 0
  },
  xirr: {
    type: Number,
    default: 0
  },
  lastValuationDate: {
    type: Date,
    default: Date.now
  },
  holdings: [{
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true
    },
    units: {
      type: Number,
      required: true,
      default: 0
    },
    avgCostPrice: {
      type: Number,
      required: true,
      default: 0
    },
    currentValue: {
      type: Number,
      default: 0
    },
    profitLoss: {
      type: Number,
      default: 0
    },
    allocationPercentage: {
      type: Number,
      default: 0
    }
  }],
  assetAllocation: {
    equity: {
      type: Number,
      default: 0
    },
    debt: {
      type: Number,
      default: 0
    },
    gold: {
      type: Number,
      default: 0
    },
    cash: {
      type: Number,
      default: 0
    },
    others: {
      type: Number,
      default: 0
    }
  },
  marketCapAllocation: {
    largeCap: {
      type: Number,
      default: 0
    },
    midCap: {
      type: Number,
      default: 0
    },
    smallCap: {
      type: Number,
      default: 0
    }
  },
  sectorAllocation: {
    type: Map,
    of: Number,
    default: new Map()
  },
  createdAt: {
    type: Date,
    default: Date.now
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

// Virtual for returns calculation
portfolioSchema.virtual('absoluteReturns').get(function() {
  if (this.totalInvestment === 0) return 0;
  return ((this.currentValue - this.totalInvestment) / this.totalInvestment) * 100;
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
