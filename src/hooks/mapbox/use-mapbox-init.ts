
// This file is needed to fix TypeScript errors in existing imports
// It provides a mock implementation that won't break existing code

import { useRef, useState } from 'react';

export const useMapboxInit = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const initializeMap = () => {
    console.warn('Mapbox has been replaced with Google Maps. This is a mock implementation.');
    // Using type assertion to avoid readonly property error
    (mapRef as any).current = {};
    setIsMapInitialized(true);
    return Promise.resolve();
  };

  return {
    mapContainerRef,
    mapRef,
    isMapInitialized,
    initializeMap
  };
};

export default useMapboxInit;
