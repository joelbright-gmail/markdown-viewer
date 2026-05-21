// Background service worker for Chrome extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('Linuv Markdown Viewer installed');

    // Set default theme
    chrome.storage.sync.get(['theme'], (result) => {
        if (!result.theme) {
            chrome.storage.sync.set({ theme: 'github-dark' });
        }
    });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openPopup') {
        // Open the extension popup
        chrome.action.openPopup();
    }
});

// Handle file:// protocol access
chrome.runtime.onStartup.addListener(() => {
    console.log('Linuv Markdown Viewer started');
});

// Made with Bob
