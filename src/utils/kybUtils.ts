import { toast } from "react-toastify";

export const isKybVerified = (): boolean => {
  return localStorage.getItem("kyb_verified") === "true";
};

export const requireKybVerification = (action: string): boolean => {
  if (!isKybVerified()) {
    toast.error(
      `Business verification required. Please complete KYB verification in Settings to ${action}.`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
    return false;
  }
  return true;
};

export const getKybVerificationMessage = (): string => {
  return "Business verification (KYB) is required to enable payment methods and transactions. Please complete verification in Settings.";
}; 