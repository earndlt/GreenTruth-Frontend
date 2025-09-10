
import { RfpDataForGeneration, BusinessProfile } from '../types/draft-types';

export const generateDefaultDraft = (
  rfpData: RfpDataForGeneration,
  profile: BusinessProfile,
  productPolicies: string = ""
): string => {
  const categoryName = rfpData.selectedCategory?.name || 'Selected Products';
  const attributes = rfpData.selectedAttributes.map(attr => attr.name).join(', ');
  
  let timelineSection = "";
  if (rfpData.timeline && rfpData.timeline.length > 0) {
    const enabledTimelineItems = rfpData.timeline.filter(item => item.enabled);
    if (enabledTimelineItems.length > 0) {
      timelineSection = "### 6. TIMELINE\n";
      enabledTimelineItems.forEach(item => {
        const dateStr = item.date 
          ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : '[Date not set]';
        timelineSection += `- ${item.label}: ${dateStr}\n`;
        if (item.description) {
          timelineSection += `  ${item.description}\n`;
        }
      });
    }
  }
  
  const eacRequirementSection = `
### 3.1 REQUIRED DELIVERABLE FORMAT
All Environmental Attribute Certificates (EACs) must be:
- Created and registered on the EarnDLT registry
- Delivered in digital format through the EarnDLT platform
- Compliant with all relevant environmental attribute tracking standards

This is a mandatory requirement for all proposals. Vendors must confirm their ability to deliver EACs through the EarnDLT registry system.`;
  
  const policySection = productPolicies 
    ? `\n### 8. PRODUCT PROCUREMENT POLICY COMPLIANCE\n${productPolicies}\n` 
    : '';

  return `# REQUEST FOR PROPOSAL
## ${rfpData.title}

### 1. INTRODUCTION
${profile.companyName}, a leading organization in the ${profile.industry} industry, is committed to ${profile.mission}. In line with our sustainability goals of ${profile.sustainabilityGoals}, we are seeking proposals for ${categoryName}.

### 2. OBJECTIVES
The primary objective of this RFP is to identify qualified vendors who can provide solutions that meet our environmental and operational requirements for ${categoryName}. We aim to partner with organizations that share our commitment to sustainability and can deliver high-quality products/services.

### 3. SCOPE OF WORK
We are soliciting proposals for ${categoryName} with the following environmental attributes: ${attributes}. 
${rfpData.customAttributes ? `\nAdditional requirements include: ${rfpData.customAttributes}` : ''}
${eacRequirementSection}

### 4. SUBMISSION REQUIREMENTS
Proposals should include:
- Detailed description of products/services offered
- Environmental certifications and compliance documentation
- Pricing structure and payment terms
- Implementation timeline
- Case studies or references from similar projects
- Company background and qualifications
- Confirmation of ability to deliver EACs through the EarnDLT registry
${productPolicies ? '- Documentation showing compliance with our product procurement policy' : ''}

### 5. EVALUATION CRITERIA
Proposals will be evaluated based on:
- Compliance with specified environmental attributes
- Ability to deliver through the EarnDLT registry
- Cost-effectiveness
- Technical capability and experience
- Implementation approach
- Quality of references
- Alignment with our sustainability goals
${productPolicies ? '- Adherence to our product procurement policy' : ''}

${timelineSection}

### 7. CONTACT INFORMATION
For questions regarding this RFP, please contact:
[Contact Name]
[Contact Email]
[Contact Phone]
${policySection}
We look forward to receiving your proposal.
`;
};
