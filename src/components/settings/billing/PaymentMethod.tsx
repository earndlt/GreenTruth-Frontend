import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Building, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePaymentMethods } from "@/components/settings/admin/hooks/usePaymentMethods";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePlaidLink } from "@/hooks/usePlaidLink";
import {
  paymentMethodService,
  PaymentMethod as PaymentMethodType,
} from "@/services/paymentMethodService";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlaidLink from "./PlaidLink";
import { PlaidService } from "@/services/plaidService";
import { requireKybVerification } from "@/utils/kybUtils";

interface PaymentMethodProps {
  currentPlan: string;
  onCheckout: () => Promise<void>;
  isProcessing: boolean;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  currentPlan,
  onCheckout,
  isProcessing,
}) => {
  const [currentTab, setCurrentTab] = useState<"card" | "ach">("card");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodType[]>([]);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Stripe form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [billingAddress, setBillingAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  // Use the existing hooks for payment methods
  const {
    // Removed old Plaid hooks as we're using the new PlaidLink component
  } = usePaymentMethods();

  const handlePlaidSuccess = async (publicToken: string, metadata: any) => {
    try {
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // Check KYB verification before proceeding
      if (!requireKybVerification("connect bank account")) {
        return;
      }

      // Link bank account through backend
      const bankAccount = await PlaidService.linkBankAccount(
        publicToken,
        metadata.account.id,
        user.id,
        user.email,
        user.name || user.email
      );

      // Add the new bank account to the payment methods list
      const newPaymentMethod: PaymentMethodType = {
        _id: bankAccount._id,
        userId: bankAccount.userId,
        type: bankAccount.type,
        stripePaymentMethodId: bankAccount.stripePaymentMethodId,
        last4: bankAccount.accountLast4,
        bankName: bankAccount.bankName,
        accountType: bankAccount.accountType,
        isDefault: bankAccount.isDefault,
        isActive: bankAccount.isActive,
        createdAt: bankAccount.createdAt,
        updatedAt: bankAccount.updatedAt,
      };

      setPaymentMethods(prev => [...prev, newPaymentMethod]);

      toast.success("Bank account connected successfully!");
      setShowAddPaymentDialog(false);
      setShowPlaidModal(false);
    } catch (error: any) {
      console.error("Error linking bank account:", error);
      toast.error(error.message || "Failed to link bank account");
    }
  };

  const handlePlaidExit = () => {
    console.log("Plaid Link exited");
    setShowPlaidModal(false);
  };

  // Fetch payment methods from backend
  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const methods = await paymentMethodService.getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Failed to load payment methods");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    /* if (currentPlan !== "basic") {
      fetchPaymentMethods();
    } */
    fetchPaymentMethods();
  }, [currentPlan]);

  const handlePaymentMethodUpdate = () => {
    // Check KYB verification before showing payment dialog
    if (!requireKybVerification("add payment method")) {
      return;
    }
    setShowAddPaymentDialog(true);
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await paymentMethodService.deletePaymentMethod(paymentMethodId);
      toast.success("Payment method deleted successfully");
      fetchPaymentMethods(); // Refresh the list
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Failed to delete payment method");
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      await paymentMethodService.setDefaultPaymentMethod(paymentMethodId);
      toast.success("Default payment method updated");
      fetchPaymentMethods(); // Refresh the list
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast.error("Failed to update default payment method");
    }
  };

  // Removed handlePlaidLaunch as we're using the new PlaidLink component

  const handleCreditCardAdd = () => {
    // Check KYB verification before showing credit card modal
    if (!requireKybVerification("add credit card")) {
      return;
    }
    setShowStripeModal(true);
  };

  const handlePlaidOpen = () => {
    // Check KYB verification before opening Plaid modal
    if (!requireKybVerification("connect bank account")) {
      return;
    }
    setShowAddPaymentDialog(false);
    setShowPlaidModal(true);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvc(value);
  };

  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !expiryDate || !cvc || !cardholderName) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check KYB verification before submitting card
    if (!requireKybVerification("add credit card")) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Clean card number - we'll send just the card number
      // The backend will convert it to the appropriate Stripe test token
      const cardNumberClean = cardNumber.replace(/\s/g, "");

      await paymentMethodService.addPaymentMethod({
        type: "card",
        paymentToken: cardNumberClean,
        isDefault: paymentMethods.length === 0,
      });

      toast.success("Credit card added successfully!");
      setShowStripeModal(false);
      resetForm();
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error adding credit card:", error);
      toast.error("Failed to add credit card. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCardNumber("");
    setExpiryDate("");
    setCvc("");
    setCardholderName("");
    setBillingAddress({
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
    });
  };

  const closeStripeModal = () => {
    setShowStripeModal(false);
    resetForm();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Manage your payment methods for your subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* {currentPlan !== "basic" ? ( */}
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading payment methods...</span>
              </div>
            ) : paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method._id} className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <CreditCard className="mr-3 h-5 w-5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {method.type === "card"
                                ? `•••• •••• •••• ${method.last4 || "****"}`
                                : `${method.bankName || "Bank Account"}`}
                            </p>
                            {/* Note: Stripe doesn't have a default payment method concept */}
                            {/* You can implement this in your application logic if needed */}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.type === "card"
                              ? `Expires ${method.expMonth}/${method.expYear}`
                              : method.accountType || "Checking Account"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* Note: Stripe doesn't have a default payment method concept */}
                        {/* You can implement this in your application logic if needed */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeletePaymentMethod(method._id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handlePaymentMethodUpdate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Payment Method
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <Tabs
                  defaultValue="card"
                  onValueChange={(value) =>
                    setCurrentTab(value as "card" | "ach")
                  }
                >
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="card" className="flex-1">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit Card
                    </TabsTrigger>
                    <TabsTrigger value="ach" className="flex-1">
                      <Building className="h-4 w-4 mr-2" />
                      ACH / Bank Account
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Add a credit card to pay for your subscription.
                    </p>
                    <Button
                      className="w-full"
                      onClick={handleCreditCardAdd}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Add Credit Card
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="ach" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Connect your bank account securely via Plaid to pay
                      using ACH.
                    </p>
                    <Button
                      className="w-full"
                      onClick={handlePlaidOpen}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Building className="h-4 w-4 mr-2" />
                          Connect Your Bank Account
                        </>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </>
          {/* ) : (
          <p className="text-muted-foreground">
            No payment method required for the Basic plan.
          </p>
          )} */}
        </CardContent>
        {paymentMethods.length > 0 && currentPlan !== "basic" && (
          <CardFooter className="flex justify-between bg-muted/50 border-t">
            <p className="text-sm text-muted-foreground">
              Your payment method will be charged on the renewal date.
            </p>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Add Payment Method Dialog */}
      <Dialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you'd like to pay for your subscription.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="card" className="mt-4">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="card" className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Credit Card
              </TabsTrigger>
              <TabsTrigger value="ach" className="flex-1">
                <Building className="h-4 w-4 mr-2" />
                ACH / Bank Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Add a credit card for secure and simple payments.
              </p>
              <Button
                className="w-full"
                onClick={handleCreditCardAdd}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Continue to Secure Checkout
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="ach" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect your bank account via Plaid for lower processing fees.
                Your banking credentials are never stored on our servers.
              </p>
              <Button
                className="w-full"
                onClick={handlePlaidOpen}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Building className="h-4 w-4 mr-2" />
                    Connect Your Bank Account
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Stripe Credit Card Modal */}
      <Dialog open={showStripeModal} onOpenChange={closeStripeModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Add Credit Card
            </DialogTitle>
            <DialogDescription>
              Enter your credit card information securely. Your payment details
              are encrypted and secure.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitCard} className="space-y-6">
            {/* Card Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Card Information</h3>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  required
                  className="font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC *</Label>
                  <Input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={handleCvcChange}
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name *</Label>
                <Input
                  id="cardholderName"
                  type="text"
                  placeholder="John Doe"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Billing Address</h3>

              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  type="text"
                  placeholder="123 Main St"
                  value={billingAddress.line1}
                  onChange={(e) =>
                    setBillingAddress((prev) => ({
                      ...prev,
                      line1: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  type="text"
                  placeholder="Apt, suite, etc. (optional)"
                  value={billingAddress.line2}
                  onChange={(e) =>
                    setBillingAddress((prev) => ({
                      ...prev,
                      line2: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="New York"
                    value={billingAddress.city}
                    onChange={(e) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="NY"
                    value={billingAddress.state}
                    onChange={(e) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="10001"
                    value={billingAddress.postalCode}
                    onChange={(e) =>
                      setBillingAddress((prev) => ({
                        ...prev,
                        postalCode: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={billingAddress.country}
                    onValueChange={(value) =>
                      setBillingAddress((prev) => ({ ...prev, country: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeStripeModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Adding Card...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Card
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Plaid Link Modal - Rendered outside of other dialogs */}
      {showPlaidModal && (
        <PlaidLink
          setShowAddPaymentDialog={setShowPlaidModal}
          onSuccess={handlePlaidSuccess}
          onExit={handlePlaidExit}
        />
      )}
    </>
  );
};

export default PaymentMethod;
