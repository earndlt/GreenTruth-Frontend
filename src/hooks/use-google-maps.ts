
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DeliveryPointData } from '@/components/eac-registry/map/types/pipelineTypes';

export interface GoogleMapsHookProps {
  apiKey: string;
  initialSelectedPoint?: DeliveryPointData | null;
}

export const useGoogleMaps = ({ apiKey, initialSelectedPoint }: GoogleMapsHookProps) => {
  const { toast } = useToast();
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<DeliveryPointData | null>(initialSelectedPoint || null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const scriptLoaded = useRef(false);
  
  // Update selected point when initialSelectedPoint changes
  useEffect(() => {
    if (initialSelectedPoint) {
      setSelectedPoint(initialSelectedPoint);
    }
  }, [initialSelectedPoint]);
  
  // Load Google Maps JavaScript API
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Skip if script is already loaded
      if (scriptLoaded.current) {
        initializeMap();
        return;
      }

      // Create script element
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      // On script load, initialize the map
      googleMapsScript.onload = () => {
        scriptLoaded.current = true;
        initializeMap();
      };
      
      // Handle script loading error
      googleMapsScript.onerror = () => {
        const errorMsg = "Failed to load Google Maps. Please check the API key.";
        setMapError(errorMsg);
        toast({
          title: "Map Loading Error",
          description: errorMsg,
          variant: "destructive"
        });
      };
      
      document.head.appendChild(googleMapsScript);
    };

    loadGoogleMapsScript();

    // Cleanup
    return () => {
      markersRef.current = [];
    };
  }, [apiKey, toast]);

  // Initialize the map
  const initializeMap = () => {
    if (!mapRef.current) return;
    
    try {
      // Reset error state
      setMapError(null);
      
      // Create the map with satellite view and labels
      const mapOptions: google.maps.MapOptions = {
        zoom: 4,
        center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
        mapTypeId: google.maps.MapTypeId.HYBRID, // Satellite view with labels
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false
      };
      
      const map = new google.maps.Map(mapRef.current, mapOptions);
      googleMapRef.current = map;
      
      setMapLoaded(true);
    } catch (error) {
      console.error("Error initializing map:", error);
      const errorMsg = `Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setMapError(errorMsg);
      toast({
        title: "Map Initialization Error",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  // Fit map to bounds
  const fitMapToBounds = () => {
    if (!googleMapRef.current || markersRef.current.length === 0) return;
    
    try {
      const bounds = new google.maps.LatLngBounds();
      let hasValidPositions = false;
      
      markersRef.current.forEach(marker => {
        const position = marker.getPosition();
        if (position) {
          bounds.extend(position);
          hasValidPositions = true;
        }
      });
      
      if (hasValidPositions) {
        googleMapRef.current.fitBounds(bounds);
      }
    } catch (error) {
      console.error("Error fitting map to bounds:", error);
      // Fall back to default center if fitBounds fails
      if (googleMapRef.current) {
        googleMapRef.current.setCenter({ lat: 39.8283, lng: -98.5795 });
        googleMapRef.current.setZoom(4);
      }
    }
  };

  return {
    mapRef,
    googleMapRef,
    markersRef,
    mapError,
    mapLoaded,
    selectedPoint,
    setSelectedPoint,
    fitMapToBounds
  };
};
