const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  test: { type: String, required: true },
  details: { type: String },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hospital: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
