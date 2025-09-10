import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import EacGrid from "./active-eacs/EacGrid";
import EacPurchaseDialog from "./active-eacs/EacPurchaseDialog";
import { useEacPurchase } from "./active-eacs/hooks/useEacPurchase";
import { useEac } from "@/context/EacContext";

const ITEMS_PER_PAGE = 6;

const ActiveEacsTab = () => {
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const {
    dialogOpen,
    selectedEac,
    setDialogOpen,
    handleCloseDialog,
    handlePurchase,
  } = useEacPurchase();

  const { eacOrganizations, loading } = useEac();
  // Transform API data to match the expected EAC format
  const transformedEacData = useMemo(() => {
    if (!eacOrganizations || eacOrganizations.length === 0) {
      return [];
    }

    return eacOrganizations.map((org) => {
      const { organization, profile, assets } = org;

      // Check if organization has assets
      const hasAssets =
        assets && assets.summary && Object.keys(assets.summary).length > 0;
      const summary = hasAssets ? assets.summary! : null;

      const eacEntry = {
        id: `ORG-${organization.id.slice(0, 8).toUpperCase()}`,
        type: hasAssets ? summary?.token_type?.[0] || "QET" : "N/A",
        vendor: organization.name,
        quantity: hasAssets
          ? `${summary?.total_balance_available?.toLocaleString() || 0} MMBtu`
          : "0 MMBtu",
        attributes: hasAssets
          ? [
              summary?.standards?.[0] || "N/A",
              ...(summary?.verifiers || []),
              ...(summary?.measurers || []),
            ].filter(Boolean)
          : ["No assets available"],
        date: new Date(organization.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        price: hasAssets
          ? (summary?.standards_default_avg_carbon_intensity || 0).toFixed(2)
          : "0.00",
        producer: organization.name,
        deliveryPoint: {
          name: `${profile?.address?.city || "Unknown"} Hub`,
          state: profile?.address?.state || "Unknown",
        },
        availableVolume: hasAssets ? summary?.total_balance_available || 0 : 0,
        status: hasAssets ? summary?.statuses?.[0] || "available" : "no_assets",
        energySource: hasAssets ? summary?.token_type?.[0] || "QET" : "N/A",
        organizationId: organization.id,
        profileId: profile?.id || "",
        profileWalletId: profile?.wallet?.id || "",
        ein: organization.ein,
        isIssuer: organization.isIssuer,
        isMeasurer: organization.isMeasurer,
        isVerifier: organization.isVerifier,
        vintage: hasAssets
          ? summary?.formatted_vintage?.[0] ||
            summary?.vintage_year?.[0] ||
            "2025"
          : "N/A",
        standard: hasAssets ? summary?.standards?.[0] || "RED_II" : "N/A",
        totalBalance: hasAssets ? summary?.total_balance_total || 0 : 0,
        lockedBalance: hasAssets ? summary?.total_balance_locked || 0 : 0,
        retiredBalance: hasAssets ? summary?.total_balance_retired || 0 : 0,
        co2eTotal: hasAssets ? summary?.CO2E_TOTAL || 0 : 0,
        hasAssets: hasAssets, // Add flag to indicate if organization has assets
      };

      return eacEntry;
    });
  }, [eacOrganizations]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const displayedEacData = transformedEacData.slice(0, displayCount);
  const hasMoreToLoad = displayCount < transformedEacData.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
      </div>
    );
  }

  if (transformedEacData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No EAC data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Available EACs (
          {transformedEacData.filter((eac) => eac.hasAssets).length} of{" "}
          {transformedEacData.length})
        </h3>
        <p className="text-sm text-muted-foreground">
          Total Balance:{" "}
          {transformedEacData
            .filter((eac) => eac.hasAssets)
            .reduce((sum, eac) => sum + eac.availableVolume, 0)
            .toLocaleString()}{" "}
          MMBtu
        </p>
      </div>

      <EacGrid eacData={displayedEacData} onPurchase={handlePurchase} />

      {hasMoreToLoad && (
        <Button variant="outline" className="w-full" onClick={handleLoadMore}>
          Load More
        </Button>
      )}

      <EacPurchaseDialog
        selectedEac={selectedEac}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        handleCloseDialog={handleCloseDialog}
      />
    </div>
  );
};

export default ActiveEacsTab;
