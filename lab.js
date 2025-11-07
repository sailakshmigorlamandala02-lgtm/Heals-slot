// Lab Technician-specific features

async function showLabFeature(feature) {
  const container = document.getElementById('labFeature');
  let html = `<div class="card portal-card"><h4>${feature.charAt(0).toUpperCase() + feature.slice(1)}</h4>`;

  if (feature === 'queue') {
    try {
      // For now, use localStorage for lab queue
      const queue = JSON.parse(localStorage.getItem(`labQueue_${selectedHospital}`)) || [
        { id: 'LAB001', type: 'Blood', patient: 'John Doe', status: 'Pending' },
        { id: 'LAB002', type: 'Urine', patient: 'Jane Smith', status: 'Pending' },
        { id: 'LAB003', type: 'X-Ray', patient: 'Bob Johnson', status: 'Processing' },
        { id: 'LAB004', type: 'Culture', patient: 'Alice Brown', status: 'Pending' }
      ];
      const pending = queue.filter(q => q.status === 'Pending');
      html += `<p>Pending samples: ${pending.length}</p>`;
      html += '<table class="table"><thead><tr><th>Sample ID</th><th>Type</th><th>Patient</th><th>Status</th></tr></thead><tbody>' +
        queue.map(q => `<tr><td>${q.id}</td><td>${q.type}</td><td>${q.patient}</td><td>${q.status}</td></tr>`).join('') +
        '</tbody></table>';
      html += '<form id="addSampleForm"><div class="mb-3"><label class="form-label">Sample Type</label><input type="text" class="form-control" id="sampleType" placeholder="e.g., Blood" required><label class="form-label mt-2">Patient</label><input type="text" class="form-control" id="samplePatient" placeholder="Patient name" required><button type="submit" class="btn btn-success mt-2">Add Sample</button></div></form>';
    } catch (error) {
      html += '<p>Error loading queue: ' + error.message + '</p>';
    }
  } else if (feature === 'results') {
    try {
      html += '<div id="resultsList"><h5>Uploaded Results</h5><ul id="resultsUl"></ul></div>';
      html += `<form id="uploadResultForm">
                 <div class="mb-3"><label class="form-label">Sample ID</label><input type="text" class="form-control" id="resultSampleId" placeholder="Sample ID" required></div>
                 <div class="mb-3"><label class="form-label">Result File</label><input type="file" class="form-control" id="resultFile" required></div>
                 <button type="submit" class="btn btn-success">Upload</button>
               </form>`;
    } catch (error) {
      html += '<p>Error loading results: ' + error.message + '</p>';
    }
  } else if (feature === 'notifications') {
    try {
      const notifications = JSON.parse(localStorage.getItem(`labNotifications_${selectedHospital}`)) || [
        { message: 'Critical result for patient Jane', type: 'Alert', time: new Date().toLocaleString() }
      ];
      html += '<ul>' + notifications.map(n => `<li>${n.message} (${n.time})</li>`).join('') + '</ul>';
      html += '<form id="addNotificationForm"><div class="mb-3"><label class="form-label">Notification</label><textarea class="form-control" id="notificationText" placeholder="Notification message" required></textarea><button type="submit" class="btn btn-success mt-2">Add Notification</button></div></form>';
    } catch (error) {
      html += '<p>Error loading notifications: ' + error.message + '</p>';
    }
  }

  html += `<button class="btn btn-secondary mt-2" onclick="backToDashboard()">Back</button></div>`;
  container.innerHTML = html;

  // Event handlers
  if (feature === 'queue') {
    const form = document.getElementById('addSampleForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const type = document.getElementById('sampleType').value.trim();
      const patient = document.getElementById('samplePatient').value.trim();

      if (type && patient) {
        try {
          const queue = JSON.parse(localStorage.getItem(`labQueue_${selectedHospital}`)) || [];
          const newId = 'LAB' + String(queue.length + 1).padStart(3, '0');
          queue.push({
            id: newId,
            type,
            patient,
            status: 'Pending'
          });
          localStorage.setItem(`labQueue_${selectedHospital}`, JSON.stringify(queue));
          alert('Sample added to queue!');
          form.reset();
          // Refresh the queue
          showLabFeature('queue');
        } catch (error) {
          alert('Error adding sample: ' + error.message);
        }
      } else {
        alert('Please fill in all fields');
      }
    });
  } else if (feature === 'results') {
    const form = document.getElementById('uploadResultForm');
    const list = document.getElementById('resultsUl');

    const updateResults = () => {
      try {
        const results = JSON.parse(localStorage.getItem(`labResults_${selectedHospital}`)) || [];
        list.innerHTML = results.map(r => `<li>${r.sampleId}: ${r.fileName} (${r.time})</li>`).join('');
      } catch (error) {
        list.innerHTML = '<li>Error loading results</li>';
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const sampleId = document.getElementById('resultSampleId').value.trim();
      const file = document.getElementById('resultFile').files[0];

      if (sampleId && file) {
        try {
          const results = JSON.parse(localStorage.getItem(`labResults_${selectedHospital}`)) || [];
          results.push({
            sampleId,
            fileName: file.name,
            time: new Date().toLocaleString()
          });
          localStorage.setItem(`labResults_${selectedHospital}`, JSON.stringify(results));
          alert('Result uploaded successfully!');
          form.reset();
          updateResults();
        } catch (error) {
          alert('Error uploading result: ' + error.message);
        }
      } else {
        alert('Please select a file and enter sample ID');
      }
    });

    updateResults();
  } else if (feature === 'notifications') {
    const form = document.getElementById('addNotificationForm');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const text = document.getElementById('notificationText').value.trim();

      if (text) {
        try {
          const notifications = JSON.parse(localStorage.getItem(`labNotifications_${selectedHospital}`)) || [];
          notifications.push({
            message: text,
            type: 'Manual',
            time: new Date().toLocaleString()
          });
          localStorage.setItem(`labNotifications_${selectedHospital}`, JSON.stringify(notifications));
          alert('Notification added!');
          form.reset();
          // Refresh notifications
          showLabFeature('notifications');
        } catch (error) {
          alert('Error adding notification: ' + error.message);
        }
      } else {
        alert('Please enter notification message');
      }
    });
  }
}
