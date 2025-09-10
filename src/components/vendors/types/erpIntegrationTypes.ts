
export interface ErpSyncConfig {
  erp_system: 'sap' | 'microsoft' | 'oracle' | 'salesforce' | 'custom';
  sync_direction: 'bidirectional' | 'push' | 'pull';
  sync_frequency: 'hourly' | 'daily' | 'weekly' | 'manual';
  api_endpoint: string;
  last_synced: string | null;
  sync_enabled: boolean;
  // Whether ERP vendor ID takes precedence over system-generated ID
  use_erp_vendor_ids: boolean;
  sync_fields: {
    // Basic Information
    id: boolean; // Adding vendor ID tracking
    name: boolean;
    email: boolean;
    phone: boolean;
    website: boolean;
    category: boolean;
    status: boolean;
    location: boolean;

    // Identification Numbers
    taxIdentificationNumber: boolean;
    dunsNumber: boolean;
    contractIds: boolean;
    registrationNumber: boolean;

    // Classification & Ratings
    industryClassification: boolean;
    certifications: boolean;
    creditRating: boolean;
    supplierTier: boolean;
    preferredVendorStatus: boolean;
    complianceScore: boolean;

    // Dates & Metrics
    onboardingDate: boolean;
    lastAuditDate: boolean;
    lastTransaction: boolean;
    qualityRating: boolean;
    performanceMetrics: boolean;

    // Financial & Payment
    paymentTerms: boolean;
    bankAccountDetails: boolean;

    // Contacts & Documents
    contacts: boolean;
    documents: boolean;

    // Insurance & Compliance
    insuranceDetails: boolean;
    complianceData: boolean;

    // Additional Data
    transactions: boolean;
    customFields: boolean;
  };
}

export interface ErpSyncResult {
  timestamp: string;
  status: 'successful' | 'partial' | 'failed';
  stats: {
    total: number;
    updated: number;
    created: number;
    unchanged: number;
    failed: number;
  };
  errors?: Array<{
    vendor_id: string;
    error_message: string;
  }>;
}

export interface ErpSyncHistory {
  results: ErpSyncResult[];
  next_scheduled_sync: string | null;
}
