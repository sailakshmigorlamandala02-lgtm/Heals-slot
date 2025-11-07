const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoice: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  hospital: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
