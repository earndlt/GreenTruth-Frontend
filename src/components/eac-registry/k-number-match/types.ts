
export interface Counterparty {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  isApproved?: boolean;
}

export interface MatchedEAC {
  id: string;
  contractId: string;
  upstreamContractId: string;
  downstreamContractId: string;
  volume: number;
  dailyVolume?: number;
  daysInPeriod?: number;
  sourceFacility: string;
  emissionFactor: string;
  emissionPoint: string;
  timeRange: string;
  receiptLocationId?: string;
  counterparty?: Counterparty;
  qetCompatible?: boolean;
  pricePerMMBtu: string;
}
