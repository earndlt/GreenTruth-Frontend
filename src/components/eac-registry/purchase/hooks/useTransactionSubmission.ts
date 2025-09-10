import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FormValues } from '../types';
import { createVendorFromEacProducer } from '@/components/vendors/utils/vendorManagement';
import { corporateWallets } from '@/data/corporateWallets';
import { transferTokens } from '@/services/transferService';
import { useOrganization } from '@/context/OrganizationContext';

export const useTransactionSubmission = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const { profiles } = useOrganization();
  
  const onSubmitTransaction = async (values: FormValues, eacData: any, entityName: string, onSuccess?: () => void) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting transaction to EarnDLT:', values);
      console.log('EAC Data:', eacData);
      
      // Validate EAC data
      if (!eacData) {
        throw new Error('EAC data is required');
      }
      
      if (!eacData.profileId) {
        throw new Error('EAC profile ID is required for transfer');
      }
      
      if (!eacData.profileWalletId) {
        throw new Error('EAC profile wallet ID is required for transfer');
      }
      
      if (!eacData.price) {
        throw new Error('EAC price is required for transfer');
      }
      
      // Validate quantity
      const tokenQuantity = parseFloat(values.quantity);
      if (isNaN(tokenQuantity) || tokenQuantity <= 0) {
        throw new Error('Valid token quantity is required for transfer');
      }
      
      // Check if requested quantity exceeds available volume
      if (eacData.availableVolume && tokenQuantity > eacData.availableVolume) {
        throw new Error(`Requested quantity (${tokenQuantity}) exceeds available volume (${eacData.availableVolume})`);
      }
      
      // Find the entity ID based on name
      const entityInfo = corporateWallets.find(wallet => wallet.name === entityName);
      const entityId = entityInfo?.id || values.companyId;
      
      // Validate entity name
      if (!entityName || entityName.trim() === '') {
        throw new Error('Entity name is required to process transaction');
      }

      // Get the buyer profile ID from OrganizationContext
      // Try to find the profile by matching the wallet address or name
      console.log("profiles: ", profiles);
      const buyerProfile = profiles && profiles.length > 0 ? profiles[0] : null;
      
      if (!buyerProfile) {
        console.error('Available profiles:', profiles);
        console.error('Entity name:', entityName);
        console.error('Entity info:', entityInfo);
        throw new Error('Buyer profile not found. Please ensure you have a valid organization profile.');
      }

      // Get the seller profile ID from the EAC data
      const sellerProfileId = eacData.profileId;
      if (!sellerProfileId) {
        throw new Error('Seller profile ID not found in EAC data');
      }

      // Prepare transfer request
      const transferRequest = {
        sellerProfileId: sellerProfileId,
        buyerProfileId: buyerProfile.id,
        sellerProfileWalletId: eacData.profileWalletId,
        tokenQuantity: tokenQuantity,
        price: parseFloat(eacData.price) || 0,
        unitMetric: "MMBtu"
      };

      console.log('Transfer request:', transferRequest);
      console.log('Transfer request details:', {
        sellerProfileId,
        buyerProfileId: buyerProfile.id,
        sellerProfileWalletId: eacData.profileWalletId,
        tokenQuantity,
        price: parseFloat(eacData.price) || 0,
        unitMetric: "MMBtu"
      });

      // Call the transfer API
      const transferResponse = await transferTokens(transferRequest);
      
      console.log('Transfer response:', transferResponse);

      if (!transferResponse.success) {
        throw new Error(transferResponse.message || 'Transfer failed');
      }
      
      // Create vendor record from EAC producer with entity name for proper ID generation
      const newVendor = createVendorFromEacProducer(eacData, entityName);
      
      // Set the company ID
      newVendor.companyId = entityId;
      
      // Store the vendor in your vendor directory
      console.log('Adding new vendor to directory:', newVendor);
      
      // Show success messages
      toast({
        title: "Transaction Initiated",
        description: `Your purchase has been submitted. Transaction ID: ${transferResponse.data.transactionId}`,
      });
      
      // toast({
      //   title: "Vendor Added",
      //   description: `${eacData.producer} has been added to your vendor directory.`,
      // });
      
      // Store transaction ID for success screen
      setTransactionId(transferResponse.data.transactionId);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return transferResponse.data.transactionId;
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "There was an error processing your transaction. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    transactionId,
    onSubmitTransaction
  };
};
