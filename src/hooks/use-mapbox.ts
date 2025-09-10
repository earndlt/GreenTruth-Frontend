
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapboxInit } from './mapbox/use-mapbox-init';
import { useMapboxLayers } from './mapbox/use-mapbox-layers';
import { useMapboxEvents } from './mapbox/use-mapbox-events';
import { useMapboxControls } from './mapbox/use-mapbox-controls';

interface UseMapboxProps {
  mapboxToken: string;
  onSelectPoint?: (point: any) => void;
}

export const useMapbox = ({ mapboxToken, onSelectPoint }: UseMapboxProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  const { 
    mapContainerRef, 
    mapRef, 
    isMapInitialized,
    initializeMap 
  } = useMapboxInit();
  
  const { 
    initializePipelineData, 
    calculatePipelineBounds 
  } = useMapboxLayers();
  
  const { 
    selectedPoint, 
    setSelectedPoint, 
    setupEventHandlers 
  } = useMapboxEvents({ 
    onSelectPoint 
  });
  
  const { fitMapToBounds: fitBounds } = useMapboxControls({ map });

  // Initialize map
  useEffect(() => {
    initializeMap();

    // Cleanup on unmount
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Set up map features when map is loaded
  useEffect(() => {
    if (!isMapInitialized || !mapRef.current) return;
    setMapLoaded(true);

    try {
      const mapInstance = mapRef.current;
      
      // Add pipeline data and styling
      initializePipelineData(mapInstance);
      
      // Add event handlers
      setupEventHandlers(mapInstance);
      
      // Fit map to bounds
      fitMapToBounds();
    } catch (error) {
      console.error("Error setting up map features:", error);
      setMapError(`Failed to set up map features: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [isMapInitialized]);

  // Function to fit map to pipeline bounds
  const fitMapToBounds = () => {
    if (!mapRef.current) return;
    try {
      const bounds = calculatePipelineBounds();
      fitBounds(bounds);
    } catch (error) {
      console.error("Error calculating bounds:", error);
    }
  };

  return { 
    mapContainer, 
    mapLoaded, 
    mapError,
    selectedPoint, 
    setSelectedPoint,
    fitMapToBounds
  };
};
