// Common data structures and functions for Hospital Management System

// API Base URL - automatically detects environment
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : `${window.location.protocol}//${window.location.host}/api`;

// User session
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let selectedHospital = localStorage.getItem('selectedHospital') || null;

// Utility functions
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };
  const response = await fetch(url, config);
  return response.json();
}

function logout() {
  currentUser = null;
  selectedHospital = null;
  localStorage.removeItem('currentUser');
  localStorage.removeItem('selectedHospital');
  window.location.href = 'index.html';
}

function backToDashboard() {
  if (currentUser) {
    window.location.href = `${currentUser.role}.html`;
  } else {
    window.location.href = 'index.html';
  }
}

// Authentication functions
async function loginUser(username, password, role, hospital) {
  const result = await apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, role, hospital })
  });
  if (result.success) {
    currentUser = result.user;
    selectedHospital = hospital;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('selectedHospital', selectedHospital);
  }
  return result;
}

async function registerUser(userData) {
  const result = await apiCall('/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  if (result.success) {
    currentUser = result.user;
    selectedHospital = userData.hospital;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('selectedHospital', selectedHospital);
  }
  return result;
}

// Data fetching functions
async function getAppointments(hospital) {
  return await apiCall(`/appointments/${hospital}`);
}

async function createAppointment(appointmentData) {
  return await apiCall('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData)
  });
}

async function updateAppointment(id, updateData) {
  return await apiCall(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

async function getMedicalHistory(patientId) {
  return await apiCall(`/medical-history/${patientId}`);
}

async function createMedicalHistory(historyData) {
  return await apiCall('/medical-history', {
    method: 'POST',
    body: JSON.stringify(historyData)
  });
}

async function getPayments(hospital) {
  return await apiCall(`/payments/${hospital}`);
}

async function createPayment(paymentData) {
  return await apiCall('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData)
  });
}

async function getEquipment(hospital) {
  return await apiCall(`/equipment/${hospital}`);
}

async function createEquipment(equipmentData) {
  return await apiCall('/equipment', {
    method: 'POST',
    body: JSON.stringify(equipmentData)
  });
}

async function getLeaves(hospital) {
  return await apiCall(`/leaves/${hospital}`);
}

async function createLeave(leaveData) {
  return await apiCall('/leaves', {
    method: 'POST',
    body: JSON.stringify(leaveData)
  });
}

async function getNotifications(hospital) {
  return await apiCall(`/notifications/${hospital}`);
}

async function createNotification(notificationData) {
  return await apiCall('/notifications', {
    method: 'POST',
    body: JSON.stringify(notificationData)
  });
}

async function getPrescriptions(hospital) {
  return await apiCall(`/prescriptions/${hospital}`);
}

async function createPrescription(prescriptionData) {
  return await apiCall('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(prescriptionData)
  });
}

async function getUsers(hospital, role) {
  return await apiCall(`/users/${hospital}/${role}`);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  if (currentUser && window.location.pathname.includes(`${currentUser.role}.html`)) {
    // Already on correct page
  } else if (currentUser) {
    window.location.href = `${currentUser.role}.html`;
  } else {
    window.location.href = 'index.html';
  }
});
