import { toast } from "react-toastify";
import { apiClient } from "@/services/apiClient";

// Check KYB verification status via API (for components without AuthContext access)
export const isKybVerified = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get<{ data: { isKybVerified: boolean } }>("/api/kyb/kyb-status");
    return response.data.isKybVerified;
  } catch (error) {
    console.error("Error checking KYB verification status:", error);
    return false;
  }
};

// Check KYB verification status from user data (for components with AuthContext access)
export const isKybVerifiedFromUser = (user: { is_kyb_verified?: boolean } | null): boolean => {
  return user?.is_kyb_verified || false;
};

export const hasPaymentMethods = async (): Promise<boolean> => {
  try {
    // Import the payment method service
    const { paymentMethodService } = await import("@/services/paymentMethodService");
    const methods = await paymentMethodService.getPaymentMethods();
    return methods.length > 0;
  } catch (error) {
    console.error("Error checking payment methods:", error);
    return false;
  }
};

// Check purchase requirements using user data from AuthContext
export const checkPurchaseRequirements = async (user: { is_kyb_verified?: boolean } | null): Promise<{
  canPurchase: boolean;
  missingRequirements: string[];
}> => {
  const missingRequirements: string[] = [];
  
  // Check KYB verification using user data
  if (!isKybVerifiedFromUser(user)) {
    missingRequirements.push("Business verification (KYB)");
  }
  
  // Check payment methods
  const hasPaymentMethodsResult = await hasPaymentMethods();
  if (!hasPaymentMethodsResult) {
    missingRequirements.push("Payment method");
  }
  
  const canPurchase = missingRequirements.length === 0;
  
  return {
    canPurchase,
    missingRequirements
  };
};

export const showPurchaseRequirementsError = (missingRequirements: string[]): void => {
  const requirementsList = missingRequirements.join(" and ");
  toast.error(
    `Purchase not available. Please complete ${requirementsList} in Settings → Admin.`,
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  );
}; 