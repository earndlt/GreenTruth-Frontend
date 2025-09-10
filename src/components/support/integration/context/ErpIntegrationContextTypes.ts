
import React from 'react';

export interface ErpIntegrationContextType {
  selectedErp: string;
  setSelectedErp: (erp: string) => void;
  syncDirection: string;
  setSyncDirection: (direction: string) => void;
  syncFrequency: string;
  setSyncFrequency: (frequency: string) => void;
  apiEndpoint: string;
  setApiEndpoint: (endpoint: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isTesting: boolean;
  setIsTesting: (testing: boolean) => void;
  testStatus: 'success' | 'error' | null;
  setTestStatus: (status: 'success' | 'error' | null) => void;
  syncEnabled: boolean;
  setSyncEnabled: (enabled: boolean) => void;
  lastSynced: string | null;
  setLastSynced: (date: string | null) => void;
  syncFields: Record<string, boolean>;
  setSyncFields: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleTestConnection: () => void;
  handleSave: () => void;
  handleSyncNow: () => void;
  // New: Control for ERP/GreenTruth Vendor ID precedence
  useErpVendorIds: boolean;
  setUseErpVendorIds: (enabled: boolean) => void;
}

