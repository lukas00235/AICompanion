import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApiConfigurationProps {
  isVisible: boolean;
  apiKey: string;
  onSaveApiKey: (apiKey: string) => void;
  onCancel: () => void;
}

export function ApiConfiguration({ 
  isVisible, 
  apiKey, 
  onSaveApiKey, 
  onCancel 
}: ApiConfigurationProps) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  if (!isVisible) return null;

  const handleSave = () => {
    onSaveApiKey(localApiKey);
  };

  return (
    <div className="px-4 py-4 border-t bg-yellow-50">
      <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center space-x-2">
        <i className="fas fa-key text-yellow-600"></i>
        <span>API Konfigurace</span>
      </h3>
      
      <div className="mb-3">
        <Label className="block text-xs text-gray-600 mb-1">OpenAI API klíč:</Label>
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            placeholder="sk-..."
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            className="w-full text-sm pr-10"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-1 top-1 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          >
            <i className={`fas ${showKey ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
          </Button>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button 
          onClick={handleSave}
          size="sm"
          className="flex-1 text-xs font-medium"
        >
          Uložit
        </Button>
        <Button 
          onClick={onCancel}
          variant="secondary"
          size="sm"
          className="flex-1 text-xs font-medium"
        >
          Zrušit
        </Button>
      </div>

      <div className="mt-2 text-xs text-gray-500 flex items-center">
        <i className="fas fa-info-circle mr-1"></i>
        Váš API klíč je uložen lokálně a bezpečně.
      </div>
    </div>
  );
}
