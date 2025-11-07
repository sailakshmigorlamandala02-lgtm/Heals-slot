// Receptionist-specific features

async function showReceptionistFeature(feature) {
  const container = document.getElementById('receptionistFeature');
  let html = `<div class="card portal-card"><h4>${feature.charAt(0).toUpperCase() + feature.slice(1)}</h4>`;

  if (feature === 'scheduling') {
    try {
      const appointments = await getAppointments(selectedHospital);
      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(a => new Date(a.date).toDateString() === today);
      html += `<p>Today's appointments: ${todayAppointments.length}</p>`;
      html += '<table class="table"><thead><tr><th>Patient</th><th>Doctor</th><th>Time</th><th>Status</th></tr></thead><tbody>' +
        todayAppointments.map(a => `<tr><td>${a.patientId ? a.patientId.username : 'Unknown'}</td><td>${a.doctorId ? a.doctorId.username : 'Unknown'}</td><td>${a.time}</td><td>${a.status || 'Scheduled'}</td></tr>`).join('') +
        '</tbody></table>';
      html += '<form id="addAppointmentForm"><div class="mb-3"><label class="form-label">Patient Username</label><input type="text" class="form-control" id="apptPatient" placeholder="Patient username" required><label class="form-label mt-2">Doctor</label><select class="form-select" id="apptDoctor" required></select><label class="form-label mt-2">Date</label><input type="date" class="form-control" id="apptDate" required><label class="form-label mt-2">Time</label><input type="time" class="form-control" id="apptTime" required><label class="form-label mt-2">Reason</label><input type="text" class="form-control" id="apptReason" placeholder="Appointment reason" required><button type="submit" class="btn btn-success mt-2">Schedule Appointment</button></div></form>';
    } catch (error) {
      html += '<p>Error loading appointments: ' + error.message + '</p>';
    }
  } else if (feature === 'checkin') {
    try {
      const appointments = await getAppointments(selectedHospital);
      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(a => new Date(a.date).toDateString() === today);
      html += `<p>Today's appointments: ${todayAppointments.length}</p>`;
      html += '<h5>Check In</h5><form id="checkinForm"><div class="mb-3"><label class="form-label">Patient Name</label><input type="text" class="form-control" id="checkinPatient" placeholder="Enter patient name" required><button type="submit" class="btn btn-success mt-2">Check In</button></div></form>';
      html += '<div class="mt-3"><h5>Checked-in Patients</h5><ul id="checkedInList"></ul></div>';
      html += '<h5>Check Out</h5><form id="checkoutForm"><div class="mb-3"><label class="form-label">Select Patient to Check Out</label><select class="form-select" id="checkoutPatient" required><option value="" disabled selected>Select a patient</option></select><button type="submit" class="btn btn-warning mt-2">Check Out</button></div></form>';
    } catch (error) {
      html += '<p>Error loading check-in data: ' + error.message + '</p>';
    }
  } else if (feature === 'payments') {
    try {
      const payments = await getPayments(selectedHospital);
      const today = new Date().toDateString();
      const todayPayments = payments.filter(p => new Date(p.date).toDateString() === today);
      const total = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      html += `<p>Collected today: $${total}</p>`;
      html += '<table class="table"><thead><tr><th>Patient</th><th>Amount</th><th>Status</th></tr></thead><tbody>' +
        todayPayments.map(p => `<tr><td>${p.patientId ? p.patientId.username : 'Unknown'}</td><td>$${p.amount}</td><td>${p.status}</td></tr>`).join('') +
        '</tbody></table>';
      html += '<form id="addPaymentForm"><div class="mb-3"><label class="form-label">Patient Username</label><input type="text" class="form-control" id="paymentPatient" placeholder="Patient username" required><label class="form-label mt-2">Amount</label><input type="number" class="form-control" id="paymentAmount" placeholder="Amount" required><button type="submit" class="btn btn-success mt-2">Record Payment</button></div></form>';
    } catch (error) {
      html += '<p>Error loading payments: ' + error.message + '</p>';
    }
  } else if (feature === 'queries') {
    try {
      html += '<div id="queryLog"><h5>Query Log</h5><ul id="queryList"></ul></div>';
      html += '<form id="addQueryForm"><div class="mb-3"><label class="form-label">Add Query</label><textarea class="form-control" id="queryText" placeholder="Enter query details" required></textarea><button type="submit" class="btn btn-primary mt-2">Add Query</button></div></form>';
    } catch (error) {
      html += '<p>Error loading queries: ' + error.message + '</p>';
    }
  }

  html += `<button class="btn btn-secondary mt-2" onclick="backToDashboard()">Back</button></div>`;
  container.innerHTML = html;

  // Event handlers
  if (feature === 'scheduling') {
    const form = document.getElementById('addAppointmentForm');
    const doctorSelect = document.getElementById('apptDoctor');

    // Populate doctor select
    const populateDoctors = async () => {
      try {
        const doctors = await getUsers(selectedHospital, 'doctor');
        doctorSelect.innerHTML = doctors.map(d => `<option value="${d._id}">${d.username}</option>`).join('');
      } catch (error) {
        doctorSelect.innerHTML = '<option>Error loading doctors</option>';
      }
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const patientUsername = document.getElementById('apptPatient').value.trim();
      const doctorId = document.getElementById('apptDoctor').value;
      const date = document.getElementById('apptDate').value;
      const time = document.getElementById('apptTime').value;
      const reason = document.getElementById('apptReason').value.trim();

      if (patientUsername && doctorId && date && time && reason) {
        try {
          const patients = await getUsers(selectedHospital, 'patient');
          const patient = patients.find(p => p.username === patientUsername);
          if (!patient) {
            alert('Patient not found!');
            return;
          }

          await createAppointment({
            patientId: patient._id,
            doctorId,
            date,
            time,
            reason,
            hospital: selectedHospital,
            status: 'Scheduled'
          });
          alert('Appointment scheduled successfully!');
          form.reset();
          // Refresh the appointments table
          showReceptionistFeature('scheduling');
        } catch (error) {
          alert('Error scheduling appointment: ' + error.message);
        }
      } else {
        alert('Please fill in all fields');
      }
    });

    populateDoctors();
  } else if (feature === 'checkin') {
    const form = document.getElementById('checkinForm');
    const list = document.getElementById('checkedInList');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutSelect = document.getElementById('checkoutPatient');

    const updateCheckedIn = () => {
      try {
        const checkedIn = JSON.parse(localStorage.getItem(`checkedIn_${selectedHospital}`)) || [];
        list.innerHTML = checkedIn.map(p => `<li>${p.name} - Checked in at ${p.time}</li>`).join('');
      } catch (error) {
        list.innerHTML = '<li>Error loading checked-in patients</li>';
      }
    };

    const updateCheckoutSelect = () => {
      try {
        const checkedIn = JSON.parse(localStorage.getItem(`checkedIn_${selectedHospital}`)) || [];
        checkoutSelect.innerHTML = '<option value="" disabled selected>Select a patient</option>' + checkedIn.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
      } catch (error) {
        checkoutSelect.innerHTML = '<option>Error loading patients</option>';
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const patientName = document.getElementById('checkinPatient').value.trim();
      if (patientName) {
        try {
          const checkedIn = JSON.parse(localStorage.getItem(`checkedIn_${selectedHospital}`)) || [];
          checkedIn.push({
            name: patientName,
            time: new Date().toLocaleTimeString()
          });
          localStorage.setItem(`checkedIn_${selectedHospital}`, JSON.stringify(checkedIn));
          alert('Patient checked in successfully!');
          form.reset();
          updateCheckedIn();
          updateCheckoutSelect();
        } catch (error) {
          alert('Error checking in patient: ' + error.message);
        }
      } else {
        alert('Please enter patient name');
      }
    });

    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();
      const patientName = document.getElementById('checkoutPatient').value;
      if (patientName) {
        try {
          const checkedIn = JSON.parse(localStorage.getItem(`checkedIn_${selectedHospital}`)) || [];
          const updatedCheckedIn = checkedIn.filter(p => p.name !== patientName);
          localStorage.setItem(`checkedIn_${selectedHospital}`, JSON.stringify(updatedCheckedIn));
          alert('Patient checked out successfully!');
          checkoutForm.reset();
          updateCheckedIn();
          updateCheckoutSelect();
        } catch (error) {
          alert('Error checking out patient: ' + error.message);
        }
      } else {
        alert('Please select a patient to check out');
      }
    });

    updateCheckedIn();
    updateCheckoutSelect();
  } else if (feature === 'payments') {
    const form = document.getElementById('addPaymentForm');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const patientUsername = document.getElementById('paymentPatient').value.trim();
      const amount = parseFloat(document.getElementById('paymentAmount').value);

      if (patientUsername && amount > 0) {
        try {
          const patients = await getUsers(selectedHospital, 'patient');
          const patient = patients.find(p => p.username === patientUsername);
          if (!patient) {
            alert('Patient not found!');
            return;
          }

          await createPayment({
            patientId: patient._id,
            amount,
            date: new Date(),
            status: 'Paid',
            hospital: selectedHospital
          });
          alert('Payment recorded successfully!');
          form.reset();
          // Refresh payments
          showReceptionistFeature('payments');
        } catch (error) {
          alert('Error recording payment: ' + error.message);
        }
      } else {
        alert('Please enter valid patient username and amount');
      }
    });
  } else if (feature === 'queries') {
    const form = document.getElementById('addQueryForm');
    const list = document.getElementById('queryList');

    const updateQueries = () => {
      try {
        const queries = JSON.parse(localStorage.getItem(`queries_${selectedHospital}`)) || [];
        list.innerHTML = queries.map(q => `<li>${q.text} - ${q.time}</li>`).join('');
      } catch (error) {
        list.innerHTML = '<li>Error loading queries</li>';
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const queryText = document.getElementById('queryText').value.trim();
      if (queryText) {
        try {
          const queries = JSON.parse(localStorage.getItem(`queries_${selectedHospital}`)) || [];
          queries.push({
            text: queryText,
            time: new Date().toLocaleString()
          });
          localStorage.setItem(`queries_${selectedHospital}`, JSON.stringify(queries));
          alert('Query added successfully!');
          form.reset();
          updateQueries();
        } catch (error) {
          alert('Error adding query: ' + error.message);
        }
      } else {
        alert('Please enter query details');
      }
    });

    updateQueries();
  }
}
