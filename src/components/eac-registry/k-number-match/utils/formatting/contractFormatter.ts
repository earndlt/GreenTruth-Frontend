
/**
 * Normalizes a contract ID by ensuring it has the K# prefix
 * 
 * @param contractId The contract ID to normalize
 * @returns The normalized contract ID with K# prefix
 */
export const normalizeContractId = (contractId: string): string => {
  return contractId.toLowerCase().startsWith('k#') ? contractId : `K#${contractId}`;
};

/**
 * Removes the K# prefix from a contract ID if present
 * 
 * @param contractId The contract ID to clean
 * @returns The contract ID without the K# prefix
 */
export const cleanContractId = (contractId: string): string => {
  return contractId.replace(/^k#/i, '');
};

/**
 * Formats contract IDs for upstream/downstream references
 * 
 * @param normalizedContractId The normalized contract ID with K# prefix
 * @param type The contract reference type (upstream/downstream)
 * @param receiptLocationId Optional receipt location ID for upstream contracts
 * @returns Formatted contract ID reference
 */
export const formatReferenceContractId = (
  normalizedContractId: string, 
  type: 'upstream' | 'downstream',
  pipeline?: "REX" | "Ruby",
  receiptLocationId?: string
): string => {
  const suffix = type === 'upstream' 
    ? `-UP${pipeline === "REX" && receiptLocationId ? `-RL${receiptLocationId}` : ""}`
    : '-DOWN';
    
  return `${normalizedContractId}${suffix}`;
};
