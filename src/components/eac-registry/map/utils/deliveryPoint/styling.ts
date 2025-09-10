
import { PipelineFeature } from '../../types/pipelineTypes';
import { RenderDeliveryPointOptions } from './types';

/**
 * Determines the styling options for a delivery point based on its properties
 */
export const getDeliveryPointStyling = (
  feature: PipelineFeature
): RenderDeliveryPointOptions => {
  if (!feature.properties) {
    return {
      fillColor: '#f39c12', // Default color
      scale: 8,
      isSelected: false
    };
  }
  
  // Default color for REX points
  let fillColor = '#f39c12';
  let scale = 8;
  
  // Determine icon color and size based on pipeline and point type
  if (feature.properties.pipeline === 'Ruby') {
    fillColor = '#D946EF'; // Magenta for Ruby pipeline points
  } else if (feature.properties.pipeline === 'REX') {
    if (feature.properties.type === 'Offtake Point') {
      fillColor = '#e67e22'; // Orange for REX offtake points
      scale = 9; // Slightly larger for offtake points
    }
  }
  
  // For interconnection points, make them slightly different
  if (feature.properties.type === 'Interconnect') {
    scale = 7;
    fillColor = feature.properties.pipeline === 'Ruby' ? '#b830c5' : '#e67e22';
  }
  
  return {
    fillColor,
    scale,
    isSelected: false
  };
};

/**
 * Creates a highlight circle around a selected point
 */
export const createHighlightCircle = (
  map: google.maps.Map,
  position: google.maps.LatLng | google.maps.LatLngLiteral,
  fillColor: string
): google.maps.Circle => {
  // Create a pulsating effect with animation
  const highlightCircle = new google.maps.Circle({
    strokeColor: fillColor,
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: fillColor,
    fillOpacity: 0.3,
    map: map,
    center: position,
    radius: 20000, // Radius in meters (increased for better visibility)
    zIndex: 1 // Place below markers
  });
  
  // Add animation for pulsating effect
  let growing = true;
  const animateCircle = () => {
    const currentRadius = highlightCircle.getRadius();
    
    if (growing) {
      highlightCircle.setRadius(currentRadius + 500);
      if (currentRadius > 30000) growing = false;
    } else {
      highlightCircle.setRadius(currentRadius - 500);
      if (currentRadius < 20000) growing = true;
    }
    
    // Schedule next animation frame
    setTimeout(animateCircle, 100);
  };
  
  // Start animation
  animateCircle();
  
  return highlightCircle;
};

/**
 * Creates a marker for a delivery point
 */
export const createDeliveryPointMarker = (
  position: google.maps.LatLng | google.maps.LatLngLiteral,
  map: google.maps.Map,
  title: string | undefined,
  options: RenderDeliveryPointOptions
): google.maps.Marker => {
  return new google.maps.Marker({
    position,
    map,
    title,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: options.fillColor,
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      scale: options.isSelected ? options.scale * 1.5 : options.scale // Make selected points 50% larger
    },
    zIndex: options.isSelected ? 3 : 2, // Selected points should appear above others
    animation: options.isSelected ? google.maps.Animation.BOUNCE : null // Add bounce animation for selected points
  });
};
