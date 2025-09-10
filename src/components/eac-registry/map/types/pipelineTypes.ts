// Types for pipeline data structures
export interface PipelineFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
  properties?: {
    name?: string;
    description?: string;
    capacity?: string;
    producers?: string[] | string;
    availableEACs?: number;
    eacPrice?: string;
    segment?: string;
    state?: string;
    county?: string;
    type?: string;
    iconSize?: [number, number] | number[];
    pipeline?: string;
    direction?: string;
    connected_systems?: string[];
    connected_to?: string;
    max_flow?: string;
    processors?: string[];
    verified_sources?: string[];
    connected_entities?: ConnectedEntity[];
    authorized_producers?: AuthorizedProducer[];
    color?: string; // Added color property
    start?: string; // Added start property
    end?: string;   // Added end property
    // LNG Terminal specific properties
    terminal?: string;
    cargoFrequency?: string;
    availableCargos?: number;
    cargoPrice?: string;
  };
}

export interface ConnectedEntity {
  name: string;
  id: string;
  type: string;
  max_throughput?: string;
  ferc_docket?: string;
  regulatory_status?: string;
}

// New interface for authorized producers
export interface AuthorizedProducer {
  name: string;
  contract_number: string;
  ferc_id?: string;
  details: string;
  effective_date: string;
  available_eacs?: number;
  eac_price?: string;
}

export interface PipelineData {
  type: string;
  features: PipelineFeature[];
}

export interface DeliveryPointData {
  name: string;
  state: string;
  county: string;
  description: string;
  availableEACs: number;
  eacPrice: string;
  verified_sources?: string[];
  connected_entities?: ConnectedEntity[];
  authorized_producers?: AuthorizedProducer[];
  pipeline?: string; // Add pipeline property for better identification
}

export interface PipelineRendererProps {
  map: google.maps.Map;
  pipelineData: PipelineData[];
  onSelectDeliveryPoint?: (point: DeliveryPointData) => void;
  markersRef: React.MutableRefObject<google.maps.Marker[]>;
  setSelectedPoint: (point: DeliveryPointData | null) => void;
  selectedPoint: DeliveryPointData | null;
  showLabels: boolean;
}

export interface PipelineSelection {
  id: string;
  name: string;
  checked: boolean;
  data: PipelineData;
  color: string;
}

// New transaction related types
export interface EacTransactionRequest {
  transactionType: 'spot' | 'forward';
  quantity: number;
  segment: 'production' | 'processing' | 'transportation' | 'distribution';
  offtakePoint: string;
  deliveryDate?: string;
  corporateEntity: {
    id: string;
    name: string;
    walletId: string;
  };
  sourceInfo: {
    knownProducer: boolean;
    producerName?: string;
    processorName?: string;
    requestMatching?: boolean;
  };
  eacDetails: {
    producer: string;
    certType: string;
    vintage: string;
    pricePerUnit: number;
  };
}

export interface EacTransactionResponse {
  transactionId: string;
  status: 'pending' | 'complete' | 'failed';
  timestamp: string;
  deliveryEstimate?: string;
  message?: string;
}

// LNG Terminal types
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

export interface LngTerminalData extends DeliveryPointData {
  terminal?: string;
  cargoFrequency?: string;
  availableCargos?: number;
  cargoPrice?: string;
}

