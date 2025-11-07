const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hospital: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  specialty: { type: String }, // for doctors
  license: { type: String }, // for pharmacists, nurses
  department: { type: String }, // for receptionists
  adminCode: { type: String }, // for admins
  cert: { type: String }, // for lab techs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
