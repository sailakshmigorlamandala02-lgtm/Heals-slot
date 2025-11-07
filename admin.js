// Admin-specific features

async function showAdminFeature(feature) {
  const container = document.getElementById('adminFeature');
  let html = '<div class="card portal-card"><h4>' + feature.charAt(0).toUpperCase() + feature.slice(1) + '</h4>';

  if (feature === 'analytics') {
    try {
      const appointments = await getAppointments(selectedHospital);
      const docCount = {};
      appointments.forEach(a => {
        const doctorName = a.doctorId ? a.doctorId.username : 'Unknown';
        docCount[doctorName] = (docCount[doctorName] || 0) + 1;
      });
      const doctors = await getUsers(selectedHospital, 'doctor');
      html += '<h5>Patients per Doctor</h5><table class="table"><thead><tr><th>Doctor</th><th>Patients</th></tr></thead><tbody>' +
        doctors.map(d => `<tr><td>${d.username}</td><td>${docCount[d.username] || 0}</td></tr>`).join('') + '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading analytics: ' + error.message + '</p>';
    }
  } else if (feature === 'backup') {
    try {
      const appointments = await getAppointments(selectedHospital);
      html += '<h5>Patient Appointment Details</h5><table class="table"><thead><tr><th>Patient Name</th><th>Doctor Name</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th></tr></thead><tbody>' +
        appointments.map(a => `<tr><td>${a.patientId ? a.patientId.username : 'Unknown'}</td><td>${a.doctorId ? a.doctorId.username : 'Unknown'}</td><td>${new Date(a.date).toLocaleDateString()}</td><td>${a.time}</td><td>${a.reason || 'N/A'}</td><td>${a.status}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error creating backup: ' + error.message + '</p>';
    }
  } else if (feature === 'users') {
    try {
      const doctors = await getUsers(selectedHospital, 'doctor');
      const pharmacists = await getUsers(selectedHospital, 'pharmacist');
      const nurses = await getUsers(selectedHospital, 'nurse');
      const labTechs = await getUsers(selectedHospital, 'lab');
      const receptionists = await getUsers(selectedHospital, 'receptionist');
      const admins = await getUsers(selectedHospital, 'admin');

      html += '<form id="addUserForm"><div class="mb-3"><label class="form-label">User Role</label><select class="form-select" id="userRole" required><option>Patient</option><option>Doctor</option><option>Pharmacist</option><option>Receptionist</option><option>Admin</option><option>Nurse</option><option>Lab Technician</option></select><label class="form-label mt-2">Username</label><input type="text" class="form-control" id="newUsername" placeholder="Enter Username" required><label class="form-label mt-2">Password</label><input type="password" class="form-control" id="newPassword" placeholder="Enter Password" required><button class="btn btn-success mt-2" type="submit">Add User</button></div></form>';

      html += '<div class="mt-4"><h5>Staff List</h5>';
      html += '<h6>Doctors</h6><ul>' + doctors.map(d => `<li>${d.username}</li>`).join('') + '</ul>';
      html += '<h6>Pharmacists</h6><ul>' + pharmacists.map(d => `<li>${d.username}</li>`).join('') + '</ul>';
      html += '<h6>Nurses</h6><ul>' + nurses.map(d => `<li>${d.username}</li>`).join('') + '</ul>';
      html += '<h6>Lab Technicians</h6><ul>' + labTechs.map(d => `<li>${d.username}</li>`).join('') + '</ul>';
      html += '<h6>Receptionists</h6><ul>' + receptionists.map(d => `<li>${d.username}</li>`).join('') + '</ul>';
      html += '<h6>Admins</h6><ul>' + admins.map(d => `<li>${d.username}</li>`).join('') + '</ul></div>';
    } catch (error) {
      html += '<p>Error loading users: ' + error.message + '</p>';
    }
  } else if (feature === 'compliance') {
    try {
      html += '<table class="table"><thead><tr><th>Policy</th><th>Status</th></tr></thead><tbody><tr><td>HIPAA</td><td>Compliant</td></tr></tbody></table>';
    } catch (error) {
      html += '<p>Error loading compliance: ' + error.message + '</p>';
    }
  } else if (feature === 'doctorAvailability') {
    try {
      const appointments = await getAppointments(selectedHospital);
      const doctors = await getUsers(selectedHospital, 'doctor');
      html += '<table class="table"><thead><tr><th>Doctor</th><th>Appointments</th></tr></thead><tbody>' +
        doctors.map(d => {
          const doctorAppointments = appointments.filter(a => a.doctorId && a.doctorId._id === d._id);
          return `<tr><td>${d.username}</td><td>${doctorAppointments.map(a => `${new Date(a.date).toLocaleDateString()} at ${a.time}`).join('<br>')}</td></tr>`;
        }).join('') + '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading doctor availability: ' + error.message + '</p>';
    }
  } else if (feature === 'patientDetails') {
    try {
      const appointments = await getAppointments(selectedHospital);
      const patients = [...new Set(appointments.map(a => a.patientId ? a.patientId.username : 'Unknown'))];
      html += '<table class="table"><thead><tr><th>Patient</th><th>Appointments</th></tr></thead><tbody>' +
        patients.map(p => {
          const appts = appointments.filter(a => a.patientId && a.patientId.username === p);
          return `<tr><td>${p}</td><td>${appts.length}</td></tr>`;
        }).join('') + '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading patient details: ' + error.message + '</p>';
    }
  } else if (feature === 'patientPayments') {
    try {
      const payments = await getPayments(selectedHospital);
      html += '<table class="table"><thead><tr><th>Patient</th><th>Invoice</th><th>Amount</th><th>Status</th></tr></thead><tbody>' +
        payments.map(p => `<tr><td>${p.patientId ? p.patientId.username : 'Unknown'}</td><td>${p.invoice || 'N/A'}</td><td>$${p.amount}</td><td>${p.status}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading payments: ' + error.message + '</p>';
    }
  } else if (feature === 'equipmentDetails') {
    try {
      const equipment = await getEquipment(selectedHospital);
      html += '<table class="table"><thead><tr><th>Name</th><th>Status</th><th>Details</th></tr></thead><tbody>' +
        equipment.map(e => `<tr><td>${e.name}</td><td>${e.status}</td><td>${e.details}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading equipment: ' + error.message + '</p>';
    }
  } else if (feature === 'staffLeaves') {
    try {
      const leaves = await getLeaves(selectedHospital);
      html += '<table class="table"><thead><tr><th>Staff</th><th>Date</th><th>Reason</th></tr></thead><tbody>' +
        leaves.map(l => `<tr><td>${l.staffId ? l.staffId.username : 'Unknown'}</td><td>${new Date(l.date).toLocaleDateString()}</td><td>${l.reason}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading leaves: ' + error.message + '</p>';
    }
  } else if (feature === 'notifications') {
    try {
      const notifications = await getNotifications(selectedHospital);
      html += '<table class="table"><thead><tr><th>Message</th><th>Type</th></tr></thead><tbody>' +
        notifications.map(n => `<tr><td>${n.message}</td><td>${n.type}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading notifications: ' + error.message + '</p>';
    }
  }

  html += '<button class="btn btn-secondary mt-2" onclick="backToDashboard()">Back</button></div>';
  container.innerHTML = html;

  // Event handlers
  if (feature === 'users') {
    const form = document.getElementById('addUserForm');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const role = document.getElementById('userRole').value.toLowerCase().replace(' ', '');
      const username = document.getElementById('newUsername').value.trim();
      const password = document.getElementById('newPassword').value.trim();

      if (username && password) {
        try {
          await registerUser({
            username,
            password,
            role,
            hospital: selectedHospital
          });
          alert('User added successfully!');
          form.reset();
          // Refresh the page to show updated user list
          location.reload();
        } catch (error) {
          alert('Error adding user: ' + error.message);
        }
      } else {
        alert('Please fill in all fields');
      }
    });
  }
}
