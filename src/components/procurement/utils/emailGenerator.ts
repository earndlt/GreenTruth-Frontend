
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique RFP response email address for vendors to send their responses
 */
export const generateRfpResponseEmail = (rfpId: string): string => {
  // Generate a unique code (first 8 characters of a UUID)
  const uniqueCode = uuidv4().split('-')[0];
  
  // Create the email address
  return `rfp-${uniqueCode}@rfp.greentruth.com`;
};

/**
 * Generates a unique RFI response email address for vendors to send their responses
 */
export const generateRfiResponseEmail = (rfiId: string): string => {
  // Generate a unique code (first 8 characters of a UUID)
  const uniqueCode = uuidv4().split('-')[0];
  
  // Create the email address
  return `rfi-${uniqueCode}@rfi.greentruth.com`;
};
