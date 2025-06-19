interface WebsiteDetectionProps {
  currentWebsite: string;
  hasTypingExercise: boolean;
}

export function WebsiteDetection({ currentWebsite, hasTypingExercise }: WebsiteDetectionProps) {
  return (
    <div className="px-4 py-3 bg-blue-50 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="fas fa-globe text-primary text-sm"></i>
          <span className="text-sm text-gray-700">Webová stránka:</span>
        </div>
        <span className="text-sm font-medium text-primary">{currentWebsite}</span>
      </div>
      <div className="mt-2 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${hasTypingExercise ? 'bg-secondary' : 'bg-gray-400'}`} />
        <span className="text-xs text-gray-600">
          {hasTypingExercise ? 'Zadání detekováno' : 'Žádné zadání nenalezeno'}
        </span>
      </div>
    </div>
  );
}
