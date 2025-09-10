import { API_ENDPOINTS } from "@/config/api";
import { apiClient } from "./apiClient";

export interface PaymentMethod {
  _id: string;
  userId: string;
  type: "card" | "ach";
  stripePaymentMethodId?: string;
  plaidAccountId?: string;
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  bankName?: string;
  accountType?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddPaymentMethodRequest {
  type: "card" | "ach";
  paymentToken: string;
  isDefault?: boolean;
}

class PaymentMethodService {

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await apiClient.get<{ data: PaymentMethod[] }>(
        API_ENDPOINTS.PAYMENT_METHODS.GET_PAYMENT_METHODS
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw error;
    }
  }

  async addPaymentMethod(
    paymentData: AddPaymentMethodRequest
  ): Promise<PaymentMethod> {
    try {
      const response = await apiClient.post<{ data: PaymentMethod }>(
        API_ENDPOINTS.PAYMENT_METHODS.ADD_PAYMENT_METHOD,
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding payment method:", error);
      throw error;
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await apiClient.delete(
        `${API_ENDPOINTS.PAYMENT_METHODS.DELETE_PAYMENT_METHOD}/${paymentMethodId}`
      );
    } catch (error) {
      console.error("Error deleting payment method:", error);
      throw error;
    }
  }

  async setDefaultPaymentMethod(
    paymentMethodId: string
  ): Promise<PaymentMethod> {
    try {
      const response = await apiClient.put<{ data: PaymentMethod }>(
        `${API_ENDPOINTS.PAYMENT_METHODS.SET_DEFAULT_PAYMENT_METHOD}/${paymentMethodId}/default`
      );
      return response.data;
    } catch (error) {
      console.error("Error setting default payment method:", error);
      throw error;
    }
  }
}

export const paymentMethodService = new PaymentMethodService();
