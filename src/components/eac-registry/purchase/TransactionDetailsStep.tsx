import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoIcon, Shield, CreditCard, AlertTriangle } from "lucide-react";
import { FormValues, EacData } from "./types";
import CompanySelector, { Company } from "../CompanySelector";
import TransactionHeader from "./transaction-details/TransactionHeader";
import TransactionTypeSelector from "./transaction-details/TransactionTypeSelector";
import ForwardPurchaseDetails from "./transaction-details/ForwardPurchaseDetails";
import QuantitySelector from "./transaction-details/QuantitySelector";
import SegmentSelector from "./transaction-details/SegmentSelector";
import OfftakePoint from "./transaction-details/OfftakePoint";
import PaymentMethodCard from "./transaction-details/PaymentMethodCard";
import { useForwardPurchaseCalculator } from "./hooks/useForwardPurchaseCalculator";
import { checkPurchaseRequirements } from "@/utils/purchaseUtils";
import { useAuth } from "@/context/AuthContext";

interface TransactionDetailsStepProps {
  form: UseFormReturn<FormValues>;
  eacData: EacData;
  selectedCompany: Company;
  onSelectCompany: (companyId: string) => void;
  transactionType: string;
  onNextStep: () => void;
  walletCompanies: Company[];
  showPaymentMethodForm: boolean;
  togglePaymentMethodForm: () => void;
  navigateToPaymentSettings: () => void;
  onPaymentMethodSelect?: (paymentMethodId: string) => void;
  selectedPaymentMethodId?: string;
}

const TransactionDetailsStep: React.FC<TransactionDetailsStepProps> = ({
  form,
  eacData,
  selectedCompany,
  onSelectCompany,
  transactionType,
  onNextStep,
  walletCompanies,
  showPaymentMethodForm,
  togglePaymentMethodForm,
  navigateToPaymentSettings,
  onPaymentMethodSelect,
  selectedPaymentMethodId,
}) => {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<{
    canPurchase: boolean;
    missingRequirements: string[];
  }>({ canPurchase: false, missingRequirements: [] });

  // Use the calculator hook for forward purchase calculations
  useForwardPurchaseCalculator(form, transactionType);

  // Check requirements on component mount and when dependencies change
  useEffect(() => {
    const checkRequirements = async () => {
      const result = await checkPurchaseRequirements(user);
      setRequirements(result);
    };
    
    checkRequirements();
  }, [user]);

  const handleCompleteRequirements = () => {
    // Determine which section to navigate to based on missing requirements
    if (requirements.missingRequirements.includes("Business verification (KYB)")) {
      window.location.href = "/settings?tab=admin#kyb";
    } else if (requirements.missingRequirements.includes("Payment method")) {
      window.location.href = "/settings?tab=admin#payment-methods";
    } else {
      window.location.href = "/settings?tab=admin";
    }
  };

  return (
    <div className="space-y-6">
      <TransactionHeader eacData={eacData} />

      {/* Requirements Check */}
      {!requirements.canPurchase && requirements.missingRequirements.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Purchase Requirements:</span>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {requirements.missingRequirements.map((requirement, index) => (
                <li key={index} className="flex items-center gap-2">
                  {requirement === "Business verification (KYB)" ? (
                    <Shield className="h-3 w-3" />
                  ) : (
                    <CreditCard className="h-3 w-3" />
                  )}
                  {requirement}
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompleteRequirements}
                className="text-amber-700 border-amber-300 hover:bg-amber-100"
              >
                Complete in Settings
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <CompanySelector
        companies={walletCompanies}
        selectedCompany={selectedCompany}
        onSelectCompany={onSelectCompany}
      />

      <TransactionTypeSelector form={form} />

      {transactionType === "forward" && <ForwardPurchaseDetails form={form} />}

      <QuantitySelector form={form} eacData={eacData} />

      <SegmentSelector form={form} />

      <OfftakePoint form={form} eacData={eacData} />

      <PaymentMethodCard
        selectedCompany={selectedCompany}
        showPaymentMethodForm={showPaymentMethodForm}
        togglePaymentMethodForm={togglePaymentMethodForm}
        navigateToPaymentSettings={navigateToPaymentSettings}
        onPaymentMethodSelect={onPaymentMethodSelect}
        selectedPaymentMethodId={selectedPaymentMethodId}
      />

      <div className="flex justify-end pt-4">
        <Button 
          type="button" 
          onClick={onNextStep}
          disabled={!requirements.canPurchase}
          className={!requirements.canPurchase ? "opacity-50 cursor-not-allowed" : ""}
        >
          Review Transaction
        </Button>
      </div>
    </div>
  );
};

export default TransactionDetailsStep;
