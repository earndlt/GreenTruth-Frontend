
import { DeliveryPointData, ConnectedEntity } from '../../types/pipelineTypes';

export interface RenderDeliveryPointOptions {
  fillColor: string;
  scale: number;
  isSelected: boolean;
}

export interface InfoWindowContentOptions {
  properties: {
    name?: string;
    description?: string;
    county?: string;
    state?: string;
    connected_entities?: ConnectedEntity[];
    verified_sources?: string[];
    connected_systems?: string[] | string;
    connected_to?: string;
    max_flow?: string;
    processors?: string[] | string;
    availableEACs?: number;
    eacPrice?: string;
    [key: string]: any;
  };
}
