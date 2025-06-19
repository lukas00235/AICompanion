import { useEffect } from 'react';
import { useExtensionState } from '@/hooks/use-extension-state';
import { ExtensionHeader } from '@/components/extension-header';
import { WebsiteDetection } from '@/components/website-detection';
import { MainControls } from '@/components/main-controls';
import { SettingsPanel } from '@/components/settings-panel';
import { TextPreview } from '@/components/text-preview';
import { StatusBar } from '@/components/status-bar';
import { ApiConfiguration } from '@/components/api-configuration';

export default function ExtensionPopup() {
  const {
    state,
    toggleProcess,
    pauseProcess,
    updateTypingSpeed,
    updateAiModel,
    updateAutoStart,
    setOriginalText,
    toggleConfigVisibility,
    saveApiKey,
    detectWebsite,
    isProcessingText,
    isDetectingWebsite,
    isSavingSettings,
  } = useExtensionState();

  // Simulate website detection on mount
  useEffect(() => {
    // In a real extension, this would come from the content script
    const simulateWebsiteDetection = () => {
      const mockUrl = 'https://zav.cz/typing-exercise';
      const mockPageContent = 'psací cvičení textarea';
      detectWebsite(mockUrl, mockPageContent);
    };

    simulateWebsiteDetection();
  }, [detectWebsite]);

  // Simulate text detection
  useEffect(() => {
    if (!state.originalText) {
      // Simulate detecting text from zav.cz
      setTimeout(() => {
        setOriginalText('Napište esej o významu umělé inteligence v moderní společnosti. Text by měl obsahovat úvod, tři hlavní body a závěr...');
      }, 1000);
    }
  }, [state.originalText, setOriginalText]);

  // Simulate progress updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.isRunning && !state.isPaused) {
      interval = setInterval(() => {
        if (state.progress < 100) {
          const increment = Math.random() * 3 + 1;
          const newProgress = Math.min(state.progress + increment, 100);
          // Update progress through the hook
          // This would normally be handled by the extension's typing simulation
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, state.isPaused, state.progress]);

  const handleCancelApiConfig = () => {
    toggleConfigVisibility();
  };

  const handleSaveApiKey = (apiKey: string) => {
    saveApiKey(apiKey);
    toggleConfigVisibility();
  };

  return (
    <div className="w-80 bg-white shadow-lg">
      <ExtensionHeader connectionStatus={state.connectionStatus} />
      
      <WebsiteDetection 
        currentWebsite={state.currentWebsite}
        hasTypingExercise={state.currentWebsite === 'zav.cz'}
      />
      
      <MainControls
        isRunning={state.isRunning}
        isPaused={state.isPaused}
        onToggleProcess={toggleProcess}
        onPauseProcess={pauseProcess}
      />
      
      <SettingsPanel
        typingSpeed={state.typingSpeed}
        aiModel={state.aiModel}
        autoStart={state.autoStart}
        onTypingSpeedChange={updateTypingSpeed}
        onAiModelChange={updateAiModel}
        onAutoStartChange={updateAutoStart}
      />
      
      <TextPreview
        originalText={state.originalText}
        processedText={state.processedText}
        progress={state.progress}
        isProcessingText={isProcessingText}
      />
      
      <StatusBar
        isRunning={state.isRunning}
        isPaused={state.isPaused}
        onOpenSettings={toggleConfigVisibility}
      />
      
      <ApiConfiguration
        isVisible={state.isConfigVisible}
        apiKey={state.apiKey}
        onSaveApiKey={handleSaveApiKey}
        onCancel={handleCancelApiConfig}
      />
    </div>
  );
}
