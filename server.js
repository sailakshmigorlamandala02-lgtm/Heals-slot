require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Connect to MongoDB
async function connectDB() {
  try {
    // Use MongoDB Atlas cloud database
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://hospitalmanagement_user:sai0228@cluster0.eh9qu4h.mongodb.net/hospitalDB?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('Please check your MongoDB connection string and credentials');
    process.exit(1);
  }
}

(async () => {
  await connectDB();

  // Models
  const User = require('./models/User');
  const Appointment = require('./models/Appointment');
  const MedicalHistory = require('./models/MedicalHistory');
  const Payment = require('./models/Payment');
  const Equipment = require('./models/Equipment');
  const Leave = require('./models/Leave');
  const Notification = require('./models/Notification');
  const Prescription = require('./models/Prescription');

  // Health check endpoint for monitoring services (UptimeRobot, etc.)
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      message: 'HealSlot server is running',
      timestamp: new Date().toISOString()
    });
  });

  // Routes

  // Auth routes
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password, role, hospital } = req.body;
      const user = await User.findOne({ username, password, role, hospital });
      if (user) {
        res.json({ success: true, user: { id: user._id, role: user.role, username: user.username, hospital: user.hospital } });
      } else {
        res.json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/register', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      res.json({ success: true, user: { id: user._id, role: user.role, username: user.username, hospital: user.hospital } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Appointment routes
  app.get('/api/appointments/:hospital', async (req, res) => {
    try {
      const appointments = await Appointment.find({ hospital: req.params.hospital }).populate('patientId doctorId');
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/appointments', async (req, res) => {
    try {
      const appointment = new Appointment(req.body);
      await appointment.save();
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/appointments/:id', async (req, res) => {
    try {
      const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Medical History routes
  app.get('/api/medical-history/:patientId', async (req, res) => {
    try {
      const history = await MedicalHistory.find({ patientId: req.params.patientId });
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/medical-history', async (req, res) => {
    try {
      const history = new MedicalHistory(req.body);
      await history.save();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Payment routes
  app.get('/api/payments/:hospital', async (req, res) => {
    try {
      const payments = await Payment.find({ hospital: req.params.hospital }).populate('patientId');
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/payments', async (req, res) => {
    try {
      const payment = new Payment(req.body);
      await payment.save();
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Equipment routes
  app.get('/api/equipment/:hospital', async (req, res) => {
    try {
      const equipment = await Equipment.find({ hospital: req.params.hospital });
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/equipment', async (req, res) => {
    try {
      const equipment = new Equipment(req.body);
      await equipment.save();
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Leave routes
  app.get('/api/leaves/:hospital', async (req, res) => {
    try {
      const leaves = await Leave.find({ hospital: req.params.hospital }).populate('staffId');
      res.json(leaves);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/leaves', async (req, res) => {
    try {
      const leave = new Leave(req.body);
      await leave.save();
      res.json(leave);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Notification routes
  app.get('/api/notifications/:hospital', async (req, res) => {
    try {
      const notifications = await Notification.find({ hospital: req.params.hospital });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/notifications', async (req, res) => {
    try {
      const notification = new Notification(req.body);
      await notification.save();
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Prescription routes
  app.get('/api/prescriptions/:hospital', async (req, res) => {
    try {
      const prescriptions = await Prescription.find({ hospital: req.params.hospital }).populate('patientId doctorId');
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/prescriptions', async (req, res) => {
    try {
      const prescription = new Prescription(req.body);
      await prescription.save();
      res.json(prescription);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // User routes
  app.get('/api/users/:hospital/:role', async (req, res) => {
    try {
      const users = await User.find({ hospital: req.params.hospital, role: req.params.role });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
  });
})();
