
import mapboxgl from 'mapbox-gl';

interface UseMapboxControlsProps {
  map: React.RefObject<mapboxgl.Map | null>;
}

export const useMapboxControls = ({ map }: UseMapboxControlsProps) => {
  // Function to fit map to pipeline bounds
  const fitMapToBounds = (bounds: mapboxgl.LngLatBounds) => {
    if (!map.current) return;

    try {
      console.log("Mapbox: Fitting to bounds", bounds.toString());
      
      // Check if bounds are valid
      if (bounds.isEmpty()) {
        console.warn("Mapbox: Empty bounds, using default view");
        // Set default view
        map.current.setCenter([-98.5795, 39.8283]); // Center of USA
        map.current.setZoom(4);
        return;
      }
      
      // For the REX pipeline, we need an even more minimal padding
      // to maximize viewport space and push elements closer to edges
      map.current.fitBounds(bounds, {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
        },
        duration: 1200, // Longer animation for better UX
        maxZoom: 8.5 // Slightly lower max zoom to show more context
      });
      
      // Optional: Slightly zoom out after fitting to ensure features are well within view
      setTimeout(() => {
        if (map.current && map.current.getZoom() > 4) {
          const currentZoom = map.current.getZoom();
          // Reduce zoom by a small amount (3-5% of current zoom)
          const zoomAdjustment = currentZoom * 0.04;
          map.current.easeTo({
            zoom: currentZoom - zoomAdjustment,
            duration: 800
          });
        }
        
        // Log the final zoom level for debugging
        setTimeout(() => {
          if (map.current) {
            console.log("Mapbox: Final zoom level", map.current.getZoom());
          }
        }, 2000);
      }, 1300);
    } catch (error) {
      console.error("Error fitting map to bounds:", error);
      
      // Fallback to default view
      if (map.current) {
        map.current.setCenter([-98.5795, 39.8283]); // Center of USA
        map.current.setZoom(4);
      }
    }
  };

  return {
    fitMapToBounds
  };
};
