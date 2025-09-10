import { useState } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { KYBVerificationRequest, KYBVerificationResponse, KYBVerificationRecord, KYBVerificationStats } from '@/types/kyb';
import { apiClient } from '@/services/apiClient';

export const useKybStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Submit KYB verification with DUNS number and company name
  const submitVerification = async (data: KYBVerificationRequest): Promise<KYBVerificationResponse | null> => {
    setIsLoading(true);
    setMessage('Submitting verification request...');
    
    try {
      const result: KYBVerificationResponse = await apiClient.post(API_ENDPOINTS.KYB.VERIFY, data);
      setMessage('Verification submitted successfully!');
      return result;
    } catch (error: any) {
      console.error('KYB verification error:', error);
      setMessage(error.message || 'Verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check verification status
  const checkStatus = async (verificationId: string): Promise<KYBVerificationRecord | null> => {
    setIsLoading(true);
    setMessage('Checking verification status...');
    
    try {
      const result = await apiClient.get<{ data: KYBVerificationRecord }>(`${API_ENDPOINTS.KYB.CHECK_STATUS}/${verificationId}`);
      setMessage('Status retrieved successfully');
      return result.data;
    } catch (error: any) {
      console.error('Status check error:', error);
      setMessage(error.message || 'Failed to check status');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get verification history
  const getVerificationHistory = async (): Promise<KYBVerificationRecord[]> => {
    try {
      const result = await apiClient.get<{ data: KYBVerificationRecord[] }>(API_ENDPOINTS.KYB.HISTORY);
      return result.data || [];
    } catch (error: any) {
      console.error('Error fetching verification history:', error);
      setMessage(error.message || 'Failed to fetch verification history');
      return [];
    }
  };

  // Get verification statistics
  const getVerificationStats = async (): Promise<KYBVerificationStats | null> => {
    try {
      const result = await apiClient.get<{ data: KYBVerificationStats }>(API_ENDPOINTS.KYB.STATS);
      return result.data || null;
    } catch (error: any) {
      console.error('Error fetching verification stats:', error);
      setMessage(error.message || 'Failed to fetch verification stats');
      return null;
    }
  };

  return {
    isLoading,
    message,
    submitVerification,
    checkStatus,
    getVerificationHistory,
    getVerificationStats,
  };
}; 