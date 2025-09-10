
# GreenTruth Vendor ID Assignment Standard

This document outlines the technical implementation of vendor ID generation and management within the GreenTruth platform.

## Vendor ID Format

Vendor IDs in GreenTruth follow this format:
```
[EntityHash]-[VendorHash]
```

Example: `3EF69181-69B94DBD`

Where:
- `EntityHash` is the CRC32 hash of the corporate entity's name (uppercase, trimmed)
- `VendorHash` is the CRC32 hash of the vendor's name (uppercase, trimmed)

## Implementation Details

### CRC32 Hash Generation

We use the CRC32 algorithm for hashing, which provides a good balance between collision resistance and ID length. The implementation uses a lookup table approach and outputs the hash as an 8-character uppercase hexadecimal string.

```typescript
// Calculate CRC32 hash
const crc32 = (str: string) => {
  const crcTable = makeCRCTable();
  let crc = 0 ^ -1;

  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
  }

  return ((crc ^ -1) >>> 0).toString(16).toUpperCase().padStart(8, '0');
};
```

### Vendor ID Generation

The vendor ID generation function requires both the vendor name and entity name to ensure uniqueness:

```typescript
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
```

## ERP Integration Considerations

### Vendor ID Precedence

The GreenTruth platform supports two modes of vendor ID precedence when synchronizing with ERP systems:

1. **GreenTruth ID takes precedence** (default): The GreenTruth-generated vendor IDs will be pushed to the ERP system during synchronization.

2. **ERP ID takes precedence**: The ERP-assigned vendor IDs will be used within GreenTruth, overriding the platform's generated IDs.

### Implementation

The precedence setting is controlled via the `useErpVendorIds` boolean flag in the ERP integration configuration:

```typescript
// When true, ERP vendor IDs take precedence over GreenTruth-generated IDs
const [useErpVendorIds, setUseErpVendorIds] = useState(false);
```

### Sync Process Flow

When syncing vendor data between GreenTruth and an ERP system:

1. **If GreenTruth ID takes precedence** (`useErpVendorIds = false`):
   - GreenTruth generates vendor IDs using the `generateVendorId` function
   - These IDs are mapped to ERP vendor records during synchronization
   - The GreenTruth ID becomes the system of record

2. **If ERP ID takes precedence** (`useErpVendorIds = true`):
   - ERP vendor IDs are imported into GreenTruth
   - These imported IDs are used throughout the GreenTruth platform
   - The ERP ID becomes the system of record

## Best Practices

1. **Always require entity name**: When generating vendor IDs, always provide the correct entity name to ensure uniqueness.

2. **Normalize inputs**: Always normalize vendor and entity names before generating hashes to ensure consistency.

3. **Validate inputs**: Check that both vendor name and entity name are provided and non-empty.

4. **Default entity name**: In cases where the entity name is not available, use a consistent default entity name to maintain predictability.

## Troubleshooting

### Duplicate Vendor IDs

If duplicate vendor IDs occur, check for:
- Inconsistent entity name usage
- Different capitalizations or whitespace in vendor names
- Mismatched sync configurations between GreenTruth and ERP systems

### Migration Considerations

When migrating from previous vendor ID standards, consider:
- Creating a mapping table between old and new IDs
- Running a one-time update script to regenerate vendor IDs
- Testing thoroughly with your ERP sync configuration
