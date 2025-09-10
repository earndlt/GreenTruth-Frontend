import { API_ENDPOINTS } from '@/config/api';
import { apiClient } from './apiClient';

interface TransferRequest {
  sellerProfileId: string;
  buyerProfileId: string;
  sellerProfileWalletId: string;
  tokenQuantity: number;
  price?: number;
  unitMetric?: string;
}

interface TransferResponse {
  status: number;
  message: string;
  success: boolean;
  data: {
    transactionId: string;
    networkAccessId: string;
    transactionAction: any;
    sellerProfileId: string;
    buyerProfileId: string;
    sellerProfileWalletId: string;
    tokenQuantity: number;
    price: number;
    unitMetric: string;
  };
}

export const transferTokens = async (transferData: TransferRequest): Promise<TransferResponse> => {
  return apiClient.post<TransferResponse>(API_ENDPOINTS.TRANSFER.TRANSFER_TOKENS, transferData);
}; 