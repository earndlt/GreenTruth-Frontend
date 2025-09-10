
import { ProductPolicy } from '../types/draft-types';

export const formatProductPolicies = (categoryName: string | undefined, companyId?: string): string => {
  if (!categoryName) return "";
  
  try {
    const savedPoliciesJson = localStorage.getItem(
      companyId 
        ? `productProcurementPolicies-${companyId}`
        : 'productProcurementPolicies'
    );
    
    if (!savedPoliciesJson) return "";
    
    const policies: ProductPolicy[] = JSON.parse(savedPoliciesJson);
    const matchingPolicy = policies.find(policy => 
      policy.name.toLowerCase() === categoryName.toLowerCase() ||
      categoryName.toLowerCase().includes(policy.name.toLowerCase()) ||
      policy.name.toLowerCase().includes(categoryName.toLowerCase())
    );
    
    if (matchingPolicy && matchingPolicy.policyText) {
      return `\n\nPRODUCT PROCUREMENT POLICY:\n${matchingPolicy.policyText}`;
    }
    
    return "";
  } catch (error) {
    console.error("Error parsing product policies:", error);
    return "";
  }
};
