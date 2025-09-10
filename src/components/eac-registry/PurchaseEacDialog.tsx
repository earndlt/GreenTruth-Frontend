import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { corporateWallets } from "@/data/corporateWallets";
import {
  EacData,
  FormValues,
  formSchema,
  getWalletCompanies,
} from "./purchase/types";
import TransactionDetailsStep from "./purchase/TransactionDetailsStep";
import ReviewTransactionStep from "./purchase/ReviewTransactionStep";
import TransactionSuccessStep from "./purchase/TransactionSuccessStep";
import { useNavigate } from "react-router-dom";
import { usePurchaseState } from "./purchase/hooks/usePurchaseState";
import { useFormValidation } from "./purchase/utils/formValidation";
import CompanySelector, { Company } from "./CompanySelector";
import { useOrganization } from "@/context/OrganizationContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { checkPurchaseRequirements, showPurchaseRequirementsError } from "@/utils/purchaseUtils";

interface PurchaseEacDialogProps {
  eacData: EacData;
  onClose: () => void;
}

const walletCompanies = getWalletCompanies(corporateWallets);

const PurchaseEacDialog: React.FC<PurchaseEacDialogProps> = ({
  eacData,
  onClose,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { validateTransactionDetailsStep } = useFormValidation();

  const {
    step,
    isSubmitting,
    transactionId,
    selectedCompany,
    showPaymentMethodForm,
    handleSelectCompany,
    togglePaymentMethodForm,
    navigateToPaymentSettings,
    navigateToDashboard,
    onSubmitTransaction,
    nextStep,
    prevStep,
  } = usePurchaseState(onClose, navigate);

  // Payment method selection state
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<string>("");

  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    setSelectedPaymentMethodId(paymentMethodId);
  };

  const handlePaymentSuccess = (paymentResult: unknown) => {
    // Handle successful payment - you can add additional logic here
    console.log("Payment successful:", paymentResult);
    // You might want to proceed to the next step or show success message
  };

  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionType: "spot",
      quantity: "",
      segment: ["transportation"], // Changed from string to array with default value
      offtakePoint: eacData.deliveryPoint.name,
      startDate: today.toISOString().split("T")[0],
      endDate: nextMonth.toISOString().split("T")[0],
      deliveryFrequency: "monthly",
      dailyVolume: "",
      companyId: walletCompanies[0].id,
    },
  });

  const transactionType = form.watch("transactionType");

  const onSelectCompany = (companyId: string) => {
    const company = handleSelectCompany(companyId);
    if (company) {
      form.setValue("companyId", companyId);
    }
  };

  const handleNextStep = async () => {
    // Check purchase requirements before proceeding using user data from AuthContext
    const { canPurchase, missingRequirements } = await checkPurchaseRequirements(user);
    
    if (!canPurchase) {
      showPurchaseRequirementsError(missingRequirements);
      return;
    }

    const currentValues = form.getValues();

    // Validate current step before proceeding
    if (step === 1) {
      if (!validateTransactionDetailsStep(currentValues)) {
        return;
      }
    }

    nextStep();
  };

  const onSubmit = async (values: FormValues) => {
    // Check purchase requirements before submitting transaction using user data from AuthContext
    const { canPurchase, missingRequirements } = await checkPurchaseRequirements(user);
    
    if (!canPurchase) {
      showPurchaseRequirementsError(missingRequirements);
      return;
    }

    // Pass the selected company name as the entity name
    const success = await onSubmitTransaction(
      values,
      eacData,
      selectedCompany.name
    );
    if (success) {
      nextStep();

      const timeout = setTimeout(() => {
        toast.success("Seller accepted the transaction automatically");
      }, 10000); // 10 seconds

      return () => clearTimeout(timeout);
      // Transaction succeeded and we've moved to success step
    }
  };

  const [selectedWallet, setSelectedWallet] = useState<Company | null>(null);

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

  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) {
      const lastWallet = wallets[wallets.length - 1];
      setSelectedWallet({
        id: lastWallet.id,
        name: lastWallet.name,
        walletId: lastWallet.address,
        logo: lastWallet.partnerProfile?.logo || null,
        division: lastWallet.profile.name,
        type: lastWallet.type,
        status: lastWallet.status,
        createdAt: lastWallet.createdAt,
      });
    }
  }, [wallets]);

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Purchase Environmental Attribute Certificates</DialogTitle>
        <DialogDescription>
          Configure your EAC purchase from {eacData.producer} for{" "}
          {eacData.deliveryPoint.name}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 flex-1 overflow-hidden"
        >
          {step === 1 && (
            <ScrollArea className="h-[60vh] pr-4">
              <TransactionDetailsStep
                form={form}
                eacData={eacData}
                selectedCompany={selectedWallet}
                onSelectCompany={onSelectCompany}
                transactionType={transactionType}
                onNextStep={handleNextStep}
                walletCompanies={companies}
                showPaymentMethodForm={showPaymentMethodForm}
                togglePaymentMethodForm={togglePaymentMethodForm}
                navigateToPaymentSettings={navigateToPaymentSettings}
                onPaymentMethodSelect={handlePaymentMethodSelect}
                selectedPaymentMethodId={selectedPaymentMethodId}
              />
            </ScrollArea>
          )}

          {step === 2 && (
            <ReviewTransactionStep
              form={form}
              eacData={eacData}
              selectedCompany={selectedWallet}
              isSubmitting={isSubmitting}
              onPrevStep={prevStep}
              navigateToPaymentSettings={navigateToPaymentSettings}
              selectedPaymentMethodId={selectedPaymentMethodId}
              onPaymentSuccess={handlePaymentSuccess}
              onClose={onClose}
            />
          )}

          {step === 3 && transactionId && (
            <TransactionSuccessStep
              transactionId={transactionId}
              transactionType={transactionType}
              navigateToDashboard={navigateToDashboard}
            />
          )}
        </form>
      </Form>
    </DialogContent>
  );
};

export default PurchaseEacDialog;
