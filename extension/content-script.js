// Content script for zav.cz typing exercise detection and automation
(function() {
    'use strict';

    let isActive = false;
    let isPaused = false;
    let typingSpeed = 100; // characters per minute
    let currentText = '';
    let processedText = '';
    let typingIndex = 0;
    let typingInterval = null;

    // Czech character support
    const czechChars = {
        'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e',
        'í': 'i', 'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's',
        'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z',
        'Á': 'A', 'Č': 'C', 'Ď': 'D', 'É': 'E', 'Ě': 'E',
        'Í': 'I', 'Ň': 'N', 'Ó': 'O', 'Ř': 'R', 'Š': 'S',
        'Ť': 'T', 'Ú': 'U', 'Ů': 'U', 'Ý': 'Y', 'Ž': 'Z'
    };

    // Detect typing input fields on zav.cz
    function detectTypingFields() {
        const selectors = [
            'textarea[placeholder*="text"]',
            'textarea[id*="typing"]',
            'textarea[class*="exercise"]',
            'input[type="text"][placeholder*="zadán"]',
            'div[contenteditable="true"]',
            'textarea',
            'input[type="text"]'
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                return Array.from(elements);
            }
        }
        return [];
    }

    // Extract text assignment from page
    function extractAssignmentText() {
        const textSelectors = [
            '[class*="assignment"]',
            '[class*="exercise"]',
            '[class*="text-to-type"]',
            '.exercise-text',
            '.typing-text',
            'p:contains("Napište")',
            'div:contains("Text:")'
        ];

        for (const selector of textSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim().length > 50) {
                return element.textContent.trim();
            }
        }

        // Fallback: look for any substantial text content
        const paragraphs = document.querySelectorAll('p, div');
        for (const p of paragraphs) {
            const text = p.textContent.trim();
            if (text.length > 100 && text.includes('Text') || text.includes('Napište')) {
                return text;
            }
        }

        return '';
    }

    // Simulate realistic typing with Czech characters
    function simulateTyping(targetElement, text) {
        if (!text || typingIndex >= text.length) {
            stopTyping();
            return;
        }

        const char = text[typingIndex];
        const currentValue = targetElement.value || targetElement.textContent || '';
        
        // Add character to input
        if (targetElement.tagName.toLowerCase() === 'textarea' || targetElement.tagName.toLowerCase() === 'input') {
            targetElement.value = currentValue + char;
            targetElement.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            targetElement.textContent = currentValue + char;
            targetElement.dispatchEvent(new Event('input', { bubbles: true }));
        }

        typingIndex++;

        // Calculate delay based on typing speed (with some randomness for realism)
        const baseDelay = 60000 / typingSpeed; // milliseconds per character
        const randomFactor = 0.3; // 30% randomness
        const delay = baseDelay * (1 + (Math.random() - 0.5) * randomFactor);

        // Additional delay for Czech special characters
        const additionalDelay = czechChars[char] ? 50 : 0;

        // Send progress update
        sendProgressUpdate();

        typingInterval = setTimeout(() => {
            if (isActive && !isPaused) {
                simulateTyping(targetElement, text);
            }
        }, delay + additionalDelay);
    }

    // Start typing process
    function startTyping() {
        if (isActive) return;

        const typingFields = detectTypingFields();
        if (typingFields.length === 0) {
            sendMessage({
                type: 'ERROR',
                message: 'Žádné psací pole nenalezeno na této stránce'
            });
            return;
        }

        if (!processedText) {
            sendMessage({
                type: 'ERROR',
                message: 'Žádný zpracovaný text k napsání'
            });
            return;
        }

        isActive = true;
        typingIndex = 0;
        
        // Use the first detected typing field
        const targetField = typingFields[0];
        targetField.focus();

        sendMessage({
            type: 'TYPING_STARTED',
            targetElement: targetField.tagName,
            textLength: processedText.length
        });

        simulateTyping(targetField, processedText);
    }

    // Stop typing process
    function stopTyping() {
        isActive = false;
        isPaused = false;
        if (typingInterval) {
            clearTimeout(typingInterval);
            typingInterval = null;
        }

        sendMessage({
            type: 'TYPING_STOPPED',
            progress: typingIndex,
            totalLength: processedText.length
        });
    }

    // Pause/resume typing
    function pauseTyping() {
        isPaused = !isPaused;
        
        if (!isPaused && isActive) {
            const typingFields = detectTypingFields();
            if (typingFields.length > 0) {
                simulateTyping(typingFields[0], processedText);
            }
        }

        sendMessage({
            type: isPaused ? 'TYPING_PAUSED' : 'TYPING_RESUMED'
        });
    }

    // Send progress updates
    function sendProgressUpdate() {
        const progress = processedText ? (typingIndex / processedText.length) * 100 : 0;
        sendMessage({
            type: 'TYPING_PROGRESS',
            progress: Math.round(progress),
            charactersTyped: typingIndex,
            totalCharacters: processedText.length
        });
    }

    // Send message to background script
    function sendMessage(message) {
        chrome.runtime.sendMessage({
            source: 'content-script',
            url: window.location.href,
            ...message
        });
    }

    // Listen for messages from popup/background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('Content script received message:', request);

        switch (request.action) {
            case 'START_TYPING':
                typingSpeed = request.typingSpeed || 100;
                startTyping();
                sendResponse({ success: true });
                break;

            case 'STOP_TYPING':
                stopTyping();
                sendResponse({ success: true });
                break;

            case 'PAUSE_TYPING':
                pauseTyping();
                sendResponse({ success: true });
                break;

            case 'UPDATE_SETTINGS':
                typingSpeed = request.settings.typingSpeed || typingSpeed;
                sendResponse({ success: true });
                break;

            case 'SET_PROCESSED_TEXT':
                processedText = request.text || '';
                sendResponse({ success: true });
                break;

            case 'DETECT_PAGE':
                const assignmentText = extractAssignmentText();
                const typingFields = detectTypingFields();
                
                sendResponse({
                    success: true,
                    hasTypingExercise: typingFields.length > 0,
                    assignmentText: assignmentText,
                    typingFieldsCount: typingFields.length,
                    url: window.location.href
                });
                break;

            case 'GET_STATUS':
                sendResponse({
                    isActive,
                    isPaused,
                    progress: processedText ? (typingIndex / processedText.length) * 100 : 0,
                    typingSpeed,
                    hasText: !!processedText
                });
                break;

            default:
                sendResponse({ success: false, error: 'Unknown action' });
        }

        return true; // Keep message channel open for async response
    });

    // Initialize - detect page content and send to background
    function initialize() {
        const assignmentText = extractAssignmentText();
        const typingFields = detectTypingFields();
        
        sendMessage({
            type: 'PAGE_DETECTED',
            url: window.location.href,
            hasTypingExercise: typingFields.length > 0,
            assignmentText: assignmentText,
            typingFieldsCount: typingFields.length
        });
    }

    // Auto-detect when page content changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if new typing fields or text content was added
                setTimeout(initialize, 500);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    console.log('AI Text Assistant content script loaded for zav.cz');
})();
