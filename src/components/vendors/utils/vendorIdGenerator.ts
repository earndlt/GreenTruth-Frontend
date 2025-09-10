
/**
 * Generates vendor IDs using CRC32 hash combination of corporate entity and vendor names
 * 
 * Vendor ID Format: [EntityHashCRC32]-[VendorHashCRC32]
 * Example: 3EF69181-69B94DBD
 */

// CRC32 table for hashing
const makeCRCTable = () => {
  let c;
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
};

// Calculate CRC32 hash
const crc32 = (str: string) => {
  const crcTable = makeCRCTable();
  let crc = 0 ^ -1;

  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
  }

  return ((crc ^ -1) >>> 0).toString(16).toUpperCase().padStart(8, '0');
};

/**
 * Generates a vendor ID based on corporate entity and vendor names using CRC32 hash
 * Format: [EntityHash]-[VendorHash] (e.g., 3EF69181-69B94DBD)
 * 
 * The first part is based on the entity's name, ensuring vendor IDs are unique across
 * multiple corporate entities even if vendor names are identical.
 * 
 * @param vendorName The full legal name of the vendor
 * @param entityName The name of the corporate entity adding the vendor
 * @returns A composite vendor ID string
 */
export const generateVendorId = (vendorName: string, entityName: string): string => {
  if (!vendorName || vendorName.trim() === '') {
    throw new Error('Vendor name is required to generate ID');
  }
  if (!entityName || entityName.trim() === '') {
    throw new Error('Entity name is required to generate ID');
  }
  
  // Normalize the names (remove extra spaces, convert to uppercase)
  const normalizedVendorName = vendorName.trim().toUpperCase();
  const normalizedEntityName = entityName.trim().toUpperCase();
  
  // Generate CRC32 hashes for both names
  const entityHash = crc32(normalizedEntityName);
  const vendorHash = crc32(normalizedVendorName);
  
  // Return combined ID
  return `${entityHash}-${vendorHash}`;
};
