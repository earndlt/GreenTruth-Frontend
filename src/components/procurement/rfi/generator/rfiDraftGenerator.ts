
// Utility to generate an RFI (Request for Information) draft based on form values and business profile

type RfiFormValues = {
  subject: string;
  productInfo: string;
  requestBusinessDetails: boolean;
  requestPaymentTerms: boolean;
  requestDeliveryDetails: boolean;
  requestEnvironmentalInfo: boolean;
  requestEsgCompliance: boolean;
  additionalQuestions?: string;
  deadline: string;
};

type BusinessProfile = {
  companyName: string;
  industry: string;
  mission: string;
  sustainabilityGoals: string;
};

export function generateRfiDraft(form: RfiFormValues, businessProfile: BusinessProfile, vendorNames: string[]): string {
  const sections: string[] = [];
  sections.push(`# REQUEST FOR INFORMATION (RFI)\n`);
  sections.push(`## Subject: ${form.subject}\n`);
  sections.push(`**Sender:** ${businessProfile.companyName}\n**Industry:** ${businessProfile.industry}\n`);

  sections.push(`### 1. Introduction`);
  sections.push(
    `As part of our organization's commitment to sustainability (${businessProfile.sustainabilityGoals}), we are reaching out to request additional information regarding your products/services.\n`
  );

  if (vendorNames.length > 0) {
    sections.push(`### 2. Intended Recipients`);
    vendorNames.forEach(name => sections.push(`- ${name}`));
    sections.push("");
  }

  sections.push(`### 3. Requested Information`);
  sections.push(form.productInfo);

  const infoItems: string[] = [];
  if (form.requestBusinessDetails) infoItems.push("• Business details (company information, structure)");
  if (form.requestPaymentTerms) infoItems.push("• Payment terms and pricing structure");
  if (form.requestDeliveryDetails) infoItems.push("• Delivery methods, lead times, and capabilities");
  if (form.requestEnvironmentalInfo) infoItems.push("• Sustainability practices and certifications");
  if (form.requestEsgCompliance) infoItems.push("• ESG (Environmental, Social, Governance) compliance documentation");

  if (infoItems.length > 0) {
    sections.push("\nAdditional info requested:");
    infoItems.forEach(item => sections.push(item));
  }

  if (form.additionalQuestions && form.additionalQuestions.trim() !== "") {
    sections.push("\n### 4. Additional Questions");
    sections.push(form.additionalQuestions);
  }

  sections.push(`\n### 5. Deadline`);
  sections.push(`Respond by: ${form.deadline}`);

  sections.push(`\nThank you for your prompt attention. We look forward to your detailed response.`);
  return sections.join('\n');
}
