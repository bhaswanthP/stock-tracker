const mongoose = require('mongoose');
const stockAlertSchema = new mongoose.Schema({
  email: String,
  symbol: String,
  targetPrice: Number,
  status: { type: String, default: 'active' },
  lastNotifiedAt: Date
}, {timestamps: true});
module.exports = mongoose.model('StockAlert', stockAlertSchema);
