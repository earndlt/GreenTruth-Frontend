import React, { createContext, useContext, useState, ReactNode } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "./AuthContext";

// Types for EAC data
export interface EacOrganization {
  id: string;
  name: string;
  type: string;
  aclType: string;
  isIssuer: boolean;
  ein: string;
  duns?: string;
  jurisdiction: string;
  addressId: string;
  isMeasurer: boolean;
  isVerifier: boolean;
  isTest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EacAddress {
  id: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  street: string;
}

export interface EacWallet {
  id: string;
  name: string;
  type: string;
  status: string;
  message: string | null;
  address: string;
  blockData: {
    create: {
      to: string;
      from: string;
      blockHash: string;
      blockNumber: number;
      transactionHash: string;
    };
  };
  rulesData: {
    rules: Array<{
      name: string;
      required: number;
    }>;
  };
  emissionsType: string;
  profileId: string;
  partnerProfileId: string | null;
  sourceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EacProfile {
  id: string;
  name: string;
  machineName: string;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
  ssn: string | null;
  phone: string | null;
  linkedIn: string | null;
  jurisdiction: string;
  isCustodial: boolean;
  ein: string;
  duns: string | null;
  addressId: string;
  walletId: string;
  organizationId: string;
  logoId: string | null;
  createdAt: string;
  updatedAt: string;
  address: EacAddress;
  wallet: EacWallet;
}

export interface EacAssetsSummary {
  counter?: number;
  summary?: {
    _id: string | null;
    count: number;
    total_balance_available: number;
    total_balance_locked: number;
    total_balance_retired: number;
    total_balance_total: number;
    total_queryBalance: number;
    total_quantity: number;
    statuses: string[];
    measurers: string[];
    standards: string[];
    verifiers: string[];
    vintage_year: string[];
    vintage_month: string[];
    formatted_vintage: string[];
    producer_names: string[];
    CO2E_TOTAL: number;
    token_type: string[];
    totalQuantity: number;
    totalDefaultCarbonIntensity: number;
    standards_default_avg_carbon_intensity: number;
    standards_default_max_carbon_intensity: number | null;
  };
}

export interface EacOrganizationData {
  organization: EacOrganization;
  profile: EacProfile;
  assets: EacAssetsSummary;
}

interface EacContextType {
  eacOrganizations: EacOrganizationData[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchEacOrganizations: () => Promise<EacOrganizationData[]>;
  clearEacData: () => void;
  setEacOrganizations: (organizations: EacOrganizationData[]) => void;
}

const EacContext = createContext<EacContextType | undefined>(undefined);

export const EacProvider = ({ children }: { children: ReactNode }) => {
  const [eacOrganizations, setEacOrganizations] = useState<
    EacOrganizationData[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const { handleApiResponse } = useAuth();

  const fetchEacOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        API_ENDPOINTS.ORGANIZATION.GET_EAC_ASSETS_SUMMARY,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "greentruth_access_token"
            )}`,
          },
        }
      );

      await handleApiResponse(response);

      const jsonData = await response.json();
      const data = jsonData.data;
      setEacOrganizations(data);
      setHasFetched(true);
      return data;
    } catch (error) {
      setError((error as Error).message);
      setHasFetched(true);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearEacData = () => {
    setEacOrganizations([]);
    setError(null);
    setHasFetched(false);
  };

  return (
    <EacContext.Provider
      value={{
        eacOrganizations,
        loading,
        error,
        hasFetched,
        fetchEacOrganizations,
        clearEacData,
        setEacOrganizations,
      }}
    >
      {children}
    </EacContext.Provider>
  );
};

export const useEac = () => {
  const context = useContext(EacContext);
  if (context === undefined) {
    throw new Error("useEac must be used within an EacProvider");
  }
  return context;
};
