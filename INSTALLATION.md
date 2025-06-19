# AI Text Assistant for zav.cz - Installation Guide

This guide will help you install the browser extension that automatically completes Czech typing exercises on zav.cz using AI.

## Prerequisites

1. **Chrome or Edge browser** (supports Manifest V3 extensions)
2. **Node.js** installed on your computer
3. **OpenAI API Key** (optional - extension works in demo mode without it)

## Step 1: Set Up the Backend Server

1. Open terminal/command prompt
2. Navigate to the project folder
3. Install dependencies (if not already done):
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   
   The server will start on `http://localhost:5000`

## Step 2: Install the Browser Extension

### For Chrome:

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Navigate to your project folder and select the `extension` folder
5. The extension should now appear in your extensions list

### For Microsoft Edge:

1. Open Edge and go to `edge://extensions/`
2. Enable **Developer mode** (toggle in bottom-left)
3. Click **"Load unpacked"**
4. Navigate to your project folder and select the `extension` folder
5. The extension should now appear in your extensions list

## Step 3: Configure the Extension

1. Click the extension icon in your browser toolbar
2. The popup will open showing the AI Text Assistant interface
3. If you have an OpenAI API key:
   - Click on "Nastavení" (Settings) at the bottom
   - Enter your OpenAI API key (starts with "sk-...")
   - Click "Uložit" (Save)

## Step 4: Use the Extension

1. Go to **zav.cz** (typing exercise website)
2. Navigate to any typing exercise page
3. The extension will automatically detect typing exercises
4. Click **"Spustit AI asistenta"** (Start AI Assistant) in the popup
5. The AI will:
   - Read the Czech text assignment
   - Process it for better typing practice
   - Type it automatically at your chosen speed

## Features

- **Automatic Detection**: Recognizes typing exercises on zav.cz
- **AI Text Processing**: Improves Czech text for typing practice
- **Speed Control**: Adjust typing speed (50-200 characters/minute)
- **Progress Tracking**: Real-time progress display
- **Pause/Resume**: Control typing process
- **Demo Mode**: Works without OpenAI API key (limited functionality)

## Troubleshooting

### Extension not loading:
- Make sure the backend server is running on `http://localhost:5000`
- Check that Developer mode is enabled in browser extensions

### AI not working:
- Verify your OpenAI API key is valid (starts with "sk-")
- Check the browser console for error messages
- Extension works in demo mode without API key

### zav.cz not detected:
- Make sure you're on the actual zav.cz website
- Try refreshing the page
- Check that the extension has permission to access the site

## Security Notes

- Your OpenAI API key is stored locally in the browser
- The extension only works on zav.cz for security
- All text processing happens through your own OpenAI account

## Getting OpenAI API Key

1. Go to https://platform.openai.com
2. Create an account or sign in
3. Go to API section
4. Generate a new API key
5. Copy the key (starts with "sk-...")
6. Enter it in the extension settings

That's it! You now have a working AI assistant for Czech typing exercises.