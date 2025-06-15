import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
    required: true
  },
  type: {
    type: String,
    enum: ['Purchase', 'Redemption', 'Switch In', 'Switch Out', 'Dividend'],
    required: true
  },
  date: {
    type: Date,
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
  },
  charges: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Completed'
  },
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update portfolio after transaction
transactionSchema.post('save', async function(doc) {
  const Portfolio = mongoose.model('Portfolio');
  const portfolio = await Portfolio.findById(doc.portfolio);
  
  if (!portfolio) return;

  // Update portfolio holdings and calculations
  await portfolio.updateHoldings();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
