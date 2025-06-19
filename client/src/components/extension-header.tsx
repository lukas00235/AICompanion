import { Badge } from '@/components/ui/badge';

interface ExtensionHeaderProps {
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

export function ExtensionHeader({ connectionStatus }: ExtensionHeaderProps) {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-400';
      case 'connecting': return 'bg-yellow-400';
      case 'disconnected': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Připojeno';
      case 'connecting': return 'Připojování...';
      case 'disconnected': return 'Odpojeno';
      default: return 'Neznámý';
    }
  };

  return (
    <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <i className="fas fa-robot text-lg"></i>
        <h1 className="text-sm font-medium">AI Text Assistant</h1>
      </div>
      <div className="flex items-center space-x-1">
        <div 
          className={`w-2 h-2 rounded-full ${getStatusColor()} ${
            connectionStatus === 'connecting' ? 'animate-pulse' : ''
          }`}
        />
        <span className="text-xs">{getStatusText()}</span>
      </div>
    </div>
  );
}
