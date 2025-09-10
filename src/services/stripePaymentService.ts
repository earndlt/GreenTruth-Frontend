import { API_ENDPOINTS } from "@/config/api";
import { apiClient } from "./apiClient";

export interface PaymentIntentRequest {
  amount: number; // Amount in cents
  currency: string;
  paymentMethodId: string;
  description: string;
  metadata?: {
    eacId?: string;
    transactionType?: string;
    quantity?: string;
    companyId?: string;
  };
}

export interface PaymentIntentResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
  payment_method: string;
}

class StripePaymentService {
  async createPaymentIntent(
    paymentData: PaymentIntentRequest
  ): Promise<PaymentIntentResponse> {
    try {
      const response = await apiClient.post<{ data: PaymentIntentResponse }>(
        "/api/payments/create-payment-intent",
        paymentData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  }

  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<any> {
    try {
      const response = await apiClient.post<{ data: any }>(
        "/api/payments/confirm-payment",
        {
          paymentIntentId,
          paymentMethodId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw error;
    }
  }

  async processEacPurchase(
    amount: number,
    paymentMethodId: string,
    eacData: any,
    transactionData: any
  ): Promise<any> {
    try {
      // Create payment intent
      const paymentIntent = await this.createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        paymentMethodId,
        description: `EAC Purchase - ${eacData.producer} - ${transactionData.quantity} units`,
        metadata: {
          eacId: eacData.id,
          transactionType: transactionData.transactionType,
          quantity: transactionData.quantity,
          companyId: transactionData.companyId,
        },
      });

      // Confirm the payment
      const confirmedPayment = await this.confirmPayment(
        paymentIntent.id,
        paymentMethodId
      );

      return {
        paymentIntent,
        confirmedPayment,
        success: true,
      };
    } catch (error) {
      console.error("Error processing EAC purchase:", error);
      throw error;
    }
  }
}

export const stripePaymentService = new StripePaymentService();
