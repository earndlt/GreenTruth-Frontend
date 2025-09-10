import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CreditCard,
  InfoIcon,
  Edit,
  Landmark,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Company } from "../../CompanySelector";
import {
  paymentMethodService,
  PaymentMethod as PaymentMethodType,
} from "@/services/paymentMethodService";
import { toast } from "sonner";

interface PaymentMethodCardProps {
  selectedCompany: Company;
  showPaymentMethodForm: boolean;
  togglePaymentMethodForm: () => void;
  navigateToPaymentSettings: () => void;
  onPaymentMethodSelect?: (paymentMethodId: string) => void;
  selectedPaymentMethodId?: string;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  selectedCompany,
  showPaymentMethodForm,
  togglePaymentMethodForm,
  navigateToPaymentSettings,
  onPaymentMethodSelect,
  selectedPaymentMethodId,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>(
    selectedPaymentMethodId || ""
  );

  // Fetch payment methods from Stripe
  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const methods = await paymentMethodService.getPaymentMethods();
      setPaymentMethods(methods);

      // Auto-select the first payment method if none is selected
      if (methods.length > 0 && !selectedMethod) {
        const firstMethod = methods[0];
        setSelectedMethod(firstMethod._id);
        onPaymentMethodSelect?.(firstMethod._id);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Failed to load payment methods");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (selectedPaymentMethodId) {
      setSelectedMethod(selectedPaymentMethodId);
    }
  }, [selectedPaymentMethodId]);

  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    setSelectedMethod(paymentMethodId);
    onPaymentMethodSelect?.(paymentMethodId);
  };

  const handleAddPaymentMethod = () => {
    navigateToPaymentSettings();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Select a payment method for your EAC purchase
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleAddPaymentMethod}
          >
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading payment methods...</span>
          </div>
        ) : paymentMethods.length > 0 ? (
          <div className="space-y-4">
            <RadioGroup
              value={selectedMethod}
              onValueChange={handlePaymentMethodSelect}
            >
              {paymentMethods.map((method) => (
                <div key={method._id} className="flex items-center space-x-3">
                  <RadioGroupItem value={method._id} id={method._id} />
                  <Label
                    htmlFor={method._id}
                    className="flex items-center cursor-pointer"
                  >
                    <div className="flex items-center">
                      {method.type === "card" ? (
                        <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                      ) : (
                        <Landmark className="h-5 w-5 mr-3 text-gray-600" />
                      )}
                      <div>
                        {method.type === "card" ? (
                          <p className="text-sm font-medium">
                            {method.brand?.toUpperCase()} •••• {method.last4}
                            {method.isDefault && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </p>
                        ) : (
                          <p className="text-sm font-medium">
                            {method.bankName} •••• {method.accountType}
                            {method.isDefault && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </p>
                        )}
                        {method.type === "card" && (
                          <p className="text-xs text-gray-500">
                            Expires {method.expMonth}/{method.expYear}
                          </p>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <Alert className="bg-red-50 border-red-200">
            <InfoIcon className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              No payment methods found. Please add a payment method to continue
              with your purchase.
            </AlertDescription>
          </Alert>
        )}

        {paymentMethods.length === 0 && (
          <div className="mt-4">
            <Button
              onClick={handleAddPaymentMethod}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
