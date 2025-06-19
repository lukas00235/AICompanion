import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface TextPreviewProps {
  originalText: string;
  processedText: string;
  progress: number;
  isProcessingText: boolean;
}

export function TextPreview({ 
  originalText, 
  processedText, 
  progress,
  isProcessingText 
}: TextPreviewProps) {
  return (
    <div className="px-4 py-4 border-t">
      <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center space-x-2">
        <i className="fas fa-eye text-gray-600"></i>
        <span>Náhled textu</span>
      </h3>

      {/* Original Text */}
      <div className="mb-3">
        <Label className="block text-xs text-gray-600 mb-1">Původní zadání:</Label>
        <div className="bg-gray-50 border rounded p-2 text-xs text-gray-700 max-h-20 overflow-y-auto">
          {originalText || (
            <span className="text-gray-400 italic">Čekání na detekci textu...</span>
          )}
        </div>
      </div>

      {/* Processed Text */}
      <div className="mb-3">
        <Label className="block text-xs text-gray-600 mb-1">Přepracovaný text:</Label>
        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-gray-700 max-h-20 overflow-y-auto">
          {isProcessingText ? (
            <div className="text-blue-600 italic">Zpracování AI...</div>
          ) : processedText ? (
            processedText
          ) : (
            <div className="text-gray-400 italic">Text bude zobrazen po zpracování AI...</div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Průběh psaní</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full h-2" />
      </div>
    </div>
  );
}
