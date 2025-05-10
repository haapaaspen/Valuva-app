// This file is the entry point for client-side functionality
// It handles the connection with DaVinci Resolve and UI updates

document.addEventListener('DOMContentLoaded', () => {
  // Update UI based on Resolve connection status
  const connectionStatusElement = document.getElementById('connectionStatus');
  const resolveInfoElement = document.getElementById('resolveInfo');
  
  if (connectionStatusElement) {
    // Listen for connection status updates from main process
    window.valuvaAPI.onResolveConnection((connected) => {
      connectionStatusElement.textContent = connected ? 'Connected' : 'Disconnected';
      connectionStatusElement.className = connected ? 'connected' : 'disconnected';
      
      // If connected, get Resolve info
      if (connected) {
        getResolveInfo();
      } else {
        if (resolveInfoElement) {
          resolveInfoElement.innerHTML = '<p>Not connected to DaVinci Resolve</p>';
        }
      }
    });
  }
  
  // Check connection status on page load
  checkConnection();
  
  // Set up interval to check connection regularly
  setInterval(() => {
    window.valuvaAPI.keepAlive()
      .then(response => {
        console.log('Keep alive response:', response);
      })
      .catch(error => {
        console.error('Keep alive error:', error);
      });
  }, 10000);
  
  // Set up any buttons or UI elements
  setupUI();
});

// Get Resolve information and update the UI
function getResolveInfo() {
  const resolveInfoElement = document.getElementById('resolveInfo');
  if (!resolveInfoElement) return;
  
  window.valuvaAPI.getResolveInfo()
    .then(info => {
      if (info.error) {
        resolveInfoElement.innerHTML = `<p>Error: ${info.error}</p>`;
        return;
      }
      
      resolveInfoElement.innerHTML = `
        <p><strong>Product:</strong> ${info.productName}</p>
        <p><strong>Version:</strong> ${info.productVersion}</p>
        <p><strong>Project:</strong> ${info.projectName}</p>
        <p><strong>Timeline:</strong> ${info.timelineName}</p>
      `;
    })
    .catch(error => {
      resolveInfoElement.innerHTML = `<p>Error: ${error.message || 'Failed to get Resolve info'}</p>`;
    });
}

// Check connection status
function checkConnection() {
  window.valuvaAPI.keepAlive()
    .then(response => {
      console.log('Connection status:', response.resolveConnected ? 'Connected' : 'Disconnected');
    })
    .catch(error => {
      console.error('Connection check error:', error);
    });
}

// Set up any UI elements and event listeners
function setupUI() {
  const checkConnectionBtn = document.getElementById('checkConnection');
  if (checkConnectionBtn) {
    checkConnectionBtn.addEventListener('click', getResolveInfo);
  }
} 