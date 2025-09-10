
import React from 'react';

interface MapLoadingIndicatorProps {
  isLoading: boolean;
  error?: string | null;
}

const MapLoadingIndicator: React.FC<MapLoadingIndicatorProps> = ({ isLoading, error }) => {
  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90">
        <div className="text-center max-w-md p-4">
          <div className="text-red-600 mb-2 text-xl">⚠️ Map Error</div>
          <p className="text-red-700">{error}</p>
          <p className="mt-2 text-sm text-gray-700">
            Please check your internet connection and try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-700">Loading map...</p>
      </div>
    </div>
  );
};

export default MapLoadingIndicator;
