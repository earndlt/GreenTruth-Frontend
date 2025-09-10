
import { PipelineFeature, DeliveryPointData } from '../../types/pipelineTypes';

/**
 * Creates a delivery point data object from feature properties
 */
export const createDeliveryPointData = (
  feature: PipelineFeature
): DeliveryPointData => {
  if (!feature.properties) {
    return {
      name: '',
      state: '',
      county: '',
      description: '',
      availableEACs: 0,
      eacPrice: '',
      pipeline: feature.properties?.pipeline || '' // Add pipeline property for better identification
    };
  }
  
  return {
    name: feature.properties.name || '',
    state: feature.properties.state || '',
    county: feature.properties.county || '',
    description: feature.properties.description || '',
    availableEACs: feature.properties.availableEACs || 0,
    eacPrice: feature.properties.eacPrice || '',
    verified_sources: feature.properties.verified_sources,
    connected_entities: feature.properties.connected_entities,
    authorized_producers: feature.properties.authorized_producers,
    pipeline: feature.properties.pipeline || '' // Add pipeline property for better identification
  };
};

/**
 * Checks if two delivery points are the same
 */
export const isSameDeliveryPoint = (point1: DeliveryPointData, point2: DeliveryPointData): boolean => {
  // Enhanced matching logic to better identify the same point
  return point1.name === point2.name && 
         point1.state === point2.state &&
         (point1.county === point2.county || !point1.county || !point2.county);
};
