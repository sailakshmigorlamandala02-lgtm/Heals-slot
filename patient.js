// Patient-specific features

async function showPatientFeature(feature) {
  const container = document.getElementById('patientFeature');
  let html = '<div class="card portal-card"><h4>' + feature.charAt(0).toUpperCase() + feature.slice(1) + '</h4>';

  if (feature === 'profile') {
    try {
      html += '<form id="updateProfileForm"><div class="mb-3"><label class="form-label">Update Name</label><input type="text" class="form-control" id="newName" placeholder="New Name" required><button class="btn btn-success mt-2" type="submit">Save</button></div></form>';
    } catch (error) {
      html += '<p>Error loading profile: ' + error.message + '</p>';
    }
  } else if (feature === 'appointments') {
    try {
      const doctors = await getUsers(selectedHospital, 'doctor');
      let freeSlots = JSON.parse(localStorage.getItem('freeSlots')) || [];
      // Add default slots if none exist
      if (!freeSlots.length && doctors.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        freeSlots = [
          { doctorId: doctors[0]._id, doctorUsername: doctors[0].username, date: today, time: '10:00' },
          { doctorId: doctors[0]._id, doctorUsername: doctors[0].username, date: today, time: '11:00' },
          { doctorId: doctors[0]._id, doctorUsername: doctors[0].username, date: today, time: '14:00' }
        ];
        localStorage.setItem('freeSlots', JSON.stringify(freeSlots));
      }
      html += `
        <form id="bookFromFreeSlot">
          <div class="mb-3"><label class="form-label">Doctor</label>
            <select class="form-select" id="selectDoctor" required onchange="updateAvailableSlots()">${doctors.map((d, i) => `<option value="${d._id}" ${i === 0 ? 'selected' : ''}>${d.username}${d.specialty ? ' - ' + d.specialty : ''}</option>`).join('')}</select>
          </div>
          <div class="mb-3"><label class="form-label">Available Slots</label>
            <select class="form-select" id="selectSlot" required><option value="" disabled selected>Select a slot</option></select>
          </div>
          <div class="mb-3"><label class="form-label">Reason</label><input type="text" class="form-control" id="apptReason" required></div>
          <button type="submit" class="btn btn-primary">Book Appointment</button>
        </form>
        <div class="mt-4"><h5>My Appointments</h5>
        <table class="table"><thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody id="myAppts"></tbody></table></div>`;
    } catch (error) {
      html += '<p>Error loading doctors: ' + error.message + '</p>';
    }
  } else if (feature === 'history') {
    try {
      const history = await getMedicalHistory(currentUser.id);
      html += '<table class="table"><thead><tr><th>Date</th><th>Test</th><th>Details</th></tr></thead><tbody>' +
        history.map(h => `<tr><td>${new Date(h.date).toLocaleDateString()}</td><td>${h.test}</td><td>${h.details}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading medical history: ' + error.message + '</p>';
    }
  } else if (feature === 'billing') {
    try {
      const payments = await getPayments(selectedHospital);
      const myPayments = payments.filter(p => p.patientId && p.patientId._id === currentUser.id);
      html += '<table class="table"><thead><tr><th>Invoice ID</th><th>Amount</th><th>Status</th></tr></thead><tbody>' +
        myPayments.map(p => `<tr><td>${p.invoice || 'N/A'}</td><td>$${p.amount}</td><td>${p.status}</td></tr>`).join('') +
        '</tbody></table><button class="btn btn-primary mt-2" onclick="payNow()">Pay Now</button>';
    } catch (error) {
      html += '<p>Error loading payments: ' + error.message + '</p>';
    }
  } else if (feature === 'reminders') {
    try {
      // For now, use localStorage for reminders
      const reminders = JSON.parse(localStorage.getItem(`reminders_${currentUser.username}`)) || [
        { message: 'Take medication at 8 PM', date: new Date().toLocaleDateString() }
      ];
      html += '<div id="reminderList"><h5>Reminders</h5><ul>' + reminders.map(r => `<li>${r.message} (${r.date})</li>`).join('') + '</ul></div>';
      html += '<form id="addReminderForm"><div class="mb-3"><label class="form-label">New Reminder</label><input type="text" class="form-control" id="reminderText" placeholder="Enter reminder" required><button type="submit" class="btn btn-success mt-2">Add Reminder</button></div></form>';
    } catch (error) {
      html += '<p>Error loading reminders: ' + error.message + '</p>';
    }
  } else if (feature === 'feedback') {
    try {
      html += '<form id="feedbackForm"><div class="mb-3"><label class="form-label">Feedback</label><textarea class="form-control" id="feedbackText" placeholder="Enter your feedback" required></textarea><button class="btn btn-success mt-2" type="submit">Submit</button></div></form>';
    } catch (error) {
      html += '<p>Error loading feedback: ' + error.message + '</p>';
    }
  }
  html += '<button class="btn btn-secondary mt-2" onclick="backToDashboard()">Back</button></div>';
  container.innerHTML = html;

  if (feature === 'profile') {
    container.querySelector('#updateProfileForm').addEventListener('submit', e => {
      e.preventDefault();
      const newName = document.getElementById('newName').value.trim();
      if (newName) {
        try {
          // Update profile via API (not implemented yet)
          alert('Profile update not implemented yet!');
        } catch (error) {
          alert('Error updating profile: ' + error.message);
        }
      } else {
        alert('Please enter a new name');
      }
    });
  } else if (feature === 'appointments') {
    const form = document.getElementById('bookFromFreeSlot');
    const table = document.getElementById('myAppts');

    const updateAppts = async () => {
      try {
        const appointments = await getAppointments(selectedHospital);
        const myAppts = appointments.filter(a => a.patientId && a.patientId._id === currentUser.id);
        table.innerHTML = myAppts.map(a => `<tr><td>${a.doctorId ? a.doctorId.username : 'Unknown'}</td><td>${new Date(a.date).toLocaleDateString()}</td><td>${a.time}</td><td>${a.status || 'Scheduled'}</td></tr>`).join('');
      } catch (error) {
        table.innerHTML = '<tr><td colspan="4">Error loading appointments</td></tr>';
      }
    };
    updateAppts();

    // Function to update available slots based on selected doctor
    window.updateAvailableSlots = () => {
      const doctorId = document.getElementById('selectDoctor').value;
      const slotSelect = document.getElementById('selectSlot');
      const freeSlots = JSON.parse(localStorage.getItem('freeSlots')) || [];
      const doctorSlots = freeSlots.filter(s => s.doctorId === doctorId);
      slotSelect.innerHTML = '<option value="" disabled selected>Select a slot</option>' +
        doctorSlots.map(s => `<option value="${s.date}|${s.time}">${s.date} at ${s.time}</option>`).join('');
    };

    // Initialize slots for the first doctor
    updateAvailableSlots();

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const doctorId = document.getElementById('selectDoctor').value;
      const slotValue = document.getElementById('selectSlot').value;
      const reason = document.getElementById('apptReason').value.trim();
      if (doctorId && slotValue && reason) {
        const [date, time] = slotValue.split('|');
        try {
          // Check if slot is still available
          const freeSlots = JSON.parse(localStorage.getItem('freeSlots')) || [];
          const slotAvailable = freeSlots.some(s => s.doctorId === doctorId && s.date === date && s.time === time);

          if (!slotAvailable) {
            alert('This slot is no longer available. Please select another slot.');
            updateAvailableSlots(); // Refresh slots
            return;
          }

          const result = await createAppointment({
            patientId: currentUser.id,
            doctorId,
            date,
            time,
            reason,
            hospital: selectedHospital,
            status: 'scheduled'
          });
          if (result._id) {
            // Remove the booked slot from freeSlots
            const updatedSlots = freeSlots.filter(s => !(s.doctorId === doctorId && s.date === date && s.time === time));
            localStorage.setItem('freeSlots', JSON.stringify(updatedSlots));
            alert('Appointment booked successfully!');
            form.reset();
            updateAppts();
            updateAvailableSlots(); // Refresh slots
          } else {
            alert('Failed to book appointment');
          }
        } catch (error) {
          alert('Error booking appointment: ' + error.message);
        }
      } else {
        alert('Please fill in all required fields');
      }
    });
  } else if (feature === 'reminders') {
    const form = document.getElementById('addReminderForm');
    const list = document.getElementById('reminderList');

    const updateReminders = () => {
      try {
        const reminders = JSON.parse(localStorage.getItem(`reminders_${currentUser.username}`)) || [];
        list.innerHTML = '<h5>Reminders</h5><ul>' + reminders.map(r => `<li>${r.message} (${r.date})</li>`).join('') + '</ul>';
      } catch (error) {
        list.innerHTML = '<h5>Reminders</h5><p>Error loading reminders</p>';
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const text = document.getElementById('reminderText').value.trim();
      if (text) {
        try {
          const reminders = JSON.parse(localStorage.getItem(`reminders_${currentUser.username}`)) || [];
          reminders.push({
            message: text,
            date: new Date().toLocaleDateString()
          });
          localStorage.setItem(`reminders_${currentUser.username}`, JSON.stringify(reminders));
          alert('Reminder added!');
          form.reset();
          updateReminders();
        } catch (error) {
          alert('Error adding reminder: ' + error.message);
        }
      } else {
        alert('Please enter reminder text');
      }
    });

    updateReminders();
  } else if (feature === 'feedback') {
    const form = document.getElementById('feedbackForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const feedback = document.getElementById('feedbackText').value.trim();
      if (feedback) {
        try {
          // Store feedback in localStorage for now
          const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
          feedbacks.push({
            user: currentUser.username,
            role: currentUser.role,
            feedback,
            date: new Date().toISOString()
          });
          localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
          alert('Feedback submitted successfully!');
          form.reset();
        } catch (error) {
          alert('Error submitting feedback: ' + error.message);
        }
      } else {
        alert('Please enter feedback');
      }
    });
  }
}

function payNow() {
  try {
    const qrContainer = document.createElement('div');
    qrContainer.innerHTML = '<img src="https://via.placeholder.com/150?text=QR+Code" alt="QR Code" class="mt-2">';
    document.getElementById('patientFeature').appendChild(qrContainer);
    alert('QR code for payment displayed!');
  } catch (error) {
    alert('Error displaying payment QR: ' + error.message);
  }
}
