// Popup script for settings

// Load saved settings
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['theme', 'offlineMode'], function (result) {
        document.getElementById('theme').value = result.theme || 'github-dark';
        document.getElementById('offlineMode').checked = result.offlineMode || false;
    });

    // Save settings on change
    document.getElementById('theme').addEventListener('change', saveSettings);
    document.getElementById('offlineMode').addEventListener('change', saveSettings);
});

function saveSettings() {
    const theme = document.getElementById('theme').value;
    const offlineMode = document.getElementById('offlineMode').checked;

    chrome.storage.sync.set({
        theme: theme,
        offlineMode: offlineMode
    }, function () {
        // Show status message
        const status = document.getElementById('status');
        status.classList.add('show', 'success');

        setTimeout(() => {
            status.classList.remove('show', 'success');
        }, 2000);

        // Reload all markdown tabs
        chrome.tabs.query({ url: 'file:///*.md' }, function (tabs) {
            tabs.forEach(tab => {
                chrome.tabs.reload(tab.id);
            });
        });

        chrome.tabs.query({ url: 'file:///*.markdown' }, function (tabs) {
            tabs.forEach(tab => {
                chrome.tabs.reload(tab.id);
            });
        });
    });
}

// Made with Bob
