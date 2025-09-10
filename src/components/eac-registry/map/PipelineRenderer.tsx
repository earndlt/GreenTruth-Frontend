
import React, { useEffect, useCallback } from 'react';
import { renderPipelineSegment } from './utils/pipelineSegmentUtils';
import { renderDeliveryPoint } from './utils/deliveryPoint';
import { PipelineRendererProps } from './types/pipelineTypes';

// Define continental US bounds (roughly coastal to coastal)
const CONTINENTAL_US_BOUNDS = {
  west: -124.848974, // Pacific Coast
  east: -66.885444,  // Atlantic Coast
  north: 49.384358,  // Northern border
  south: 24.396308   // Southern tip of Florida
};

const PipelineRenderer: React.FC<PipelineRendererProps> = ({ 
  map, 
  pipelineData, 
  onSelectDeliveryPoint,
  markersRef,
  setSelectedPoint,
  selectedPoint,
  showLabels
}) => {
  // Clear existing markers
  const clearExistingMarkers = useCallback(() => {
    if (markersRef.current) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
  }, [markersRef]);

  // Render all pipeline segments and delivery points
  const renderPipelineFeatures = useCallback((bounds: google.maps.LatLngBounds): boolean => {
    let hasFeatures = false;
    
    // Iterate through each pipeline dataset
    pipelineData.forEach(pipeline => {
      console.log(`Processing pipeline with ${pipeline.features.length} features`);
      
      // Add pipeline segments and points
      pipeline.features.forEach(feature => {
        if (feature.geometry.type === 'LineString') {
          renderPipelineSegment(feature, map, bounds, showLabels);
          hasFeatures = true;
          
          // Log each coordinate we're extending to help debug
          if (feature.geometry.coordinates) {
            feature.geometry.coordinates.forEach((coord, index) => {
              if (Array.isArray(coord) && coord.length === 2) {
                const lat = Number(coord[1]);
                const lng = Number(coord[0]);
                bounds.extend(new google.maps.LatLng(lat, lng));
                console.log(`Line point ${index}: [${lng}, ${lat}]`);
              }
            });
          }
        } 
        else if (feature.geometry.type === 'Point') {
          renderDeliveryPoint(
            feature, 
            map, 
            bounds, 
            onSelectDeliveryPoint, 
            markersRef, 
            setSelectedPoint, 
            selectedPoint
          );
          hasFeatures = true;
          
          // Log the point coordinates we're extending
          if (feature.geometry.coordinates && Array.isArray(feature.geometry.coordinates)) {
            const lat = Number(feature.geometry.coordinates[1]);
            const lng = Number(feature.geometry.coordinates[0]);
            console.log(`Point: [${lng}, ${lat}]`);
          }
        }
      });
    });
    
    // Log the final bounds for debugging
    if (!bounds.isEmpty()) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      console.log(`Raw feature bounds: NE(${ne.lat()}, ${ne.lng()}), SW(${sw.lat()}, ${sw.lng()})`);
    }
    
    return hasFeatures;
  }, [map, pipelineData, onSelectDeliveryPoint, markersRef, setSelectedPoint, selectedPoint, showLabels]);

  // Set the map to a default view of the USA
  const setDefaultMapView = useCallback(() => {
    if (map) {
      map.setCenter({ lat: 39.8283, lng: -98.5795 }); // Center of USA
      map.setZoom(4);
    }
  }, [map]);

  // Calculate the appropriate bounds for the map - much tighter padding to ensure features are close to edges
  const calculateFinalBounds = useCallback((bounds: google.maps.LatLngBounds): google.maps.LatLngBounds => {
    // If bounds are empty, create a default bounds for continental US
    if (bounds.isEmpty()) {
      bounds.extend(new google.maps.LatLng(CONTINENTAL_US_BOUNDS.north, CONTINENTAL_US_BOUNDS.west));
      bounds.extend(new google.maps.LatLng(CONTINENTAL_US_BOUNDS.south, CONTINENTAL_US_BOUNDS.east));
      return bounds;
    }
    
    const finalBounds = new google.maps.LatLngBounds();
    
    // Extend with our feature bounds first
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    finalBounds.extend(ne);
    finalBounds.extend(sw);
    
    // Add very minimal padding to ensure features extend closer to the edges
    // Using a much smaller percentage-based padding (3% of dimensions)
    const latPadding = (ne.lat() - sw.lat()) * 0.03;
    const lngPadding = (ne.lng() - sw.lng()) * 0.03;
    
    // Log the padding we're applying
    console.log(`Applying padding: lat=${latPadding}, lng=${lngPadding}`);
    
    // Extend the bounds with minimal padding
    finalBounds.extend(new google.maps.LatLng(ne.lat() + latPadding, ne.lng() + lngPadding));
    finalBounds.extend(new google.maps.LatLng(sw.lat() - latPadding, sw.lng() - lngPadding));
    
    // Log final bounds after padding
    console.log(`Final bounds with padding: NE(${finalBounds.getNorthEast().lat()}, ${finalBounds.getNorthEast().lng()}), SW(${finalBounds.getSouthWest().lat()}, ${finalBounds.getSouthWest().lng()})`);
    
    return finalBounds;
  }, []);

  // Fit the map to the calculated bounds
  const fitMapToBounds = useCallback((bounds: google.maps.LatLngBounds) => {
    if (!map) return;
    
    try {
      // Calculate the final bounds - with minimal padding
      const finalBounds = calculateFinalBounds(bounds);
      
      // Log bounds for debugging
      console.log("Fitting to bounds:", finalBounds.toString());
      
      // Check if bounds are valid
      if (finalBounds.isEmpty()) {
        console.warn("Empty bounds, using default view");
        setDefaultMapView();
        return;
      }
      
      // Fit to bounds with very minimal padding to push features to edges
      map.fitBounds(finalBounds, {
        top: 5,     // Reduced from 20 to 5
        right: 5,   // Reduced from 20 to 5
        bottom: 5,  // Reduced from 20 to 5
        left: 5     // Reduced from 20 to 5
      });
      
      // Add a slight adjustment after initial fit to ensure proper zoom
      const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
        if (map.getZoom() && map.getZoom() > 10) {
          map.setZoom(10); // Max zoom level
        } else if (map.getZoom() && map.getZoom() < 4) {
          map.setZoom(4);  // Min zoom level
        }
        
        // Log the final zoom level after adjustment
        console.log("Final zoom level:", map.getZoom());
      });
      
    } catch (error) {
      console.error("Error fitting bounds:", error);
      // Fall back to default view if fitBounds fails
      setDefaultMapView();
    }
  }, [map, calculateFinalBounds, setDefaultMapView]);

  useEffect(() => {
    if (!map) return;
    
    // Clear existing markers
    clearExistingMarkers();
    
    // Create fresh bounds object
    const bounds = new google.maps.LatLngBounds();
    
    // Render features and calculate bounds
    const hasFeatures = renderPipelineFeatures(bounds);
    
    // Force a small delay to ensure all elements are rendered correctly
    setTimeout(() => {
      // Only fit bounds if we have features to display
      if (hasFeatures && !bounds.isEmpty()) {
        console.log("Has features, fitting to bounds");
        fitMapToBounds(bounds);
      } else {
        console.log("No features or empty bounds, using default view");
        setDefaultMapView();
      }
    }, 100);
    
    // Clean up tooltips when component unmounts
    return () => {
      const tooltips = document.querySelectorAll('.point-tooltip');
      tooltips.forEach(tooltip => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      });
    };
  }, [map, pipelineData, clearExistingMarkers, renderPipelineFeatures, fitMapToBounds, setDefaultMapView]);

  return null; // This is a logic component, not a UI component
};

export default PipelineRenderer;
