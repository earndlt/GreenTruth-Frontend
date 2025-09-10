
import { ConnectedEntity, AuthorizedProducer } from '../../types/pipelineTypes';
import { InfoWindowContentOptions } from './types';

/**
 * Generates HTML content for verified sources
 */
export const generateVerifiedSourcesHTML = (
  sources: string[]
): string => {
  if (!sources || sources.length === 0) return '';
  
  return `
    <div class="mt-2 pt-2 border-t border-gray-200">
      <p class="text-xs text-gray-600">
        <span class="font-medium">Verified via:</span> ${sources.join(', ')}
      </p>
    </div>
  `;
};

/**
 * Generates HTML content for additional point information
 */
export const generateAdditionalContentHTML = (
  options: InfoWindowContentOptions
): string => {
  const { properties } = options;
  let additionalContent = '';
  
  if (properties.connected_systems) {
    const connectedSystems = Array.isArray(properties.connected_systems) 
      ? properties.connected_systems.join(', ') 
      : properties.connected_systems;
    
    additionalContent += `<p><span class="font-medium">Connected Systems:</span> ${connectedSystems}</p>`;
  }
  
  if (properties.connected_to) {
    additionalContent += `<p><span class="font-medium">Connected To:</span> ${properties.connected_to}</p>`;
  }
  
  if (properties.max_flow) {
    additionalContent += `<p><span class="font-medium">Max Flow:</span> ${properties.max_flow}</p>`;
  }
  
  if (properties.processors && properties.processors.length > 0) {
    const processors = Array.isArray(properties.processors) 
      ? properties.processors.join(', ') 
      : properties.processors;
    
    additionalContent += `<p><span class="font-medium">Processors:</span> ${processors}</p>`;
  }
  
  return additionalContent;
};

/**
 * Creates an info window with all the delivery point details
 */
export const createInfoWindowContent = (properties: any): string => {
  const isLngTerminal = properties.type === 'LNG Terminal';
  
  if (isLngTerminal) {
    return `
      <div class="p-3 min-w-[280px]">
        <h3 class="font-medium text-base mb-2">${properties.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${properties.county}, ${properties.state}</p>
        <p class="text-sm text-gray-700 mb-3">${properties.description}</p>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Available Cargos:</span>
            <span class="text-sm font-semibold text-orange-600">${properties.availableCargos}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm font-medium">Cargo Price:</span>
            <span class="text-sm font-semibold text-orange-600">${properties.cargoPrice}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm font-medium">Frequency:</span>
            <span class="text-sm text-gray-600">${properties.cargoFrequency}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  const sourcesHTML = properties.verified_sources 
    ? generateVerifiedSourcesHTML(properties.verified_sources) 
    : '';
    
  const additionalContent = generateAdditionalContentHTML({ properties });
  
  return `
    <div class="p-2">
      <h3 class="font-medium text-base">${properties.name}</h3>
      <p>${properties.county}, ${properties.state}</p>
      <p class="text-gray-600 mt-1">${properties.description}</p>
      ${additionalContent}
      ${sourcesHTML}
      <div class="mt-2">
        <p class="font-medium text-emerald-600">${properties.availableEACs} EACs Available</p>
        <p class="text-emerald-600">${properties.eacPrice}</p>
      </div>
    </div>
  `;
};
