import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface ExtensionState {
  isRunning: boolean;
  isPaused: boolean;
  typingSpeed: number;
  aiModel: string;
  autoStart: boolean;
  currentWebsite: string;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  progress: number;
  originalText: string;
  processedText: string;
  isConfigVisible: boolean;
  apiKey: string;
}

export interface WebsiteDetection {
  isSupported: boolean;
  hasTypingExercise: boolean;
  website: string;
  detectedElements: string[];
}

export function useExtensionState() {
  const queryClient = useQueryClient();
  
  const [state, setState] = useState<ExtensionState>({
    isRunning: false,
    isPaused: false,
    typingSpeed: 100,
    aiModel: 'gpt-4o',
    autoStart: false,
    currentWebsite: 'zav.cz',
    connectionStatus: 'connected',
    progress: 0,
    originalText: '',
    processedText: '',
    isConfigVisible: false,
    apiKey: '',
  });

  // Load settings
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  // Update state when settings are loaded
  useEffect(() => {
    if (settings) {
      setState(prev => ({
        ...prev,
        typingSpeed: settings.typingSpeed,
        aiModel: settings.aiModel,
        autoStart: settings.autoStart,
        apiKey: settings.apiKey || '',
      }));
    }
  }, [settings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<ExtensionState>) => {
      const response = await apiRequest('POST', '/api/settings', {
        typingSpeed: newSettings.typingSpeed,
        aiModel: newSettings.aiModel,
        autoStart: newSettings.autoStart,
        apiKey: newSettings.apiKey,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    },
  });

  // Process text mutation
  const processTextMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest('POST', '/api/process-text', {
        text,
        typingSpeed: state.typingSpeed,
        aiModel: state.aiModel,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setState(prev => ({
        ...prev,
        processedText: data.processedText,
      }));
    },
  });

  // Website detection mutation
  const detectWebsiteMutation = useMutation({
    mutationFn: async (data: { url: string; pageContent: string }) => {
      const response = await apiRequest('POST', '/api/detect-website', data);
      return response.json() as Promise<WebsiteDetection>;
    },
    onSuccess: (data) => {
      setState(prev => ({
        ...prev,
        currentWebsite: data.website,
        connectionStatus: data.isSupported ? 'connected' : 'disconnected',
      }));
    },
  });

  const updateState = (updates: Partial<ExtensionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const toggleProcess = () => {
    const newRunning = !state.isRunning;
    updateState({ 
      isRunning: newRunning,
      isPaused: false,
      progress: newRunning ? 0 : state.progress,
    });
  };

  const pauseProcess = () => {
    updateState({ isPaused: !state.isPaused });
  };

  const updateTypingSpeed = (speed: number) => {
    updateState({ typingSpeed: speed });
    saveSettingsMutation.mutate({ typingSpeed: speed });
  };

  const updateAiModel = (model: string) => {
    updateState({ aiModel: model });
    saveSettingsMutation.mutate({ aiModel: model });
  };

  const updateAutoStart = (autoStart: boolean) => {
    updateState({ autoStart });
    saveSettingsMutation.mutate({ autoStart });
  };

  const setOriginalText = (text: string) => {
    updateState({ originalText: text });
    if (text.trim()) {
      processTextMutation.mutate(text);
    }
  };

  const toggleConfigVisibility = () => {
    updateState({ isConfigVisible: !state.isConfigVisible });
  };

  const saveApiKey = (apiKey: string) => {
    updateState({ apiKey });
    saveSettingsMutation.mutate({ apiKey });
  };

  const detectWebsite = (url: string, pageContent: string) => {
    detectWebsiteMutation.mutate({ url, pageContent });
  };

  return {
    state,
    updateState,
    toggleProcess,
    pauseProcess,
    updateTypingSpeed,
    updateAiModel,
    updateAutoStart,
    setOriginalText,
    toggleConfigVisibility,
    saveApiKey,
    detectWebsite,
    isProcessingText: processTextMutation.isPending,
    isDetectingWebsite: detectWebsiteMutation.isPending,
    isSavingSettings: saveSettingsMutation.isPending,
  };
}
