// Doctor-specific features

async function showDoctorFeature(feature) {
  const container = document.getElementById('doctorFeature');
  let html = '<div class="card portal-card"><h4>' + feature.charAt(0).toUpperCase() + feature.slice(1) + '</h4>';

  if (feature === 'freeslots') {
    try {
      html += `
        <form id="addFreeSlotForm">
          <div class="mb-3"><label class="form-label">Date</label><input type="date" class="form-control" id="freeDate" required></div>
          <div class="mb-3"><label class="form-label">Time (30-min)</label>
            <select class="form-select" id="freeTime" required>
              <option value="" disabled selected>Select time</option>
              <option value="09:00">09:00</option><option value="09:30">09:30</option>
              <option value="10:00">10:00</option><option value="10:30">10:30</option>
              <option value="11:00">11:00</option><option value="11:30">11:30</option>
              <option value="12:00">12:00</option><option value="12:30">12:30</option>
              <option value="13:00">13:00</option><option value="13:30">13:30</option>
              <option value="14:00">14:00</option><option value="14:30">14:30</option>
              <option value="15:00">15:00</option><option value="15:30">15:30</option>
              <option value="16:00">16:00</option><option value="16:30">16:30</option>
              <option value="17:00">17:00</option>
            </select>
          </div>
          <button type="submit" class="btn btn-success">Add Slot</button>
        </form>
        <div class="mt-4"><h5>My Free Slots</h5>
          <table class="table"><thead><tr><th>Date</th><th>Time</th><th>Remove</th></tr></thead>
          <tbody id="mySlots"></tbody></table>
        </div>`;
    } catch (error) {
      html += '<p>Error loading free slots: ' + error.message + '</p>';
    }
  }
  else if (feature === 'appointments') {
    try {
      const appointments = await getAppointments(selectedHospital);
      const doctorAppointments = appointments.filter(a => a.doctorId && a.doctorId.username === currentUser.username);
      html += '<table class="table"><thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Type</th></tr></thead><tbody>' +
        doctorAppointments.map(a => `<tr><td>${a.patientId ? a.patientId.username : 'Unknown'}</td><td>${new Date(a.date).toLocaleDateString()}</td><td>${a.time || 'N/A'}</td><td>${a.type || 'General'}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading appointments: ' + error.message + '</p>';
    }
  } else if (feature === 'prescriptions') {
    try {
      html += `
        <form id="prescribeForm">
          <div class="mb-3"><label class="form-label">Patient</label><input type="text" class="form-control" id="prescPatient" placeholder="Patient Name" required></div>
          <div class="mb-3"><label class="form-label">Medication</label><input type="text" class="form-control" id="prescMed" placeholder="Medication" required></div>
          <button type="submit" class="btn btn-success">Prescribe</button>
        </form>
        <div class="mt-4"><h5>Prescribed</h5><ul id="prescList"></ul></div>`;
    } catch (error) {
      html += '<p>Error loading prescriptions: ' + error.message + '</p>';
    }
  } else if (feature === 'telemedicine') {
    try {
      html += `
        <form id="docUploadForm">
          <div class="mb-3"><label class="form-label">Upload Report / Image</label><input type="file" class="form-control" id="docFile" required></div>
          <button type="submit" class="btn btn-primary">Upload File</button>
        </form>
        <div class="mt-3"><h6>Your Uploads</h6><ul id="docUploadList"></ul></div>
        <div class="mt-3"><h6>Patient Uploads</h6><ul id="patientUploadList"></ul></div>`;
    } catch (error) {
      html += '<p>Error loading telemedicine: ' + error.message + '</p>';
    }
  } else if (feature === 'records') {
    try {
      html += '<form id="recordsForm"><div class="mb-3"><label class="form-label">Patient Username</label><input type="text" class="form-control" id="patientIdInput" placeholder="Enter Patient Username" required><button type="submit" class="btn btn-primary mt-2">View Records</button></div></form><div id="recordsResult"></div>';
    } catch (error) {
      html += '<p>Error loading records: ' + error.message + '</p>';
    }
  } else if (feature === 'reports') {
    try {
      // For now, use localStorage for reports
      const reports = JSON.parse(localStorage.getItem(`doctorReports_${currentUser.username}`)) || [
        { id: 'RPT001', date: '2025-09-01', type: 'Patient Summary' }
      ];
      html += '<table class="table"><thead><tr><th>Report ID</th><th>Date</th><th>Type</th></tr></thead><tbody>' +
        reports.map(r => `<tr><td>${r.id}</td><td>${r.date}</td><td>${r.type}</td></tr>`).join('') +
        '</tbody></table>';
      html += '<form id="addReportForm"><div class="mb-3"><label class="form-label">Report Type</label><input type="text" class="form-control" id="reportType" placeholder="e.g., Patient Summary" required><button type="submit" class="btn btn-success mt-2">Add Report</button></div></form>';
    } catch (error) {
      html += '<p>Error loading reports: ' + error.message + '</p>';
    }
  }

  html += '<button class="btn btn-secondary mt-2" onclick="backToDashboard()">Back</button></div>';
  container.innerHTML = html;

  // Event handlers
  if (feature === 'freeslots') {
    const form = document.getElementById('addFreeSlotForm');
    const table = document.getElementById('mySlots');

    const updateTable = () => {
      try {
        const allSlots = JSON.parse(localStorage.getItem('freeSlots')) || [];
        const mySlots = allSlots.filter(s => s.doctorUsername === currentUser.username);
        table.innerHTML = mySlots.map((s, i) => `
          <tr>
            <td>${s.date}</td>
            <td>${s.time}</td>
            <td><button class="btn btn-sm btn-danger" onclick="removeSlot('${s.date}', '${s.time}')">X</button></td>
          </tr>`).join('');
      } catch (error) {
        table.innerHTML = '<tr><td colspan="3">Error loading slots</td></tr>';
      }
    };

    window.removeSlot = (date, time) => {
      try {
        const allSlots = JSON.parse(localStorage.getItem('freeSlots')) || [];
        const updatedSlots = allSlots.filter(s => !(s.doctorUsername === currentUser.username && s.date === date && s.time === time));
        localStorage.setItem('freeSlots', JSON.stringify(updatedSlots));
        updateTable();
      } catch (error) {
        alert('Error removing slot: ' + error.message);
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const date = document.getElementById('freeDate').value;
      const time = document.getElementById('freeTime').value;

      if (!date || !time) {
        alert('Please select both date and time.');
        return;
      }

      try {
        const allSlots = JSON.parse(localStorage.getItem('freeSlots')) || [];

        // Prevent duplicate slot
        const exists = allSlots.some(s => s.doctorUsername === currentUser.username && s.date === date && s.time === time);
        if (exists) {
          alert('This slot is already added.');
          return;
        }

        allSlots.push({ doctorId: currentUser.id, doctorUsername: currentUser.username, date, time });
        localStorage.setItem('freeSlots', JSON.stringify(allSlots));
        alert('Free slot added successfully!');
        form.reset();
        updateTable();
      } catch (error) {
        alert('Error adding slot: ' + error.message);
      }
    });

    // Initial render
    updateTable();
  }
  else if (feature === 'prescriptions') {
    const form = document.getElementById('prescribeForm');
    const list = document.getElementById('prescList');

    const updateList = async () => {
      try {
        const prescriptions = await getPrescriptions(selectedHospital);
        const doctorPrescriptions = prescriptions.filter(p => p.doctorId && p.doctorId.username === currentUser.username);
        list.innerHTML = doctorPrescriptions.map(p => `<li>${p.medication} for ${p.patientId ? p.patientId.username : 'Unknown'} (${new Date(p.date).toLocaleDateString()})</li>`).join('');
      } catch (error) {
        list.innerHTML = '<li>Error loading prescriptions</li>';
      }
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const pat = document.getElementById('prescPatient').value.trim();
      const med = document.getElementById('prescMed').value.trim();
      if (pat && med) {
        try {
          // Find patient by username
          const patients = await getUsers(selectedHospital, 'patient');
          const patient = patients.find(p => p.username === pat);
          if (!patient) {
            alert('Patient not found!');
            return;
          }

          await createPrescription({
            patientId: patient._id,
            doctorId: currentUser.id,
            medication: med,
            date: new Date(),
            hospital: selectedHospital
          });
          alert('Prescription added!');
          form.reset();
          updateList();
        } catch (error) {
          alert('Error adding prescription: ' + error.message);
        }
      } else {
        alert('Please fill in all fields');
      }
    });
    updateList();
  } else if (feature === 'telemedicine') {
    const form = document.getElementById('docUploadForm');
    const docList = document.getElementById('docUploadList');
    const patList = document.getElementById('patientUploadList');

    const updateDocList = () => {
      try {
        const uploads = JSON.parse(localStorage.getItem(`doctorUploads_${currentUser.username}`)) || [];
        docList.innerHTML = uploads.map(f => `<li>${f.fileName} (${f.date})</li>`).join('');
      } catch (error) {
        docList.innerHTML = '<li>Error loading uploads</li>';
      }
    };

    const updatePatList = () => {
      try {
        // For now, show all patient uploads (in a real app, this would be filtered)
        const allUploads = JSON.parse(localStorage.getItem('patientUploads')) || {};
        const uploads = Object.entries(allUploads).flatMap(([pat, files]) => files.map(f => ({...f, patient: pat})));
        patList.innerHTML = uploads.map(f => `<li>${f.fileName} from ${f.patient} (${f.date})</li>`).join('');
      } catch (error) {
        patList.innerHTML = '<li>Error loading patient uploads</li>';
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const file = document.getElementById('docFile').files[0];
      if (file) {
        try {
          const uploads = JSON.parse(localStorage.getItem(`doctorUploads_${currentUser.username}`)) || [];
          uploads.push({ fileName: file.name, date: new Date().toLocaleDateString() });
          localStorage.setItem(`doctorUploads_${currentUser.username}`, JSON.stringify(uploads));
          alert(`Uploaded: ${file.name}`);
          updateDocList();
        } catch (error) {
          alert('Error uploading file: ' + error.message);
        }
      } else {
        alert('Please select a file');
      }
    });
    updateDocList();
    updatePatList();
  } else if (feature === 'records') {
    const form = document.getElementById('recordsForm');
    const result = document.getElementById('recordsResult');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const patientUsername = document.getElementById('patientIdInput').value.trim();
      if (patientUsername) {
        try {
          const patients = await getUsers(selectedHospital, 'patient');
          const patient = patients.find(p => p.username === patientUsername);
          if (!patient) {
            result.innerHTML = '<p>Patient not found</p>';
            return;
          }
          const history = await getMedicalHistory(patient._id);
          result.innerHTML = '<h5>Medical History:</h5><ul>' +
            history.map(h => `<li>${h.test}: ${h.details} (${new Date(h.date).toLocaleDateString()})</li>`).join('') +
            '</ul>';
        } catch (error) {
          result.innerHTML = '<p>Error loading records: ' + error.message + '</p>';
        }
      } else {
        alert('Please enter a patient username');
      }
    });
  } else if (feature === 'reports') {
    const form = document.getElementById('addReportForm');

    const updateReports = () => {
      try {
        const reports = JSON.parse(localStorage.getItem(`doctorReports_${currentUser.username}`)) || [];
        const table = document.querySelector('#doctorFeature table tbody');
        table.innerHTML = reports.map(r => `<tr><td>${r.id}</td><td>${r.date}</td><td>${r.type}</td></tr>`).join('');
      } catch (error) {
        alert('Error updating reports: ' + error.message);
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const type = document.getElementById('reportType').value.trim();
      if (type) {
        try {
          const reports = JSON.parse(localStorage.getItem(`doctorReports_${currentUser.username}`)) || [];
          const newId = 'RPT' + String(reports.length + 1).padStart(3, '0');
          reports.push({ id: newId, date: new Date().toISOString().split('T')[0], type });
          localStorage.setItem(`doctorReports_${currentUser.username}`, JSON.stringify(reports));
          alert('Report added!');
          form.reset();
          updateReports();
        } catch (error) {
          alert('Error adding report: ' + error.message);
        }
      } else {
        alert('Please enter report type');
      }
    });

    updateReports();
  }
}
