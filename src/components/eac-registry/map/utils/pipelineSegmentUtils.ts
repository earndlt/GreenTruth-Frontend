
import { PipelineFeature } from '../types/pipelineTypes';

// Helper function to render pipeline segments
export const renderPipelineSegment = (
  feature: PipelineFeature,
  map: google.maps.Map,
  bounds: google.maps.LatLngBounds,
  showLabels: boolean = true
) => {
  if (feature.geometry.type !== 'LineString') return;
  
  // Safe casting for LineString coordinates
  const coordinates = feature.geometry.coordinates as number[][];
  
  const path = coordinates.map(coord => ({
    lat: Number(coord[1]),
    lng: Number(coord[0])
  }));
  
  // Default color
  let strokeColor = '#8e9196';
  let strokeWeight = 5;
  
  // Determine color based on segment and pipeline
  if (feature.properties) {
    // Use color from properties if available
    if (feature.properties.color) {
      strokeColor = feature.properties.color;
    } 
    // Otherwise use zone-based colors
    else if (feature.properties.pipeline === 'REX') {
      if (feature.properties.segment === 'zone1') strokeColor = '#FF5733'; // Orange
      if (feature.properties.segment === 'zone2') strokeColor = '#33C3FF'; // Blue
      if (feature.properties.segment === 'zone3') strokeColor = '#9b59b6'; // Purple
    }
    
    // Ruby Pipeline colors
    if (feature.properties.pipeline === 'Ruby') {
      strokeColor = '#D946EF';
      if (feature.properties.segment === 'ruby-constraint') strokeColor = '#9b87f5';
    }
  }
  
  // Create the polyline
  const polyline = new google.maps.Polyline({
    path,
    strokeColor,
    strokeOpacity: 0.8,
    strokeWeight,
    map
  });
  
  // Add info window on click
  polyline.addListener('click', (e: google.maps.PolyMouseEvent) => {
    const properties = feature.properties;
    if (!properties) return;
    
    // Create content based on pipeline type
    let contentDetails = '';
    
    if (properties.pipeline === 'Ruby') {
      contentDetails = `
        <div class="mt-2">
          <p><span class="font-medium">Capacity:</span> ${properties.capacity || 'N/A'}</p>
          <p><span class="font-medium">Direction:</span> ${properties.direction || 'N/A'}</p>
          <p><span class="font-medium">Processors:</span> ${Array.isArray(properties.producers) ? properties.producers.join(', ') : properties.producers || 'N/A'}</p>
          <div class="mt-2">
            <p class="font-medium text-emerald-600">${properties.availableEACs || 0} EACs Available</p>
            <p class="text-emerald-600">${properties.eacPrice || 'N/A'}</p>
          </div>
        </div>
      `;
    } else {
      // REX pipeline content with start and end points
      contentDetails = `
        <div class="mt-2">
          <p><span class="font-medium">Route:</span> ${properties.start || ''} → ${properties.end || ''}</p>
          <p><span class="font-medium">Capacity:</span> ${properties.capacity || 'N/A'}</p>
          <p><span class="font-medium">Producers:</span> ${Array.isArray(properties.producers) ? properties.producers.join(', ') : properties.producers || 'N/A'}</p>
          <div class="mt-2">
            <p class="font-medium text-emerald-600">${properties.availableEACs || 0} EACs Available</p>
            <p class="text-emerald-600">${properties.eacPrice || 'N/A'}</p>
          </div>
        </div>
      `;
    }
    
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-medium text-base">${properties.name || 'Pipeline Segment'}</h3>
          <p>${properties.description || ''}</p>
          ${contentDetails}
        </div>
      `
    });
    
    infoWindow.setPosition(e.latLng);
    infoWindow.open(map);
  });
  
  // Extend bounds to include this path
  path.forEach(point => bounds.extend(point));
  
  // Add pill label at the center of the segment only if showLabels is true
  if (feature.properties && showLabels) {
    // Calculate the center point of the path
    const midpointIndex = Math.floor(path.length / 2);
    let centerPosition;
    
    if (path.length === 2) {
      // For simple segments with just two points, use the midpoint
      centerPosition = {
        lat: (path[0].lat + path[1].lat) / 2,
        lng: (path[0].lng + path[1].lng) / 2
      };
    } else if (path.length > 2) {
      // For more complex paths, use a point near the middle
      centerPosition = path[midpointIndex];
    } else {
      return; // No valid center point
    }
    
    // Determine label text based on segment
    let labelText = feature.properties.name || '';
    let labelColor = strokeColor;
    
    // For REX pipeline, use zone labels
    if (feature.properties.pipeline === 'REX') {
      if (feature.properties.segment === 'zone1') labelText = 'Zone 1';
      if (feature.properties.segment === 'zone2') labelText = 'Zone 2';
      if (feature.properties.segment === 'zone3') labelText = 'Zone 3';
    }
    
    // For Ruby pipeline, use segment name
    if (feature.properties.pipeline === 'Ruby') {
      labelText = feature.properties.segment === 'ruby-constraint' 
        ? 'Constraint Area'
        : 'Ruby Pipeline';
    }
    
    // Create a custom overlay for the pill label
    const pillLabel = document.createElement('div');
    pillLabel.className = 'pipeline-segment-label';
    pillLabel.style.cssText = `
      position: absolute;
      background-color: ${labelColor};
      color: white;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      white-space: nowrap;
      transform: translate(-50%, -50%);
      z-index: 5;
      border: 1px solid white;
    `;
    pillLabel.textContent = labelText;
    
    // Create a custom overlay at the center of the path
    const customOverlay = new google.maps.OverlayView();
    customOverlay.setMap(map);
    
    customOverlay.onAdd = function() {
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(pillLabel);
    };
    
    customOverlay.draw = function() {
      const projection = this.getProjection();
      const position = projection.fromLatLngToDivPixel(
        new google.maps.LatLng(centerPosition.lat, centerPosition.lng)
      );
      
      if (position) {
        pillLabel.style.left = position.x + 'px';
        pillLabel.style.top = position.y + 'px';
      }
    };
    
    // Add the overlay to ensure it's cleaned up properly
    customOverlay.onRemove = function() {
      if (pillLabel.parentElement) {
        pillLabel.parentElement.removeChild(pillLabel);
      }
    };
  }
};
