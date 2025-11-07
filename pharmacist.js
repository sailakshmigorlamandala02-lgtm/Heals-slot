// Pharmacist-specific features

async function showPharmacistFeature(feature) {
  const container = document.getElementById('pharmacistFeature');
  let html = `<div class="card portal-card"><h4>${feature.charAt(0).toUpperCase() + feature.slice(1)}</h4>`;

  if (feature === 'inventory') {
    try {
      // For now, use localStorage for inventory
      const inventory = JSON.parse(localStorage.getItem(`inventory_${selectedHospital}`)) || [
        { name: 'Paracetamol', stock: 200 },
        { name: 'Insulin', stock: 50 }
      ];
      html += '<table class="table"><thead><tr><th>Medicine</th><th>Stock</th></tr></thead><tbody>' +
        inventory.map(item => `<tr><td>${item.name}</td><td>${item.stock}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading inventory: ' + error.message + '</p>';
    }
  } else if (feature === 'prescriptions') {
    try {
      const prescriptions = await getPrescriptions(selectedHospital);
      const today = new Date().toDateString();
      const todayPrescriptions = prescriptions.filter(p => new Date(p.date).toDateString() === today);
      html += `<p>Dispensed ${todayPrescriptions.length} prescriptions today.</p>`;
      html += '<table class="table"><thead><tr><th>Patient</th><th>Medicine</th><th>Doctor</th></tr></thead><tbody>' +
        todayPrescriptions.map(p => `<tr><td>${p.patientId ? p.patientId.username : 'Unknown'}</td><td>${p.medication}</td><td>${p.doctorId ? p.doctorId.username : 'Unknown'}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading prescriptions: ' + error.message + '</p>';
    }
  } else if (feature === 'stock') {
    try {
      html += '<form id="restockForm"><div class="mb-3"><label class="form-label">Medicine</label><input type="text" class="form-control" id="medicineName" placeholder="Medicine name" required><label class="form-label mt-2">Quantity</label><input type="number" class="form-control" id="quantity" placeholder="Quantity" required><button type="submit" class="btn btn-success mt-2">Restock</button></div></form>';
      html += '<div class="mt-3"><h5>Recent Restocks</h5><ul id="restockList"></ul></div>';
    } catch (error) {
      html += '<p>Error loading stock: ' + error.message + '</p>';
    }
  } else if (feature === 'billing') {
    try {
      const payments = await getPayments(selectedHospital);
      const today = new Date().toDateString();
      const todayPayments = payments.filter(p => new Date(p.date).toDateString() === today);
      const total = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      html += `<p>Pharmacy billing today: $${total}</p>`;
      html += '<table class="table"><thead><tr><th>Patient</th><th>Amount</th><th>Status</th></tr></thead><tbody>' +
        todayPayments.map(p => `<tr><td>${p.patientId ? p.patientId.username : 'Unknown'}</td><td>$${p.amount}</td><td>${p.status}</td></tr>`).join('') +
        '</tbody></table>';
    } catch (error) {
      html += '<p>Error loading billing: ' + error.message + '</p>';
    }
  } else if (feature === 'alerts') {
    try {
      const inventory = JSON.parse(localStorage.getItem(`inventory_${selectedHospital}`)) || [];
      const lowStock = inventory.filter(item => item.stock < 20);
      html += `<p>Low stock alerts: ${lowStock.length} items</p>`;
      if (lowStock.length > 0) {
        html += '<ul>' + lowStock.map(item => `<li>${item.name}: ${item.stock} units</li>`).join('') + '</ul>';
      }
    } catch (error) {
      html += '<p>Error loading alerts: ' + error.message + '</p>';
    }
  }

  html += `<button class="btn btn-secondary mt-2" onclick="backToDashboard()">Back</button></div>`;
  container.innerHTML = html;

  // Event handlers
  if (feature === 'stock') {
    const form = document.getElementById('restockForm');
    const list = document.getElementById('restockList');

    const updateRestockList = () => {
      try {
        const restocks = JSON.parse(localStorage.getItem(`restocks_${selectedHospital}`)) || [];
        list.innerHTML = restocks.map(r => `<li>${r.medicine} - ${r.quantity} units (${r.date})</li>`).join('');
      } catch (error) {
        list.innerHTML = '<li>Error loading restocks</li>';
      }
    };

    form.addEventListener('submit', e => {
      e.preventDefault();
      const medicine = document.getElementById('medicineName').value.trim();
      const quantity = parseInt(document.getElementById('quantity').value);

      if (medicine && quantity > 0) {
        try {
          const restocks = JSON.parse(localStorage.getItem(`restocks_${selectedHospital}`)) || [];
          restocks.push({
            medicine,
            quantity,
            date: new Date().toLocaleString()
          });
          localStorage.setItem(`restocks_${selectedHospital}`, JSON.stringify(restocks));

          // Update inventory
          const inventory = JSON.parse(localStorage.getItem(`inventory_${selectedHospital}`)) || [];
          const item = inventory.find(i => i.name === medicine);
          if (item) {
            item.stock += quantity;
          } else {
            inventory.push({ name: medicine, stock: quantity });
          }
          localStorage.setItem(`inventory_${selectedHospital}`, JSON.stringify(inventory));

          alert('Restocked successfully!');
          form.reset();
          updateRestockList();
        } catch (error) {
          alert('Error restocking: ' + error.message);
        }
      } else {
        alert('Please enter valid medicine name and quantity');
      }
    });

    updateRestockList();
  }
}
