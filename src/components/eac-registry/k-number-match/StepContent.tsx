
import React from 'react';
import { Company } from '../CompanySelector';
import { MatchedEAC } from './types';
import { TransactionDetails } from './schema';
import { KNumberMatchFormValues } from './schema';
import KNumberMatchForm from './KNumberMatchForm';
import MatchedEacsDisplay from './MatchedEacsDisplay';
import TransactionInitiation from './TransactionInitiation';
import TransactionReviewStep from './TransactionReviewStep';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import NoEacsFound from './components/eac-display/NoEacsFound';
import { useEac } from '@/context/EacContext';
import EacGrid from '../active-eacs/EacGrid';
import { useEacPurchase } from '../active-eacs/hooks/useEacPurchase';
import EacPurchaseDialog from '../active-eacs/EacPurchaseDialog';

interface StepContentProps {
  currentStep: number;
  form: UseFormReturn<KNumberMatchFormValues>;
  isLoading: boolean;
  contractValidated: boolean | null;
  validationMessage: string;
  matchedEACs: MatchedEAC[];
  selectedCompany: Company | null;
  transactionDetails: TransactionDetails;
  isSubmitting: boolean;
  onSubmit: (data: KNumberMatchFormValues) => void;
  onInitiateTransaction: () => void;
  onConfirmTransaction: () => void;
  navigateToPaymentSettings: () => void;
}

const StepContent: React.FC<StepContentProps> = ({
  currentStep,
  form,
  isLoading,
  contractValidated,
  validationMessage,
  matchedEACs,
  selectedCompany,
  transactionDetails,
  isSubmitting,
  onSubmit,
  onInitiateTransaction,
  onConfirmTransaction,
  navigateToPaymentSettings,
}) => {
  // Get the selected pipeline from the form
  const selectedPipeline = form.watch("pipeline") as "REX" | "Ruby";
  
  // Use EAC context to get available EACs
  const { eacOrganizations, loading: eacLoading } = useEac();
  
  // Use EAC purchase hook
  const {
    dialogOpen,
    selectedEac,
    setDialogOpen,
    handleCloseDialog,
    handlePurchase,
  } = useEacPurchase();


  const handleFormSubmit = (data: KNumberMatchFormValues) => {
    console.log("StepContent - Form submitted with data:", data);
    onSubmit(data);
  };

  // Transform EAC data to match the expected format (same as ActiveEacsTab)
  const transformedEacData = React.useMemo(() => {
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
        hasAssets: hasAssets,
      };

      return eacEntry;
    });
  }, [eacOrganizations]);

  // Filter EACs based on search criteria if available
  const filteredEacData = React.useMemo(() => {
    if (matchedEACs && matchedEACs.length > 0) {
      // If we have matched EACs from search, use those
      return matchedEACs;
    }
    
    // Otherwise, show all available EACs
    return transformedEacData;
  }, [matchedEACs, transformedEacData]);

  if (currentStep === 1) {
    return (
      <div className="space-y-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              <KNumberMatchForm
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                contractValidated={contractValidated}
                validationMessage={validationMessage}
                form={form}
              />
              
              {/* Show EACs - either search results or all available */}
              <div className="border-t pt-6">
                {matchedEACs && matchedEACs.length > 0 ? (
                  // Show search results
                  <>
                    <h3 className="text-lg font-semibold mb-4">
                      Search Results - Matched EACs ({matchedEACs.length})
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      EACs matching your gas trace parameters
                    </p>
                    <div className="min-h-[500px]" data-testid="eac-results-container">
                      <div className="eacs-results-container overflow-auto" data-testid="eacs-results">
                        <MatchedEacsDisplay 
                          matchedEACs={matchedEACs || []} 
                          selectedPipeline={selectedPipeline} 
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  // Show all available EACs
                  <>
                    <h3 className="text-lg font-semibold mb-4">
                      Available EACs ({transformedEacData.filter((eac) => eac.hasAssets).length} of {transformedEacData.length})
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Total Balance: {transformedEacData
                        .filter((eac) => eac.hasAssets)
                        .reduce((sum, eac) => sum + eac.availableVolume, 0)
                        .toLocaleString()} MMBtu
                    </p>
                    <div className="min-h-[500px]" data-testid="eac-results-container">
                      {eacLoading ? (
                        <div className="flex items-center justify-center min-h-[200px]">
                          <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
                        </div>
                      ) : transformedEacData.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No EAC data available</p>
                        </div>
                      ) : (
                        <EacGrid eacData={transformedEacData} onPurchase={handlePurchase} />
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {isLoading && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Searching for EACs...</h3>
                  <div className="min-h-[500px]" data-testid="eac-results-container">
                    <NoEacsFound isLoading={true} />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {(matchedEACs?.length || 0) > 0 && selectedCompany && (
          <TransactionInitiation
            matchedEACs={matchedEACs}
            selectedCompany={selectedCompany}
            transactionType={transactionDetails.transactionType}
            onInitiateTransaction={onInitiateTransaction}
          />
        )}

        {/* EAC Purchase Dialog */}
        <EacPurchaseDialog
          selectedEac={selectedEac}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          handleCloseDialog={handleCloseDialog}
        />
      </div>
    );
  }

  if (currentStep === 2 && selectedCompany) {
    return (
      <TransactionReviewStep
        form={form}
        transactionDetails={transactionDetails}
        selectedCompany={selectedCompany}
        onPrevStep={() => window.history.back()}
        onConfirm={onConfirmTransaction}
        isSubmitting={isSubmitting}
        navigateToPaymentSettings={navigateToPaymentSettings}
      />
    );
  }

  return null;
};

export default StepContent;
