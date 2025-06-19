import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface SettingsPanelProps {
  typingSpeed: number;
  aiModel: string;
  autoStart: boolean;
  onTypingSpeedChange: (speed: number) => void;
  onAiModelChange: (model: string) => void;
  onAutoStartChange: (autoStart: boolean) => void;
}

export function SettingsPanel({
  typingSpeed,
  aiModel,
  autoStart,
  onTypingSpeedChange,
  onAiModelChange,
  onAutoStartChange,
}: SettingsPanelProps) {
  return (
    <div className="px-4 py-4 bg-surface border-t">
      <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center space-x-2">
        <i className="fas fa-cog text-gray-600"></i>
        <span>Nastavení</span>
      </h3>

      {/* Typing Speed */}
      <div className="mb-4">
        <Label className="block text-xs text-gray-600 mb-2">Rychlost psaní</Label>
        <div className="flex items-center space-x-3">
          <i className="fas fa-turtle text-gray-400 text-xs"></i>
          <div className="flex-1">
            <Slider
              value={[typingSpeed]}
              onValueChange={(value) => onTypingSpeedChange(value[0])}
              min={50}
              max={200}
              step={10}
              className="w-full"
            />
          </div>
          <i className="fas fa-rabbit text-gray-400 text-xs"></i>
        </div>
        <div className="text-xs text-gray-500 mt-1">{typingSpeed} znaků/min</div>
      </div>

      {/* AI Model Selection */}
      <div className="mb-4">
        <Label className="block text-xs text-gray-600 mb-2">AI Model</Label>
        <Select value={aiModel} onValueChange={onAiModelChange}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Auto-start Toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-gray-700">Automatické spuštění</Label>
        <Switch
          checked={autoStart}
          onCheckedChange={onAutoStartChange}
        />
      </div>
    </div>
  );
}
