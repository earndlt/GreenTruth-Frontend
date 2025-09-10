
import { useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseMapboxEventsProps {
  onSelectPoint?: (point: any) => void;
}

export const useMapboxEvents = ({ onSelectPoint }: UseMapboxEventsProps = {}) => {
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  // Set up event handlers for map interactions
  const setupEventHandlers = (mapInstance: mapboxgl.Map) => {
    // Add hover effect for pipelines
    mapInstance.on('mouseenter', 'pipeline-segments', () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    });
    
    mapInstance.on('mouseleave', 'pipeline-segments', () => {
      mapInstance.getCanvas().style.cursor = '';
    });
    
    // Add hover effect for delivery points
    mapInstance.on('mouseenter', 'delivery-points', () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    });
    
    mapInstance.on('mouseleave', 'delivery-points', () => {
      mapInstance.getCanvas().style.cursor = '';
    });

    // Add popup for pipeline segments
    mapInstance.on('click', 'pipeline-segments', (e) => {
      if (!e.features || e.features.length === 0) return;
      
      const feature = e.features[0];
      const coordinates = e.lngLat;
      const properties = feature.properties;
      
      if (!properties) return;
      
      const popupContent = `
        <div class="p-2">
          <h3 class="font-medium text-base">${properties.name}</h3>
          <p class="text-sm text-gray-600">${properties.description}</p>
          <div class="mt-2 space-y-1">
            <p class="text-sm"><span class="font-medium">Capacity:</span> ${properties.capacity}</p>
            <p class="text-sm"><span class="font-medium">Producers:</span> ${properties.producers}</p>
            <div class="mt-2 pt-2 border-t border-gray-200">
              <p class="text-sm font-medium text-emerald-600">${properties.availableEACs} EACs Available</p>
              <p class="text-sm text-emerald-600">${properties.eacPrice}</p>
            </div>
          </div>
        </div>
      `;
      
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(mapInstance);
    });

    // Add popup and selection for delivery points
    mapInstance.on('click', 'delivery-points', (e) => {
      if (!e.features || e.features.length === 0) return;
      
      const feature = e.features[0];
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = feature.properties;
      
      if (!properties) return;
      
      // Store the selected point
      const pointData = {
        name: properties.name,
        state: properties.state,
        county: properties.county,
        description: properties.description,
        availableEACs: properties.availableEACs,
        eacPrice: properties.eacPrice
      };
      
      setSelectedPoint(pointData);
      
      if (onSelectPoint) {
        onSelectPoint(pointData);
      }
      
      const popupContent = `
        <div class="p-2">
          <h3 class="font-medium text-base">${properties.name}</h3>
          <p class="text-sm">${properties.county}, ${properties.state}</p>
          <p class="text-sm text-gray-600 mt-1">${properties.description}</p>
          <div class="mt-2 pt-2 border-t border-gray-200">
            <p class="text-sm font-medium text-emerald-600">${properties.availableEACs} EACs Available</p>
            <p class="text-sm text-emerald-600">${properties.eacPrice}</p>
          </div>
        </div>
      `;
      
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(mapInstance);
    });
  };

  return {
    selectedPoint,
    setSelectedPoint,
    setupEventHandlers
  };
};
