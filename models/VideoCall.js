const mongoose = require('mongoose');

const videoCallSchema = new mongoose.Schema({
  callerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['calling', 'accepted', 'declined', 'ended'], default: 'calling' },
  hospital: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

module.exports = mongoose.model('VideoCall', videoCallSchema);
