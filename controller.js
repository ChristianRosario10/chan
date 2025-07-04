// ====== CONFIGURATION ======
// Set your ESP32's public URL or IP (must be HTTPS for GitHub Pages, or use a CORS proxy if needed)
const ESP32_BASE_URL = 'https:10.184.206.215'; // <-- CHANGE THIS

// ====== LOGIC ======
const relays = [1, 2, 3, 4];
const statusDiv = document.getElementById('status');

function setStatus(msg, error = false) {
    statusDiv.textContent = msg;
    statusDiv.style.color = error ? '#e53935' : '#4caf50';
}

function sendRelayCommand(relay, state) {
    setStatus('Sending...');
    // Example endpoint: /relay?num=1&state=on
    const url = `${ESP32_BASE_URL}/relay?num=${relay}&state=${state ? 'on' : 'off'}`;
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
    })
    .then(data => {
        setStatus(`Relay ${relay} turned ${state ? 'ON' : 'OFF'}`);
    })
    .catch(err => {
        setStatus('Failed: ' + err.message, true);
    });
}

relays.forEach(relay => {
    const checkbox = document.getElementById(`relay${relay}`);
    checkbox.addEventListener('change', (e) => {
        sendRelayCommand(relay, e.target.checked);
    });
});

// Optionally: Poll relay states from ESP32 to sync UI (not required for basic control) 