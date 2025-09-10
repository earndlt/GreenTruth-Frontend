import React, { createContext, useContext, useState, ReactNode } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "./AuthContext";
import { apiClient } from "@/services/apiClient";

// Types
interface Organization {
  id: string;
  name: string;
  type: string;
  aclType: string;
  isIssuer: boolean;
  ein: string;
  jurisdiction: string;
  addressId: string;
  isMeasurer: boolean;
  isVerifier: boolean;
  isTest: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationProfile {
  id: string;
  name: string;
  machineName: string;
  jurisdiction: string;
  isCustodial: boolean;
  ein: string;
  addressId: string;
  walletId: string;
  organizationId: string;
  address: {
    id: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    street: string;
  };
  wallet: {
    id: string;
    name: string;
    type: string;
    status: string;
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
    createdAt: string;
    updatedAt: string;
  };
}

interface Wallet {
  id: string;
  name: string;
  type: string;
  status: string;
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
  profile: {
    name: string;
  };
  partnerProfile: {
    name: string;
    logo: string | null;
  } | null;
  createdAt: string;
}

interface WalletAssetsSummary {
  all: {
    summary: {
      count: number;
      standards: string[];
      producer_names: string[];
      token_type: string[];
      formatted_vintage: string[];
    };
  };
}

interface WalletTotalSummary {
  all: {
    counter: number;
    summary: {
      count: number;
      total_balance_total: number;
      total_balance_available: number;
      total_balance_locked: number;
      CO2E_TOTAL: number;
      standards_default_max_carbon_intensity: number | null;
      totalQuantity: number;
      totalDefaultCarbonIntensity: number;
      standards_default_avg_carbon_intensity: number;
    };
  };
}

interface TokenAsset {
  energy: {
    type: string;
    quantity: {
      amount: number;
      uom: string;
    };
    stage: string;
  };
  providers: {
    issuer: {
      name: string;
    };
    measurers: string[];
    verifiers: string[];
  };
  pollutantSource: {
    category: string;
    identifier: {
      id: string;
      format: string;
    };
    name: string;
    pad: string;
    basin: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  productionBatchData: {
    startDate: string;
    endDate: string;
    name: string;
    btuFactor: number;
    id: string;
    methaneConcentration: number;
    productionDays: number;
  };
  standards: any;
  batches: Array<{
    id: string;
    type: string;
    errors: any[];
    status?: string;
    identifier?: string;
  }>;
  status: string;
  token: {
    tokenType: string;
  };
  _id: string;
  energyAssetRef: string;
  walletAddress: string;
  balance: {
    available: number;
    locked: number;
    retired: number;
    total: number;
  };
  locked: Array<{
    actionType: string;
    quantity: number;
  }>;
  consumed: any[];
  createdAt: string;
  queryBalance: number;
  defaultStandard: {
    standard: {
      name: string;
    };
    carbonIntensity: {
      value: number | null;
    };
  };
  vintage: {
    year: number;
    month: number;
  };
}

interface TokenAssetsResponse {
  results: TokenAsset[];
  total: number;
}

// Add new interface for transaction history
interface TransactionHistory {
  ownerId: string;
  ownerType: string;
  createdAt: string;
  quantity: string | number;
  status: string;
  networkAccessId: string | null;
  contractId: string | null;
  firstName: string;
  lastName: string;
  energyType: string;
  unitMetric: string;
  _id?: string;
  userId?: string;
}

interface TransactionHistoryResponse {
  results: TransactionHistory[];
  total: number;
}

interface OrganizationContextType {
  organizations: Organization[];
  profiles: OrganizationProfile[];
  wallets: Wallet[];
  walletAssetsSummary: WalletAssetsSummary | null;
  walletTotalSummary: WalletTotalSummary | null;
  tokenAssets: TokenAssetsResponse | null;
  transactionHistory: TransactionHistoryResponse | null;
  loading: boolean;
  loadingTokenAssets: boolean;
  loadingTransactionHistory: boolean;
  error: string | null;
  fetchOrganizations: () => Promise<Organization[]>;
  fetchOrganizationProfiles: (orgId: string) => Promise<OrganizationProfile[]>;
  fetchOrganizationProfileWallets: (profileId: string) => Promise<Wallet[]>;
  fetchWalletAssetsSummary: (
    walletId: string,
    organizationName: string
  ) => Promise<void>;
  fetchWalletTotalSummary: (
    walletId: string,
    organizationName: string
  ) => Promise<void>;
  fetchTokenAssets: (
    walletId: string,
    organizationName: string
  ) => Promise<void>;
  fetchTransactionHistory: (
    walletId: string,
    page?: number,
    perPage?: number
  ) => Promise<void>;
  clearOrganizationData: () => void;
  setOrganizations: (organizations: Organization[]) => void;
  setProfiles: (profiles: OrganizationProfile[]) => void;
  setWallets: (wallets: Wallet[]) => void;
  setWalletAssetsSummary: (summary: WalletAssetsSummary | null) => void;
  setWalletTotalSummary: (summary: WalletTotalSummary | null) => void;
  setTokenAssets: (assets: TokenAssetsResponse | null) => void;
  setTransactionHistory: (history: TransactionHistoryResponse | null) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [profiles, setProfiles] = useState<OrganizationProfile[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletAssetsSummary, setWalletAssetsSummary] =
    useState<WalletAssetsSummary | null>(null);
  const [walletTotalSummary, setWalletTotalSummary] =
    useState<WalletTotalSummary | null>(null);
  const [tokenAssets, setTokenAssets] = useState<TokenAssetsResponse | null>(
    null
  );
  const [transactionHistory, setTransactionHistory] =
    useState<TransactionHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTokenAssets, setLoadingTokenAssets] = useState(false);
  const [loadingTransactionHistory, setLoadingTransactionHistory] =
    useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: { results: Organization[] } }>(
        API_ENDPOINTS.ORGANIZATION.GET_ORGANIZATIONS
      );
      
      setOrganizations(response.data.results);
      return response.data.results;
    } catch (error) {
      setError((error as Error).message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationProfiles = async (orgId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: { results: OrganizationProfile[] } }>(
        `${API_ENDPOINTS.ORGANIZATION.GET_ORGANIZATION_PROFILES}/${orgId}/profiles`
      );
      
      setProfiles(response.data.results);
      return response.data.results;
    } catch (error) {
      setError((error as Error).message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationProfileWallets = async (profileId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: { results: any[] } }>(
        `${API_ENDPOINTS.ORGANIZATION.GET_ORGANIZATION_PROFILE_WALLETS}/${profileId}/wallet`
      );
      
      setWallets(response.data.results);
      return response.data.results;
    } catch (error) {
      setError((error as Error).message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletAssetsSummary = async (
    walletId: string,
    organizationName: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ data: { data: any } }>(
        `${API_ENDPOINTS.ORGANIZATION.POST_WALLET_ASSETS_SUMMARY_PRODUCER}/${walletId}/assets/producer`,
        {
          organizationName,
        }
      );
      
      setWalletAssetsSummary(response.data.data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletTotalSummary = async (
    walletId: string,
    organizationName: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ data: { data: any } }>(
        `${API_ENDPOINTS.ORGANIZATION.POST_WALLET_ASSETS_SUMMARY_TOTAL}/${walletId}/assets/total`,
        {
          organizationName,
        }
      );
      
      setWalletTotalSummary(response.data.data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenAssets = async (
    walletId: string,
    organizationName: string
  ) => {
    setLoadingTokenAssets(true);
    setError(null);
    try {
      const response = await apiClient.post<{ data: any }>(
        `${API_ENDPOINTS.ORGANIZATION.POST_WALLET_ASSETS}/${walletId}/assets`,
        {
          organizationName,
        }
      );
      
      setTokenAssets(response.data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoadingTokenAssets(false);
    }
  };

  const fetchTransactionHistory = async (
    walletId: string,
    page = 1,
    perPage = 50
  ) => {
    setLoadingTransactionHistory(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: any }>(
        `${API_ENDPOINTS.ORGANIZATION.GET_WALLET_TRANSACTION_HISTORY}/${walletId}/transaction-history?page=${page}&perPage=${perPage}`
      );
      
      setTransactionHistory(response.data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoadingTransactionHistory(false);
    }
  };

  const clearOrganizationData = () => {
    setOrganizations([]);
    setProfiles([]);
    setWallets([]);
    setWalletAssetsSummary(null);
    setWalletTotalSummary(null);
    setTokenAssets(null);
    setTransactionHistory(null);
    setError(null);
  };

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        profiles,
        wallets,
        walletAssetsSummary,
        walletTotalSummary,
        tokenAssets,
        transactionHistory,
        loading,
        loadingTokenAssets,
        loadingTransactionHistory,
        error,
        fetchOrganizations,
        fetchOrganizationProfiles,
        fetchOrganizationProfileWallets,
        fetchWalletAssetsSummary,
        fetchWalletTotalSummary,
        fetchTokenAssets,
        fetchTransactionHistory,
        clearOrganizationData,
        setOrganizations,
        setProfiles,
        setWallets,
        setWalletAssetsSummary,
        setWalletTotalSummary,
        setTokenAssets,
        setTransactionHistory,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
};
