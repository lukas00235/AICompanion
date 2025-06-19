import { Button } from '@/components/ui/button';

interface MainControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onToggleProcess: () => void;
  onPauseProcess: () => void;
}

export function MainControls({ 
  isRunning, 
  isPaused, 
  onToggleProcess, 
  onPauseProcess 
}: MainControlsProps) {
  return (
    <div className="px-4 py-4">
      <div className="space-y-3">
        <Button
          onClick={onToggleProcess}
          className={`w-full py-3 font-medium text-sm transition-colors duration-200 flex items-center justify-center space-x-2 ${
            isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-secondary hover:bg-green-600 text-white'
          }`}
        >
          <i className={`fas ${isRunning ? 'fa-stop' : 'fa-play'}`} />
          <span>{isRunning ? 'Zastavit AI asistenta' : 'Spustit AI asistenta'}</span>
        </Button>

        <Button
          onClick={onPauseProcess}
          disabled={!isRunning}
          variant="secondary"
          className="w-full py-2 font-medium text-sm transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`} />
          <span>{isPaused ? 'Pokračovat' : 'Pozastavit'}</span>
        </Button>
      </div>
    </div>
  );
}
