
import { ProductPolicy } from '@/components/procurement/product-policies/types';

export const getKeywordsFromProductPolicies = (): string[] => {
  try {
    const savedPolicies = localStorage.getItem('productProcurementPolicies');
    if (!savedPolicies) return [];
    
    const policies: ProductPolicy[] = JSON.parse(savedPolicies);
    const keywords: string[] = [];
    
    policies.forEach(policy => {
      keywords.push(policy.name);
      
      if (policy.policyText) {
        const words = policy.policyText
          .split(/\s+/)
          .filter(word => word.length > 4)
          .filter(word => !word.match(/^(the|and|that|this|with|from|have|will|should|must|their|they|when|what|which|where)$/i));
        
        words.slice(0, 5).forEach(word => {
          if (!keywords.includes(word)) {
            keywords.push(word);
          }
        });
      }
    });
    
    return keywords;
  } catch (error) {
    console.error('Error extracting keywords from product policies:', error);
    return [];
  }
};
