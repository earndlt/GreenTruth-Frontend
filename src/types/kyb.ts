export type KYBStatus = 
  | 'pending'           // Initial state when form is submitted
  | 'in_process'        // Verification is being processed by DNB
  | 'approved'          // Verification successful
  | 'rejected'          // Verification failed
  | 'expired'           // Verification expired
  | 'requires_action';  // Additional information needed

export interface KYBVerificationRequest {
  duns: string;
  companyName: string;
}

export interface KYBVerificationResponse {
  success: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'in_process';
  message: string;
  userInput?: {
    companyName: string;
    duns: string;
  };
  details: {
    verificationId: string;
    submittedAt: string;
    dunsNumber: string;
    companyName: string;
    riskLevel: string;
    riskScore: number;
    entityState: string;
    dataPackage: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    businessDetails: {
      yearEstablished: string;
      registrationNumber: string;
      industry: string;
      operatingStatus: string;
      ceo: string;
    };
  };
}

export interface KYBVerificationRecord {
  verificationId: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_process';
  submittedAt: string;
  updatedAt: string;
  duns: string;
  companyName: string;
  riskLevel: string;
  riskScore: number;
  entityState: string;
  dataPackage: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  businessDetails: {
    yearEstablished: string;
    registrationNumber: string;
    industry: string;
    operatingStatus: string;
    ceo: string;
  };
  // Detailed risk breakdown
  riskBreakdown?: {
    countryRisk: {
      rating: number;
      level: string;
    };
    industryRisk: {
      rating: number;
      level: string;
    };
    entityRisk: {
      rating: number;
      level: string;
    };
    ownershipRisk: {
      rating: number | null;
      level: string | null;
    };
    sanctions: string;
    watchlists: string;
    politicalAffiliations: string;
    adverseMedia: string;
    calculatedRisk: {
      rating: number;
      level: string;
    };
    finalRisk: {
      rating: number;
      level: string;
    };
  };
  // Entity process information
  entityProcess?: {
    status: string;
    decisionBy: string;
    initiatedBy: string;
    reason: string;
    updatedDate: string | null;
  };
  // Screening details
  screeningDetails?: {
    level: string;
    enrichment: string;
    kaseIterationId: string;
  };
  // Additional business information
  additionalInfo?: {
    website: string;
    phone: string;
    currency: string;
    sicCode: string;
    naicsCode: string;
    unspscCode: string;
  };
  // Comprehensive D&B entity data
  dnbEntityData?: {
    entityId: string;
    category: string;
    thirdPartyId: string;
    tags: string[];
    customFields: Record<string, any>;
    organization: {
      websiteURL: string;
      organizationStartDate: string;
      primaryName: string;
      telephone: {
        phoneIsdCode: string;
        phoneNumber: string;
      };
      currency: string;
      entityYearOfBirth: string;
      registrationNumber: {
        number: string;
        description: string;
      };
      primaryAddress: {
        postalCode: string;
        streetAddress: string;
        continentalRegion: string;
        addressCounty: {
          county: string;
        };
        addressLocality: {
          locale: string;
        };
        addressRegion: {
          provinceOrState: string;
        };
        addressCountry: {
          country: string;
          countryISOAlpha2Code: string;
        };
      };
      dunsControlStatus: {
        operatingStatus: string;
      };
      mostSeniorPrincipal: {
        mostSeniorPrincipalName: string;
        mostSeniorPrincipalJobTitles: string[];
      };
      primaryIndustryCode: {
        primarySIC: string;
        primarySICDescription: string;
      };
      unspscCode: {
        primaryUNSPSC: string;
        primaryUNSPSCDescription: string;
      };
      industryCode: {
        primaryNAICS: string;
        primaryNAICSDescription: string;
      };
    };
    entityProcess: {
      status: string;
      reason: string;
      entityProcessUpdatedDate: string;
    };
    screeningDetails: {
      screeningEnrichment: string;
      screeningLevel: string;
      kaseIterationId: string;
    };
    riskScorecard: {
      configurationVersion: string;
      hasHigh: boolean;
      hasMedium: boolean;
      hasLow: boolean;
      riskScores: any;
    };
  };
}

export interface KYBVerificationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  in_process: number;
}

export interface KYBWebhookStatus {
  active: boolean;
  interval: number;
  lastUpdate: string;
}

// New interfaces for enhanced D&B integration
export interface KYBEntityCreationRequest {
  entityType: "Individual" | "Organization" | "Vessel" | "Aircraft";
  entityName: string;
  dataPackage: "CORE" | "CORE_PLUS" | "Non-DUNS";
  inPortfolio: "Yes" | "No";
  startEvaluation: "Yes" | "No";
  requestorUserId: string;
  requestorUserName: string;
  dunsNumber?: string;
  phoneNumber?: string;
  emailAddress?: string;
  websiteURL?: string;
  entityYearOfBirth?: string;
  countryRegistrationNumber?: string;
  entityPrimaryAddress?: {
    streetAddress: {
      line1: string;
      line2?: string;
    };
    addressLocality: {
      name: string;
    };
    addressRegion: {
      stateOrProvince: string;
      abbreviatedName?: string;
    };
    postalCode: string;
    country: {
      isoAlpha2Code: string;
    };
  };
  tagNames?: string[];
  customFields?: Record<string, string>;
  uboSearchIncluded?: boolean;
  tradeUp?: boolean;
  customerReference?: string;
}

export interface KYBScreeningRequest {
  screeningEnrichment?: string;
  screeningLevel?: string;
  kaseIterationId?: string;
  kaseId?: string;
}

export interface KYBRiskAssessment {
  riskScore?: number;
  stabilityScore?: number;
  supplierStabilityIndex?: number;
  supplierEvaluationRisk?: number;
  compositeRiskScorecard?: {
    value?: string;
    class?: string;
    status?: string;
    reason?: string;
  };
  cyberSecurityScorecard?: {
    cyberRiskScore?: number;
    l1Data?: any;
    l2Data?: any;
  };
}

export interface KYBEntityDetails {
  entityId: string;
  dunsNumber: string;
  thirdPartyId: string;
  dataPackage: string;
  entityName: string;
  inPortfolio: string;
  evaluate: string;
  entityState: string;
  entityCreatedDate: string;
  entityModifiedDate: string;
  category: string;
  stopD: boolean;
  entityPackage: string;
  spaceMoniker: string;
  organization?: {
    primaryName: string;
    primaryAddress?: {
      addressCountry?: {
        name: string;
        isoAlpha2Code: string;
      };
      addressLocality?: {
        name: string;
      };
      addressRegion?: {
        name: string;
        abbreviatedName: string;
      };
      postalCode?: string;
      streetAddress?: {
        line1: string;
        line2?: string;
      };
    };
    registrationNumbers?: Array<{
      registrationNumber: string;
      typeDescription: string;
    }>;
    businessEntityType?: {
      description: string;
    };
    numberOfEmployees?: Array<{
      value: number;
      informationScopeDescription: string;
    }>;
    financials?: Array<{
      yearlyRevenue?: Array<{
        value: number;
        currency: string;
      }>;
    }>;
    dnbAssessment?: {
      supplierStabilityIndexScore?: {
        classScore: number;
      };
      supplierEvaluationRiskScore?: {
        rawScore: number;
      };
    };
  };
} 