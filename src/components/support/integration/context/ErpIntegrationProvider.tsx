
import React, { useState } from 'react';
import ErpIntegrationContext from './ErpIntegrationContextCore';
import type { ErpIntegrationContextType } from './ErpIntegrationContextTypes';
import { useToast } from '@/hooks/use-toast';

// The provider component encapsulates and updates context state and handlers
export const ErpIntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedErp, setSelectedErp] = useState('sap');
  const [syncDirection, setSyncDirection] = useState('bidirectional');
  const [syncFrequency, setSyncFrequency] = useState('daily');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'success' | 'error' | null>(null);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncFields, setSyncFields] = useState<Record<string, boolean>>({
    id: true,
    name: true,
    email: true,
    phone: true,
    website: true,
    category: true,
    status: true,
    location: true,
    // Identification Numbers
    taxIdentificationNumber: true,
    dunsNumber: true,
    contractIds: true,
    registrationNumber: true,

    // Classification & Ratings
    industryClassification: true,
    certifications: true,
    creditRating: true,
    supplierTier: true,
    preferredVendorStatus: true,
    complianceScore: true,

    // Dates & Metrics
    onboardingDate: true,
    lastAuditDate: true,
    lastTransaction: true,
    qualityRating: true,
    performanceMetrics: true,

    // Financial & Payment
    paymentTerms: true,
    bankAccountDetails: true,

    // Contacts & Documents
    contacts: true,
    documents: true,

    // Insurance & Compliance
    insuranceDetails: true,
    complianceData: true,

    // Additional Data
    transactions: true,
    customFields: true,
  });

  // NEW: ERP Vendor ID precedence flag, default false (GreenTruth takes precedence unless toggled)
  const [useErpVendorIds, setUseErpVendorIds] = useState(false);

  const { toast } = useToast();

  const handleTestConnection = () => {
    if (!apiEndpoint || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please provide both API endpoint and API key",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestStatus('success');
      toast({
        title: "Connection Successful",
        description: "Successfully connected to your ERP system"
      });
    }, 1500);
  };

  const handleSave = () => {
    if (!apiEndpoint || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please provide both API endpoint and API key",
        variant: "destructive"
      });
      return;
    }

    if (testStatus !== 'success') {
      toast({
        title: "Test Connection First",
        description: "Please test your connection before saving",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSyncEnabled(true);
      const now = new Date().toISOString();
      setLastSynced(now);
      toast({
        title: "Configuration Saved",
        description: "Your ERP integration has been configured successfully"
      });
    }, 1500);
  };

  const handleSyncNow = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const now = new Date().toISOString();
      setLastSynced(now);
      toast({
        title: "Sync Completed",
        description: "Vendor data has been synchronized with your ERP system"
      });
    }, 2000);
  };

  const value: ErpIntegrationContextType = {
    selectedErp,
    setSelectedErp,
    syncDirection,
    setSyncDirection,
    syncFrequency,
    setSyncFrequency,
    apiEndpoint,
    setApiEndpoint,
    apiKey,
    setApiKey,
    isLoading,
    setIsLoading,
    isTesting,
    setIsTesting,
    testStatus,
    setTestStatus,
    syncEnabled,
    setSyncEnabled,
    lastSynced,
    setLastSynced,
    syncFields,
    setSyncFields,
    handleTestConnection,
    handleSave,
    handleSyncNow,
    useErpVendorIds,
    setUseErpVendorIds,
  };

  return (
    <ErpIntegrationContext.Provider value={value}>
      {children}
    </ErpIntegrationContext.Provider>
  );
};

