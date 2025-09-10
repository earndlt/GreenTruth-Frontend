import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  Map,
  Wallet,
  FileCheck,
  FileText,
  ChartBar,
  FileSearch,
} from "lucide-react";
import EacHeader from "@/components/eac-registry/EacHeader";
import EacRegistryStatus from "@/components/eac-registry/EacRegistryStatus";
import EacSearchBar from "@/components/eac-registry/EacSearchBar";
import ActiveEacsTab from "@/components/eac-registry/ActiveEacsTab";
import TransactionsTab from "@/components/eac-registry/TransactionsTab";
import AnalyticsTab from "@/components/eac-registry/AnalyticsTab";
import WalletTab from "@/components/eac-registry/WalletTab";
import PipelineMapTab from "@/components/eac-registry/PipelineMapTab";
import KNumberMatchTab from "@/components/eac-registry/KNumberMatchTab";
import { useToast } from "@/hooks/use-toast";
import { useOrganization } from "../context/OrganizationContext";
import { useAuth } from "../context/AuthContext";
import { useEac } from "@/context/EacContext";

/**
 * EAC REGISTRY PAGE
 * 
 * PRODUCTION SIMPLIFICATION (Based on Meeting 2025-08-13):
 * - Core tabs for daily operations: Gas Trace + Active EACs + EAC Map + Transactions + Wallet
 * - Active EACs and Transactions kept for daily operational needs
 * - EAC Map kept for sales and demo purposes (important for concept car)
 * - Removed complex features (Analytics)
 * - All removed tabs are commented out for easy re-enabling later
 * - Default tab is now "Gas Trace" for streamlined user experience
 * 
 * TO RE-ENABLE FEATURES:
 * 1. Uncomment the desired tabs in TabsList and TabsContent
 * 2. Update the default activeTab state if needed
 * 3. Ensure proper component imports and routing
 */
const EacRegistry = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("gas-trace"); // Default to Gas Trace for production
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const { toast } = useToast();
  const {
    organizations,
    profiles,
    wallets,
    walletAssetsSummary,
    walletTotalSummary,
    loading: loadingOrganization,
    error: errorOrganization,
    fetchOrganizations,
    fetchOrganizationProfiles,
    fetchOrganizationProfileWallets,
    fetchWalletAssetsSummary,
    fetchWalletTotalSummary,
  } = useOrganization();

  const {
    eacOrganizations,
    loading: loadingEac,
    error: errorEac,
    hasFetched,
    fetchEacOrganizations,
  } = useEac();

  const { user } = useAuth();

  // Handle URL query parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      // Only allow valid tabs that are currently visible
      const validTabs = ['gas-trace', 'transactions', 'wallet'];
      if (validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      } else {
        // If invalid tab, redirect to gas-trace
        setActiveTab('gas-trace');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (location.state) {
      if (location.state.activeTab) {
        setActiveTab(location.state.activeTab);

        if (location.state.highlightTransaction) {
          toast({
            title: "Transaction Complete",
            description:
              "Your recent transaction has been added to the transactions list.",
          });
        }
      }

      if (location.state.selectedCompanyId) {
        setSelectedCompanyId(location.state.selectedCompanyId);
      }
    }
  }, [location.state, toast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch organizations and get the results directly
        const fetchedOrganizations = await fetchOrganizations();

        if (fetchedOrganizations.length > 0) {
          const organization = fetchedOrganizations[0];
          // Fetch profiles for the organization and get the results directly
          const fetchedProfiles = await fetchOrganizationProfiles(
            organization.id
          );

          // If we have profiles, fetch wallets for the first profile
          if (fetchedProfiles.length > 0) {
            const firstProfile = fetchedProfiles[0];
            // Fetch wallets and get the results directly
            const fetchedWallets = await fetchOrganizationProfileWallets(
              firstProfile.id
            );

            // If we have wallets, fetch summaries for the first wallet
            if (fetchedWallets.length > 0) {
              const firstWallet = fetchedWallets[0];
              await fetchWalletAssetsSummary(firstWallet.id, organization.name);
              await fetchWalletTotalSummary(firstWallet.id, organization.name);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching organization data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch EAC organizations if they haven't been fetched yet
        if ((!hasFetched && !loadingEac) || eacOrganizations.length == 0) {
          await fetchEacOrganizations();
        }
      } catch (err) {
        console.error("Error fetching EAC data:", err);
        toast({
          title: "Error",
          description: "Failed to load EAC data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [hasFetched, loadingEac, fetchEacOrganizations, toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL query parameter to maintain navigation state
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', value);
    window.history.replaceState(null, '', `?${newSearchParams.toString()}`);
  };

  if (loadingOrganization || loadingEac) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
      </div>
    );
  }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div className="p-6 space-y-6">
      <EacHeader />
      <EacRegistryStatus />
      <EacSearchBar />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        {/* <TabsList>
        <TabsTrigger value="gas-trace">
          <FileSearch className="h-4 w-4 mr-2" />
          Gas Trace
        </TabsTrigger>
        <TabsTrigger value="active">
          <FileCheck className="h-4 w-4 mr-2" />
          Active EACs
        </TabsTrigger>
        <TabsTrigger value="pipeline-map">
          <Map className="h-4 w-4 mr-2" />
          EAC Map
        </TabsTrigger>
        <TabsTrigger value="transactions">
          <FileText className="h-4 w-4 mr-2" />
          Transactions
        </TabsTrigger>
        <TabsTrigger value="wallet">
          <Wallet className="h-4 w-4 mr-2" />
          Wallet
        </TabsTrigger>

        <TabsTrigger value="analytics">
          <ChartBar className="h-4 w-4 mr-2" />
          Analytics
        </TabsTrigger>

      </TabsList> */}

        {/* PRODUCTION TAB CONTENT - Core functionality for daily operations */}
        <TabsContent value="gas-trace">
          <KNumberMatchTab />
        </TabsContent>
        {/* HIDDEN FOR PRODUCTION - To be re-enabled in future releases */}
        {/*
        <TabsContent value="active">
          <ActiveEacsTab />
        </TabsContent>
        <TabsContent value="pipeline-map">
          <PipelineMapTab />
        </TabsContent>
        */}
        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>
        <TabsContent value="wallet">
          <WalletTab />
        </TabsContent>

        {/* COMMENTED OUT FOR PRODUCTION - To be re-enabled later */}
        {/*
        <TabsContent value="active">
          <ActiveEacsTab />
        </TabsContent>
        <TabsContent value="pipeline-map">
          <PipelineMapTab />
        </TabsContent>
        <TabsContent value="transactions">
          <TransactionsTab />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        */}
      </Tabs>
    </div >
  );
};

export default EacRegistry;
