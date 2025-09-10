import { DeliveryPointData, PipelineFeature } from '../../types/pipelineTypes';
import { createDeliveryPointData, isSameDeliveryPoint } from './dataUtils';
import { getDeliveryPointStyling, createHighlightCircle, createDeliveryPointMarker } from './styling';
import { createTooltipElement } from './tooltipOverlay';

/**
 * Renders a delivery point on the map
 */
export const renderDeliveryPoint = (
  feature: PipelineFeature,
  map: google.maps.Map,
  bounds: google.maps.LatLngBounds,
  onSelectDeliveryPoint?: (point: DeliveryPointData) => void,
  markersRef?: React.MutableRefObject<google.maps.Marker[]>,
  setSelectedPoint?: (point: DeliveryPointData) => void,
  selectedPoint?: DeliveryPointData | null
) => {
  if (feature.geometry.type !== 'Point' || !feature.properties) return;

  const properties = feature.properties;
  const isLngTerminal = properties.type === 'LNG Terminal';

  // Safe casting for Point coordinates
  const pointCoordinates = feature.geometry.coordinates as number[];

  const position = {
    lat: Number(pointCoordinates[1]),
    lng: Number(pointCoordinates[0])
  };

  const deliveryPoint: DeliveryPointData = {
    name: properties.name || 'Unnamed Point',
    state: properties.state || '',
    county: properties.county || '',
    description: properties.description || '',
    availableEACs: properties.availableEACs || 0,
    eacPrice: properties.eacPrice || '',
    verified_sources: properties.verified_sources,
    connected_entities: properties.connected_entities,
    authorized_producers: properties.authorized_producers,
    pipeline: properties.pipeline,
    // LNG terminal specific properties
    ...(isLngTerminal && {
      terminal: properties.terminal,
      cargoFrequency: properties.cargoFrequency,
      availableCargos: properties.availableCargos,
      cargoPrice: properties.cargoPrice
    })
  };

  // Check if this is the selected point
  const isSelected = selectedPoint && isSameDeliveryPoint(selectedPoint, deliveryPoint);

  // Create marker with custom icon for LNG terminals
  const marker = new google.maps.Marker({
    position,
    map,
    title: properties.name,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: isLngTerminal ? '#FF6B35' : '#10B981',
      fillOpacity: 0.8,
      strokeColor: isLngTerminal ? '#EA580C' : '#059669',
      strokeWeight: 2,
      scale: isLngTerminal ? 10 : 8
    },
    zIndex: 1000
  });

  // Store marker for later reference
  if (markersRef) {
    markersRef.current.push(marker);
  }

  // If this is the selected point, create a highlighted circle around it
  if (isSelected) {
    const highlightCircle = createHighlightCircle(map, position, isLngTerminal ? '#FF6B35' : '#10B981');
    if (markersRef) {
      markersRef.current.push(highlightCircle as any);
    }
  }

  // Create tooltip element and add it to the map's div container
  const tooltipElement = createTooltipElement(deliveryPoint.name);
  const mapDiv = map.getDiv();
  mapDiv.appendChild(tooltipElement);

  // Add mouse events
  marker.addListener('mouseover', () => {
    tooltipElement.style.display = 'block';
  });

  marker.addListener('mouseout', () => {
    tooltipElement.style.display = 'none';
  });

  // Add click handler
  marker.addListener('click', () => {
    if (setSelectedPoint) {
      setSelectedPoint(deliveryPoint);
    }

    if (onSelectDeliveryPoint) {
      onSelectDeliveryPoint(deliveryPoint);
    }
  });

  // Extend bounds to include this point
  bounds.extend(position);
};