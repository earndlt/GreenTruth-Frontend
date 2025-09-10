
import { RfpDataForGeneration, BusinessProfile } from '../types/draft-types';
import { generateDefaultDraft } from './defaultDraftGenerator';
import { formatProductPolicies } from '../formatters/policyFormatter';

/**
 * Generates an RFP draft based on the provided data and business profile.
 */
export const generateRfpDraft = async (
  rfpData: RfpDataForGeneration,
  businessProfile: BusinessProfile
): Promise<string> => {
  try {
    // Get any applicable product procurement policies
    const categoryName = rfpData.selectedCategory?.name;
    const productPolicies = formatProductPolicies(categoryName);
    
    // Generate the draft using the default template
    return generateDefaultDraft(rfpData, businessProfile, productPolicies);
  } catch (error) {
    console.error("Error generating RFP draft:", error);
    throw new Error("Failed to generate RFP draft");
  }
};
