// LNG Terminal specific types extending existing pipeline types
import { PipelineFeature, PipelineData } from '@/components/eac-registry/map/types/pipelineTypes';

export interface LngCargoData {
  id: string;
  terminalName: string;
  volume: number; // in MMBtu
  deliveryMonth: string;
  deliveryYear: number;
  price: string;
  producer: {
    name: string;
    logo: string;
  };
  processor: {
    name: string;
    logo: string;
  };
  transporter: {
    name: string;
    logo: string;
  };
  available: boolean;
  vesselName?: string;
  loadingDate?: string;
}

export interface LngTerminalFeature extends PipelineFeature {
  properties: PipelineFeature['properties'] & {
    terminal?: string;
    cargoFrequency?: string;
    availableCargos?: number;
    cargoPrice?: string;
  };
}

export interface LngTerminalData extends PipelineData {
  name: string;
  features: LngTerminalFeature[];
}

export interface LngTerminalSelection {
  id: string;
  name: string;
  checked: boolean;
  data: LngTerminalData;
  color: string;
}