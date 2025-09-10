import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Company } from "../CompanySelector";
import { FormValues, EacData } from "./types";
import { DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { calculateDeliveryDates } from "./utils/deliveryDateUtils";
import {
  calculateTotalPrice,
  calculatePricePerDelivery,
} from "./utils/priceUtils";
import TransactionInfoSection from "./review/TransactionInfoSection";
import CompanySection from "./review/CompanySection";
import PaymentMethodSection from "./review/PaymentMethodSection";
import SourceInfoSection from "./review/SourceInfoSection";
import TransactionAlerts from "./review/TransactionAlerts";
import {
  paymentMethodService,
  PaymentMethod as PaymentMethodType,
} from "@/services/paymentMethodService";
import { stripePaymentService } from "@/services/stripePaymentService";
import { toast } from "react-toastify";
import { RefreshCw, CreditCard, Landmark } from "lucide-react";

interface ReviewTransactionStepProps {
  form: UseFormReturn<FormValues>;
  eacData: EacData;
  selectedCompany: Company;
  isSubmitting: boolean;
  onPrevStep: () => void;
  navigateToPaymentSettings: () => void;
  selectedPaymentMethodId?: string;
  onPaymentSuccess?: (paymentResult: any) => void;
  onClose: () => void;
}

const ReviewTransactionStep: React.FC<ReviewTransactionStepProps> = ({
  form,
  eacData,
  selectedCompany,
  isSubmitting,
  onPrevStep,
  navigateToPaymentSettings,
  selectedPaymentMethodId,
  onPaymentSuccess,
  onClose,
}) => {
  const formValues = form.getValues();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodType | null>(null);

  // Determine the commodity type based on certType
  const commodity =
    eacData.certType === "Methanol" ? "Methanol" : "Natural Gas";

  // Fetch selected payment method details
  React.useEffect(() => {
    const fetchPaymentMethod = async () => {
      if (selectedPaymentMethodId) {
        try {
          const paymentMethods = await paymentMethodService.getPaymentMethods();
          const method = paymentMethods.find(
            (pm) => pm._id === selectedPaymentMethodId
          );
          setSelectedPaymentMethod(method || null);
        } catch (error) {
          console.error("Error fetching payment method:", error);
        }
      }
    };

    fetchPaymentMethod();
  }, [selectedPaymentMethodId]);

  const deliveryDates = calculateDeliveryDates(
    formValues.transactionType,
    formValues.startDate,
    formValues.endDate,
    "monthly" // Force monthly frequency
  );

  const totalPrice = calculateTotalPrice(formValues.quantity, eacData.price);
  const pricePerDelivery = calculatePricePerDelivery(
    totalPrice,
    deliveryDates,
    formValues.transactionType
  );

  const handlePaymentProcessing = async () => {
    if (!selectedPaymentMethodId || !selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Process payment through Stripe
      const paymentResult = await stripePaymentService.processEacPurchase(
        totalPrice,
        selectedPaymentMethodId,
        eacData,
        formValues
      );
      toast.success("Payment processed successfully!");
      onClose();
      onPaymentSuccess?.(paymentResult);
    } catch (error: any) {
      console.error("Payment processing error:", error);
      toast.error(
        error.message || "Payment processing failed. Please try again."
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Create payment method display object
  const primaryPaymentMethod = selectedPaymentMethod
    ? {
      type: selectedPaymentMethod.type === "card" ? "credit-card" : "ach",
      last4: selectedPaymentMethod.last4 || "****",
      expiry:
        selectedPaymentMethod.type === "card"
          ? `${selectedPaymentMethod.expMonth}/${selectedPaymentMethod.expYear}`
          : undefined,
      bankName: selectedPaymentMethod.bankName,
      accountLast4: selectedPaymentMethod.accountType,
      brand: selectedPaymentMethod.brand,
    }
    : {
      type: "credit-card",
      last4: "****",
      expiry: undefined,
      bankName: undefined,
      accountLast4: undefined,
      brand: undefined,
    };

  return (
    <>
      <div className="bg-amber-50 p-3 rounded-md mb-4">
        <h3 className="font-medium text-amber-800">Review Transaction</h3>
        <p className="text-sm text-amber-700 mt-1">
          Please review your transaction details before submitting to EarnDLT
        </p>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          <TransactionInfoSection
            formValues={formValues}
            eacPrice={eacData.price}
            deliveryDates={deliveryDates}
            totalPrice={totalPrice}
            pricePerDelivery={pricePerDelivery}
            commodity={commodity}
          />

          <CompanySection selectedCompany={selectedCompany} />

          <PaymentMethodSection
            primaryPaymentMethod={primaryPaymentMethod}
            navigateToPaymentSettings={navigateToPaymentSettings}
          />

          <SourceInfoSection />

          <TransactionAlerts
            transactionType={formValues.transactionType}
            paymentMethodType={primaryPaymentMethod?.type || "credit-card"}
            pricePerDelivery={pricePerDelivery}
          />

          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-gray-500 mb-3">
              By confirming, you authorize EarnDLT to process this transaction
              and deliver the specified EACs to your corporate wallet.
              {formValues.transactionType === "forward" &&
                " You also authorize scheduled payments to be collected upon each monthly token delivery."}
            </p>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter className="flex justify-between sm:justify-between gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          Previous Step
        </Button>
        <Button
          /* type="button" */
          disabled={
            isSubmitting || isProcessingPayment || !selectedPaymentMethodId
          }
          type='submit'
        /* onClick={handlePaymentProcessing} */
        >
          {isProcessingPayment ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : isSubmitting ? (
            "Processing..."
          ) : (
            "Process Payment & Confirm Transaction"
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default ReviewTransactionStep;
