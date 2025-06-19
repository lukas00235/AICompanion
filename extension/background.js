// Background service worker for AI Text Assistant
chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Text Assistant extension installed');
});

// Store extension state
let extensionState = {
    isActive: false,
    currentTab: null,
    apiEndpoint: 'http://localhost:5000/api'
};

// Message handling from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);

    if (request.source === 'content-script') {
        handleContentScriptMessage(request, sender);
    } else if (request.source === 'popup') {
        handlePopupMessage(request, sender, sendResponse);
    }
});

// Handle messages from content scripts
function handleContentScriptMessage(message, sender) {
    switch (message.type) {
        case 'PAGE_DETECTED':
            // Store tab information
            if (sender.tab) {
                extensionState.currentTab = sender.tab.id;
                
                // If text was detected, process it with AI
                if (message.assignmentText) {
                    processTextWithAI(message.assignmentText, sender.tab.id);
                }
            }
            break;

        case 'TYPING_STARTED':
        case 'TYPING_STOPPED':
        case 'TYPING_PAUSED':
        case 'TYPING_RESUMED':
        case 'TYPING_PROGRESS':
            // Forward status updates to popup if open
            notifyPopup(message);
            break;

        case 'ERROR':
            console.error('Content script error:', message.message);
            notifyPopup(message);
            break;
    }
}

// Handle messages from popup
function handlePopupMessage(message, sender, sendResponse) {
    switch (message.action) {
        case 'GET_EXTENSION_STATE':
            sendResponse(extensionState);
            break;

        case 'START_TYPING':
            if (extensionState.currentTab) {
                chrome.tabs.sendMessage(extensionState.currentTab, {
                    action: 'START_TYPING',
                    typingSpeed: message.typingSpeed
                }, (response) => {
                    sendResponse(response);
                });
            } else {
                sendResponse({ success: false, error: 'No active tab' });
            }
            return true;

        case 'STOP_TYPING':
            if (extensionState.currentTab) {
                chrome.tabs.sendMessage(extensionState.currentTab, {
                    action: 'STOP_TYPING'
                }, (response) => {
                    sendResponse(response);
                });
            } else {
                sendResponse({ success: false, error: 'No active tab' });
            }
            return true;

        case 'PAUSE_TYPING':
            if (extensionState.currentTab) {
                chrome.tabs.sendMessage(extensionState.currentTab, {
                    action: 'PAUSE_TYPING'
                }, (response) => {
                    sendResponse(response);
                });
            } else {
                sendResponse({ success: false, error: 'No active tab' });
            }
            return true;

        case 'PROCESS_TEXT':
            processTextWithAI(message.text, extensionState.currentTab)
                .then((result) => {
                    sendResponse({ success: true, result });
                })
                .catch((error) => {
                    sendResponse({ success: false, error: error.message });
                });
            return true;

        case 'DETECT_CURRENT_PAGE':
            detectCurrentPage(sendResponse);
            return true;

        case 'UPDATE_SETTINGS':
            if (extensionState.currentTab) {
                chrome.tabs.sendMessage(extensionState.currentTab, {
                    action: 'UPDATE_SETTINGS',
                    settings: message.settings
                }, (response) => {
                    sendResponse(response);
                });
            } else {
                sendResponse({ success: false, error: 'No active tab' });
            }
            return true;
    }
}

// Process text with AI backend
async function processTextWithAI(text, tabId) {
    try {
        const response = await fetch(`${extensionState.apiEndpoint}/process-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                typingSpeed: 100,
                aiModel: 'gpt-4o'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Send processed text to content script
        if (tabId) {
            chrome.tabs.sendMessage(tabId, {
                action: 'SET_PROCESSED_TEXT',
                text: result.processedText
            });
        }

        return result;
    } catch (error) {
        console.error('Error processing text with AI:', error);
        throw error;
    }
}

// Detect current page and its content
function detectCurrentPage(sendResponse) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) {
            sendResponse({ success: false, error: 'No active tab' });
            return;
        }

        const activeTab = tabs[0];
        extensionState.currentTab = activeTab.id;

        // Check if we're on zav.cz
        const isZavCz = activeTab.url && activeTab.url.includes('zav.cz');

        if (!isZavCz) {
            sendResponse({
                success: true,
                isSupported: false,
                website: 'unknown',
                hasTypingExercise: false
            });
            return;
        }

        // Send message to content script to detect page content
        chrome.tabs.sendMessage(activeTab.id, { action: 'DETECT_PAGE' }, (response) => {
            if (chrome.runtime.lastError) {
                // Content script not loaded, inject it
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    files: ['content-script.js']
                }, () => {
                    // Try again after injection
                    setTimeout(() => {
                        chrome.tabs.sendMessage(activeTab.id, { action: 'DETECT_PAGE' }, (response) => {
                            sendResponse({
                                success: true,
                                isSupported: true,
                                website: 'zav.cz',
                                hasTypingExercise: response ? response.hasTypingExercise : false,
                                assignmentText: response ? response.assignmentText : ''
                            });
                        });
                    }, 1000);
                });
            } else {
                sendResponse({
                    success: true,
                    isSupported: true,
                    website: 'zav.cz',
                    hasTypingExercise: response ? response.hasTypingExercise : false,
                    assignmentText: response ? response.assignmentText : ''
                });
            }
        });
    });
}

// Notify popup of updates (if popup is open)
function notifyPopup(message) {
    // Note: In Manifest V3, we can't directly communicate with popup
    // This would need to be implemented with chrome.storage or other methods
    console.log('Background notification for popup:', message);
}

// Tab change detection
chrome.tabs.onActivated.addListener((activeInfo) => {
    extensionState.currentTab = activeInfo.tabId;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('zav.cz')) {
        extensionState.currentTab = tabId;
        
        // Auto-inject content script if needed
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content-script.js']
        }).catch(() => {
            // Script might already be injected, ignore error
        });
    }
});

console.log('AI Text Assistant background script loaded');
