const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medications: [{ name: String, dosage: String, duration: String }],
  notes: { type: String },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  hospital: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
