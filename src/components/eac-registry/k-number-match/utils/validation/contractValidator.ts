
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validates a contract ID format based on the selected pipeline
 * 
 * @param contractId The contract ID to validate
 * @param pipeline The pipeline type (REX or Ruby)
 * @returns Validation result with status and message
 */
export const validateContractId = (contractId: string, pipeline: "REX" | "Ruby"): ValidationResult => {
  console.log("Validating contract ID:", contractId, "for pipeline:", pipeline);
  
  if (!contractId || contractId.trim() === "") {
    return {
      isValid: false,
      message: "Contract ID is required"
    };
  }

  // For REX pipeline
  if (pipeline === "REX") {
    // Allow with or without K# prefix, minimum 5 digits, maximum 7 digits
    const rexPattern = /^(k#)?[0-9]{5,7}$/i;
    const isValid = rexPattern.test(contractId.trim());
    
    console.log("REX validation result:", isValid, "using pattern:", rexPattern);
    
    if (isValid) {
      return {
        isValid: true,
        message: "Valid REX contract ID"
      };
    } else {
      return {
        isValid: false,
        message: "Invalid REX contract ID format. Expected format: K#12345 or 12345"
      };
    }
  }
  
  // For Ruby pipeline
  if (pipeline === "Ruby") {
    // Less strict Ruby pattern - allows with or without K# prefix
    // Requires 2 letters followed by 4-6 digits
    const rubyPattern = /^(k#)?[a-z]{2}[0-9]{4,6}$/i;
    
    // Remove K# prefix if present for validation
    const normalizedContractId = contractId.toLowerCase().replace(/^k#/i, '');
    
    // Test the normalized contract ID against the pattern
    const isValid = rubyPattern.test(normalizedContractId);
    
    console.log("Ruby validation result:", isValid, "using pattern:", rubyPattern);
    
    if (isValid) {
      return {
        isValid: true,
        message: "Valid Ruby contract ID"
      };
    } else {
      return {
        isValid: false,
        message: "Invalid Ruby contract ID format. Expected format: K#AB1234 or AB1234"
      };
    }
  }

  return {
    isValid: false,
    message: "Please select a pipeline and enter a valid contract ID"
  };
};
