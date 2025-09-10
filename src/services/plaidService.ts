import API_URL from '@/config/api';

export interface PlaidLinkTokenResponse {
  success: boolean;
  data: {
    linkToken: string;
  };
  message: string;
}

export interface PlaidBankAccountResponse {
  success: boolean;
  data: {
    _id: string;
    userId: string;
    type: 'ach';
    stripePaymentMethodId: string;
    bankName: string;
    accountType: string;
    accountLast4: string;
    institutionId: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export class PlaidService {
  /**
   * Create a link token for Plaid Link initialization
   */
  static async createLinkToken(userId: string, userName: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/plaid/create-link-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName,
        }),
      });

      const data: PlaidLinkTokenResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create link token');
      }

      return data.data.linkToken;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw error;
    }
  }

  /**
   * Link a bank account using Plaid
   */
  static async linkBankAccount(
    publicToken: string,
    accountId: string,
    userId: string,
    userEmail: string,
    userName: string
  ): Promise<PlaidBankAccountResponse['data']> {
    try {
      const response = await fetch(`${API_URL}/plaid/link-bank-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicToken,
          accountId,
          userId,
          userEmail,
          userName,
        }),
      });

      const data: PlaidBankAccountResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to link bank account');
      }

      return data.data;
    } catch (error) {
      console.error('Error linking bank account:', error);
      throw error;
    }
  }

  /**
   * Get accounts using access token
   */
  static async getAccounts(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/plaid/accounts?accessToken=${accessToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to get accounts');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  }
} 