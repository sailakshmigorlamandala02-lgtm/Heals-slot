const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['available', 'in-use', 'maintenance'], default: 'available' },
  details: { type: String },
  hospital: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
