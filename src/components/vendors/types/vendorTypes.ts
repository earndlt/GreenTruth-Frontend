
export interface VendorContact {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface VendorDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'active' | 'archived' | 'pending';
}

export interface VendorPaymentTerms {
  paymentTerms: string;
  earnDltClearing: boolean;
  preferredCurrency: string;
  bankAccountDetails?: {
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    swiftCode?: string;
    ibanNumber?: string;
  };
}

export interface Transaction {
  id: string;
  type: 'Purchase' | 'RFP Response' | 'Payment' | string;
  amount: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Rejected' | 'Accepted';
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  complianceScore: number;
  status: 'active' | 'inactive';
  lastTransaction: string;
  email?: string;
  phone?: string;
  website?: string;
  documents?: VendorDocument[];
  contacts?: VendorContact[];
  paymentTerms?: VendorPaymentTerms;
  transactions?: Transaction[];
  taxIdentificationNumber?: string;
  dunsNumber?: string;
  contractIds?: string[];
  registrationNumber?: string;
  industryClassification?: string;
  certifications?: string[];
  insuranceDetails?: {
    policyNumber: string;
    coverageType: string;
    expiryDate: string;
  }[];
  creditRating?: string;
  supplierTier?: number;
  preferredVendorStatus?: boolean;
  onboardingDate?: string;
  lastAuditDate?: string;
  qualityRating?: number;
  performanceMetrics?: {
    deliveryAccuracy: number;
    qualityScore: number;
    responseTime: number;
  };
  companyId?: string; // Add company ID to associate vendor with a specific corporate entity
}
