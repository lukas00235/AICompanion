import { Button } from '@/components/ui/button';

interface StatusBarProps {
  isRunning: boolean;
  isPaused: boolean;
  onOpenSettings: () => void;
}

export function StatusBar({ isRunning, isPaused, onOpenSettings }: StatusBarProps) {
  const getStatusColor = () => {
    if (isRunning && !isPaused) return 'bg-green-500';
    if (isRunning && isPaused) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getStatusMessage = () => {
    if (isRunning && !isPaused) return 'Běží...';
    if (isRunning && isPaused) return 'Pozastaveno';
    return 'Připraveno k použití';
  };

  return (
    <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span className="text-xs text-gray-600">{getStatusMessage()}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenSettings}
        className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1 p-1"
      >
        <i className="fas fa-external-link-alt"></i>
        <span>Nastavení</span>
      </Button>
    </div>
  );
}
