# AI Text Assistant for zav.cz

Browser extension that automatically completes Czech typing exercises using AI.

## Quick Installation

### 1. Start the Server
```bash
npm run dev
```
Server runs on http://localhost:5000

### 2. Install Extension in Chrome
1. Go to `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. Extension appears in toolbar

### 3. Use on zav.cz
1. Visit zav.cz typing exercises
2. Click extension icon in toolbar
3. Click "Spustit AI asistenta" (Start AI Assistant)
4. AI reads and types Czech text automatically

## Features
- Automatic text detection on zav.cz
- AI-improved Czech text processing
- Adjustable typing speed (50-200 chars/min)
- Real-time progress tracking
- Works in demo mode without OpenAI API key

## Optional: Add OpenAI API Key
1. Get API key from https://platform.openai.com
2. Click "Nastavení" in extension popup
3. Enter API key (starts with "sk-")
4. Save for full AI functionality

The extension works immediately in demo mode even without an API key!