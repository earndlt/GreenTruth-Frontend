
import { generateVendorId } from './vendorIdGenerator';
import { EacData } from '@/components/eac-registry/purchase/types';
import { Vendor } from '../types/vendorTypes';

/**
 * Creates a vendor record from an EAC producer
 * 
 * @param eacData The EAC data containing producer information
 * @param entityName The name of the corporate entity creating the vendor relationship
 * @returns A new vendor object with proper ID
 */
export const createVendorFromEacProducer = (eacData: EacData, entityName: string): Vendor => {
  if (!entityName || entityName.trim() === '') {
    throw new Error('Entity name is required to create a vendor');
  }

  return {
    id: generateVendorId(eacData.producer, entityName),
    name: eacData.producer,
    category: 'Energy Producer',
    location: eacData.deliveryPoint.state,
    complianceScore: 100, // Default score for verified producers
    status: 'active',
    lastTransaction: new Date().toISOString(),
    companyId: '', // This should be set by the caller based on the entity ID
  };
};

/**
 * Helper to explain the vendor ID format
 * @returns Explanation of vendor ID structure
 */
export const getVendorIdExplanation = (): string => {
  return "Vendor IDs consist of two CRC32 hashes: [Entity Hash]-[Vendor Hash]";
};
