
import { RegulationsDocument } from '@/services/regulationsGovApi';

export interface RegulationsState {
  documents: RegulationsDocument[];
  loading: boolean;
  lastSync: string | null;
  error: string | null;
  syncFrequency: 'daily' | 'weekly' | 'monthly';
  syncInProgress: boolean;
}

export interface RegulationsContextValue extends RegulationsState {
  setSyncFrequency: (frequency: 'daily' | 'weekly' | 'monthly') => void;
  syncRegulations: (forceSync?: boolean) => Promise<void>;
  getRelevantDocuments: (product: string) => RegulationsDocument[];
}
