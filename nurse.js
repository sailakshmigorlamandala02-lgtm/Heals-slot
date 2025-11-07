// Nurse-specific features

async function showNurseFeature(feature) {
  const container = document.getElementById('nurseFeature');
  let html = `<div class="card portal-card"><h4>${feature.charAt(0).toUpperCase() + feature.slice(1)}</h4>`;

  if (feature === 'schedule') {
    try {
      // For now, use localStorage for schedules
      const schedule = JSON.parse(localStorage.getItem(`schedule_${currentUser.username}`)) || { shift: '7 AM to 3 PM' };
      html += `<p>Shift schedule for ${currentUser.username} – ${schedule.shift}.</p>`;
      html += '<form id="updateScheduleForm"><div class="mb-3"><label class="form-label">Update Shift</label><input type="text" class="form-control" id="newShift" placeholder="e.g., 9 AM to 5 PM" required><button type="submit" class="btn btn-success mt-2">Update</button></div></form>';
    } catch (error) {
      html += '<p>Error loading schedule: ' + error.message + '</p>';
    }
  } else if (feature === 'monitoring') {
    try {
      // For now, use localStorage for patient monitoring
      const monitoring = JSON.parse(localStorage.getItem(`monitoring_${selectedHospital}`)) || [
        { patient: 'John Doe', room: '101', vitals: 'BP 120/80' }
      ];
      html += '<table class="table"><thead><tr><th>Patient</th><th>Room</th><th>Vitals</th></tr></thead><tbody>' +
        monitoring.map(m => `<tr><td>${m.patient}</td><td>${m.room}</td><td>${m.vitals}</td></tr>`).join('') +
        '</tbody></table>';
      html += '<form id="addVitalsForm"><div class="mb-3"><label class="form-label">Patient</label><input type="text" class="form-control" id="patientName" placeholder="Patient name" required><label class="form-label mt-2">Room</label><input type="text" class="form-control" id="roomNumber" placeholder="Room number" required><label class="form-label mt-2">Vitals</label><input type="text" class="form-control" id="vitals" placeholder="e.g., BP 120/80" required><button type="submit" class="btn btn-success mt-2">Add/Update Vitals</button></div></form>';
    } catch (error) {
      html += '<p>Error loading monitoring data: ' + error.message + '</p>';
    }
  } else if (feature === 'appointments') {
    try {
      const appointments = await getAppointments(selectedHospital);
      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(a => new Date(a.date).toDateString() === today);
      html += `<p>Assisting appointments today: ${todayAppointments.length}.</p>`;
      html += '<table class="table"><thead><tr><th>Patient</th><th>Doctor</th><th>Time</th></tr></thead><tbody>' +
        todayAppointments.map(a => `<tr><td>${a.patientId ? a.patientId.username : 'Unknown'}</td><td>${a.doctorId ? a.doctorId.username : 'Unknown'}</td><td>${a.time}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading appointments: ' + error.message + '</p>';
    }
  } else if (feature === 'medication') {
    try {
      html += '<div id="medicationRounds"><h5>Medication Rounds</h5><ul id="roundsList"></ul></div>';
      html += '<form id="addRoundForm"><div class="mb-3"><label class="form-label">Patient</label><input type="text" class="form-control" id="roundPatient" placeholder="Patient name" required><label class="form-label mt-2">Medication</label><input type="text" class="form-control" id="roundMed" placeholder="Medication" required><button type="submit" class="btn btn-success mt-2">Record Round</button></div></form>';
    } catch (error) {
      html += '<p>Error loading medication: ' + error.message + '</p>';
    }
  } else if (feature === 'careplan') {
    try {
      html += '<div id="carePlans"><h5>Care Plans</h5><ul id="plansList"></ul></div>';
      html += '<form id="addPlanForm"><div class="mb-3"><label class="form-label">Patient</label><input type="text" class="form-control" id="planPatient" placeholder="Patient name" required><label class="form-label mt-2">Plan Details</label><textarea class="form-control" id="planDetails" placeholder="Care plan details" required></textarea><button type="submit" class="btn btn-success mt-2">Update Plan</button></div></form>';
    } catch (error) {
      html += '<p>Error loading care plan: ' + error.message + '</p>';
    }
  } else if (feature === 'inventory') {
    try {
      html += '<div id="inventoryRequests"><h5>Inventory Requests</h5><ul id="requestsList"></ul></div>';
      html += '<form id="requestItemForm"><div class="mb-3"><label class="form-label">Item</label><input type="text" class="form-control" id="itemName" placeholder="Item name" required><label class="form-label mt-2">Quantity</label><input type="number" class="form-control" id="itemQuantity" placeholder="Quantity" required><button type="submit" class="btn btn-success mt-2">Request Item</button></div></form>';
    } catch (error) {
      html += '<p>Error loading inventory: ' + error.message + '</p>';
    }
  }

  html += `<button class="btn btn-secondary mt-2" onclick="backToDashboard()">Back</button></div>`;
  container.innerHTML = html;

  // Event handlers
  if (feature === 'schedule') {
    const form = document.getElementById('updateScheduleForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const newShift = document.getElementById('newShift').value.trim();
      if (newShift) {
        try {
          localStorage.setItem(`schedule_${currentUser.username}`, JSON.stringify({ shift: newShift }));
          alert('Schedule updated successfully!');
          form.reset();
        } catch (error) {
          alert('Error updating schedule: ' + error.message);
        }
      } else {
        alert('Please enter a new shift');
      }
    });
  } else if (feature === 'monitoring') {
    const form = document.getElementById('addVitalsForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const patient = document.getElementById('patientName').value.trim();
      const room = document.getElementById('roomNumber').value.trim();
      const vitals = document.getElementById('vitals').value.trim();

      if (patient && room && vitals) {
        try {
          const monitoring = JSON.parse(localStorage.getItem(`monitoring_${selectedHospital}`)) || [];
          const existing = monitoring.find(m => m.patient === patient);
          if (existing) {
            existing.room = room;
            existing.vitals = vitals;
          } else {
            monitoring.push({ patient, room, vitals });
          }
          localStorage.setItem(`monitoring_${selectedHospital}`, JSON.stringify(monitoring));
          alert('Vitals updated successfully!');
          form.reset();
          // Refresh the table
          showNurseFeature('monitoring');
        } catch (error) {
          alert('Error updating vitals: ' + error.message);
        }
      } else {
        alert('Please fill in all fields');
      }
    });
  } else if (feature === 'medication') {
    const form = document.getElementById('addRoundForm');
    const list = document.getElementById('roundsList');

    const updateRounds = () => {
      try {
        const rounds = JSON.parse(localStorage.getItem(`medicationRounds_${selectedHospital}`)) || [];
        list.innerHTML = rounds.map(r => `<li>${r.patient} - ${r.medication} (${r.time})</li>`).join('');
      } catch (error) {
        list.innerHTML = '<li>Error loading rounds</li>';
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const patient = document.getElementById('roundPatient').value.trim();
      const med = document.getElementById('roundMed').value.trim();

      if (patient && med) {
        try {
          const rounds = JSON.parse(localStorage.getItem(`medicationRounds_${selectedHospital}`)) || [];
          rounds.push({
            patient,
            medication: med,
            time: new Date().toLocaleString()
          });
          localStorage.setItem(`medicationRounds_${selectedHospital}`, JSON.stringify(rounds));
          alert('Medication round recorded!');
          form.reset();
          updateRounds();
        } catch (error) {
          alert('Error recording round: ' + error.message);
        }
      } else {
        alert('Please fill in all fields');
      }
    });

    updateRounds();
  } else if (feature === 'careplan') {
    const form = document.getElementById('addPlanForm');
    const list = document.getElementById('plansList');

    const updatePlans = () => {
      try {
        const plans = JSON.parse(localStorage.getItem(`carePlans_${selectedHospital}`)) || [];
        list.innerHTML = plans.map(p => `<li>${p.patient}: ${p.details} (${p.time})</li>`).join('');
      } catch (error) {
        list.innerHTML = '<li>Error loading plans</li>';
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const patient = document.getElementById('planPatient').value.trim();
      const details = document.getElementById('planDetails').value.trim();

      if (patient && details) {
        try {
          const plans = JSON.parse(localStorage.getItem(`carePlans_${selectedHospital}`)) || [];
          plans.push({
            patient,
            details,
            time: new Date().toLocaleString()
          });
          localStorage.setItem(`carePlans_${selectedHospital}`, JSON.stringify(plans));
          alert('Care plan updated!');
          form.reset();
          updatePlans();
        } catch (error) {
          alert('Error updating plan: ' + error.message);
        }
      } else {
        alert('Please fill in all fields');
      }
    });

    updatePlans();
  } else if (feature === 'inventory') {
    const form = document.getElementById('requestItemForm');
    const list = document.getElementById('requestsList');

    const updateRequests = () => {
      try {
        const requests = JSON.parse(localStorage.getItem(`inventoryRequests_${selectedHospital}`)) || [];
        list.innerHTML = requests.map(r => `<li>${r.item} - ${r.quantity} units (${r.time})</li>`).join('');
      } catch (error) {
        list.innerHTML = '<li>Error loading requests</li>';
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const item = document.getElementById('itemName').value.trim();
      const quantity = parseInt(document.getElementById('itemQuantity').value);

      if (item && quantity > 0) {
        try {
          const requests = JSON.parse(localStorage.getItem(`inventoryRequests_${selectedHospital}`)) || [];
          requests.push({
            item,
            quantity,
            time: new Date().toLocaleString()
          });
          localStorage.setItem(`inventoryRequests_${selectedHospital}`, JSON.stringify(requests));
          alert('Inventory request submitted!');
          form.reset();
          updateRequests();
        } catch (error) {
          alert('Error submitting request: ' + error.message);
        }
      } else {
        alert('Please enter valid item name and quantity');
      }
    });

    updateRequests();
  }
}
