const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'emergency'], default: 'info' },
  hospital: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
