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
  source: {
    type: String,
    enum: ['MF_CENTRAL', 'CAMS_PDF', 'MANUAL'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  lastSync: {
    type: Date
  },
  sourceFile: {
    fileName: String,
    uploadDate: Date,
    fileType: {
      type: String,
      enum: ['PDF', 'CSV', 'API']
    }
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
  holdings: [{
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true
    },
    units: {
      type: Number,
      required: true
    },
    currentNav: {
      type: Number,
      default: 0
    },
    investmentAmount: {
      type: Number,
      required: true
    },
    currentValue: {
      type: Number,
      default: 0
    },
    lastValuationDate: {
      type: Date,
      default: Date.now
    }
  }],
  transactions: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['BUY', 'SELL', 'SWITCH_IN', 'SWITCH_OUT'],
      required: true
    },
    scheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scheme',
      required: true
    },
    units: {
      type: Number,
      required: true
    },
    nav: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Virtual for returns calculation
portfolioSchema.virtual('absoluteReturns').get(function() {
  if (this.totalInvestment === 0) return 0;
  return ((this.currentValue - this.totalInvestment) / this.totalInvestment) * 100;
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
