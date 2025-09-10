
import mapboxgl from 'mapbox-gl';
import { rexPipelineData } from '@/data/rex-pipeline';
import { rubyPipelineData } from '@/data/rubyPipelineData';

export const useMapboxLayers = () => {
  // Initialize pipeline data and layers
  const initializePipelineData = (mapInstance: mapboxgl.Map) => {
    try {
      // Add REX pipeline as source
      mapInstance.addSource('rex-pipeline', {
        type: 'geojson',
        data: rexPipelineData,
      });

      // Add Ruby pipeline as source
      mapInstance.addSource('ruby-pipeline', {
        type: 'geojson',
        data: rubyPipelineData,
      });

      // Add pipeline segments layer for REX
      mapInstance.addLayer({
        id: 'rex-pipeline-segments',
        type: 'line',
        source: 'rex-pipeline',
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': [
            'match',
            ['get', 'segment'],
            'zone1', '#FF5733', // Orange for Zone 1
            'zone2', '#33C3FF', // Blue for Zone 2
            'zone3', '#9b59b6', // Purple for Zone 3
            '#8e9196' // Default color
          ],
          'line-width': 5,
          'line-opacity': 0.8
        }
      });

      // Add pipeline segments layer for Ruby
      mapInstance.addLayer({
        id: 'ruby-pipeline-segments',
        type: 'line',
        source: 'ruby-pipeline',
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': '#D946EF', // Purple for Ruby pipeline
          'line-width': 5,
          'line-opacity': 0.8
        }
      });

      // Add glow effect for REX pipelines
      mapInstance.addLayer({
        id: 'rex-pipeline-glow',
        type: 'line',
        source: 'rex-pipeline',
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': [
            'match',
            ['get', 'segment'],
            'zone1', '#FF5733', 
            'zone2', '#33C3FF',
            'zone3', '#9b59b6',
            '#8e9196'
          ],
          'line-width': 10,
          'line-blur': 10,
          'line-opacity': 0.3
        }
      });

      // Add glow effect for Ruby pipelines
      mapInstance.addLayer({
        id: 'ruby-pipeline-glow',
        type: 'line',
        source: 'ruby-pipeline',
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': '#D946EF',
          'line-width': 10,
          'line-blur': 10,
          'line-opacity': 0.3
        }
      });

      // Add delivery points layer for REX
      mapInstance.addLayer({
        id: 'rex-delivery-points',
        type: 'circle',
        source: 'rex-pipeline',
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': 8,
          'circle-color': '#f39c12',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add delivery points layer for Ruby
      mapInstance.addLayer({
        id: 'ruby-delivery-points',
        type: 'circle',
        source: 'ruby-pipeline',
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': 8,
          'circle-color': '#f39c12',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add labels for delivery points
      mapInstance.addLayer({
        id: 'delivery-point-labels',
        type: 'symbol',
        source: 'rex-pipeline',
        filter: ['==', '$type', 'Point'],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Regular'],
          'text-offset': [0, 1.5],
          'text-anchor': 'top',
          'text-size': 12
        },
        paint: {
          'text-color': '#333',
          'text-halo-color': '#fff',
          'text-halo-width': 1
        }
      });

      // Add labels for Ruby delivery points
      mapInstance.addLayer({
        id: 'ruby-delivery-point-labels',
        type: 'symbol',
        source: 'ruby-pipeline',
        filter: ['==', '$type', 'Point'],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Regular'],
          'text-offset': [0, 1.5],
          'text-anchor': 'top',
          'text-size': 12
        },
        paint: {
          'text-color': '#333',
          'text-halo-color': '#fff',
          'text-halo-width': 1
        }
      });
    } catch (error) {
      console.error("Error initializing pipeline data:", error);
      throw new Error(`Failed to initialize pipeline data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Calculate bounds for all features across all pipelines
  const calculatePipelineBounds = () => {
    const bounds = new mapboxgl.LngLatBounds();
    
    // Special handling for REX pipeline - we need to emphasize its full extent
    console.log("Processing REX pipeline for bounds");
    rexPipelineData.features.forEach(feature => {
      if (feature.geometry.type === 'LineString') {
        feature.geometry.coordinates.forEach(coord => {
          bounds.extend(coord as [number, number]);
          // Log coordinates for debugging
          console.log("REX coord:", coord);
        });
      } else if (feature.geometry.type === 'Point') {
        bounds.extend(feature.geometry.coordinates as [number, number]);
        // Log point for debugging
        console.log("REX point:", feature.geometry.coordinates);
      }
    });
    
    // Add Ruby pipeline features to bounds 
    console.log("Processing Ruby pipeline for bounds");
    rubyPipelineData.features.forEach(feature => {
      if (feature.geometry.type === 'LineString') {
        feature.geometry.coordinates.forEach(coord => {
          bounds.extend(coord as [number, number]);
        });
      } else if (feature.geometry.type === 'Point') {
        bounds.extend(feature.geometry.coordinates as [number, number]);
      }
    });
    
    // Add padding to bounds to ensure features don't hit the edges
    // We'll expand the bounds by applying a minimal buffer for REX pipeline view
    if (!bounds.isEmpty()) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      // Using a very minimal buffer (5% of dimensions) to push content to edges
      const latBuffer = (ne.lat - sw.lat) * 0.05; 
      const lngBuffer = (ne.lng - sw.lng) * 0.05; 
      
      // Expand bounds in all directions
      bounds.extend([sw.lng - lngBuffer, sw.lat - latBuffer]);
      bounds.extend([ne.lng + lngBuffer, ne.lat + latBuffer]);
      
      console.log("Calculated pipeline bounds with padding:", 
                  [sw.lng - lngBuffer, sw.lat - latBuffer], 
                  [ne.lng + lngBuffer, ne.lat + latBuffer]);
    }
    
    return bounds;
  };

  return {
    initializePipelineData,
    calculatePipelineBounds
  };
};
