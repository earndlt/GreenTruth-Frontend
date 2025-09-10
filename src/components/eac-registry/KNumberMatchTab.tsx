import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { corporateWallets } from "@/data/corporateWallets";
import CompanySelector, { Company } from "./CompanySelector";
import StepContent from "./k-number-match/StepContent";
import {
  kNumberMatchFormSchema,
  KNumberMatchFormValues,
} from "./k-number-match/schema";
import { useKNumberMatch } from "./k-number-match/hooks/useKNumberMatch";
import { Card } from "@/components/ui/card";
import { useOrganization } from "@/context/OrganizationContext";

const KNumberMatchTab = () => {
  const navigate = useNavigate();

  // Initialize the form with schema validation
  const form = useForm<KNumberMatchFormValues>({
    resolver: zodResolver(kNumberMatchFormSchema),
    defaultValues: {
      contractId: "",
      pipeline: "REX",
      receiptLocationId: "",
      orderType: "spot",
      emissionPoints: [],
      dataElements: {
        qetCompatible: false,
        cetCompatible: false,
        carbonNeutral: false,
        waterUsage: false,
        landUsage: false,
        airImpact: false,
        communityImpact: false,
      },
      counterparties: [],
    },
  });

  // Use the k-number match hook with the form
  const {
    isLoading,
    contractValidated,
    matchedEACs,
    validationMessage,
    currentStep,
    isSubmitting,
    transactionDetails,
    handleSubmit,
    handleSelectCompany,
    handleInitiateTransaction,
    handleConfirmTransaction,
  } = useKNumberMatch();

  const handleFormSubmit = (data: KNumberMatchFormValues) => {
    console.log("KNumberMatchTab - Form submitted with data:", data);
    handleSubmit(data);
  };

  const navigateToPaymentSettings = () => {
    navigate("/settings", {
      state: {
        activeTab: "admin",
        section: "transaction-payments",
      },
    });
  };

  const { wallets } = useOrganization();

  const companies: Company[] = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    walletId: wallet.address,
    logo: wallet.partnerProfile?.logo || null,
    division: wallet.profile.name || undefined,
    type: wallet.type,
    status: wallet.status,
    createdAt: wallet.createdAt,
  }));

  return (
    <div className="space-y-6 pb-8">
      <Card className="p-4 bg-white shadow-sm">
        <CompanySelector
          companies={companies}
          selectedCompany={companies[companies.length - 1]}
          onSelectCompany={handleSelectCompany}
        />
      </Card>

      <StepContent
        currentStep={currentStep}
        form={form}
        isLoading={isLoading}
        contractValidated={contractValidated}
        validationMessage={validationMessage}
        matchedEACs={matchedEACs}
        selectedCompany={companies[companies.length - 1]}
        transactionDetails={transactionDetails}
        isSubmitting={isSubmitting}
        onSubmit={handleFormSubmit}
        onInitiateTransaction={handleInitiateTransaction}
        onConfirmTransaction={handleConfirmTransaction}
        navigateToPaymentSettings={navigateToPaymentSettings}
      />
    </div>
  );
};

export default KNumberMatchTab;
