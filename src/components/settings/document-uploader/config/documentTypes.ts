
export interface DocumentType {
  value: string;
  label: string;
}

export const documentTypes: DocumentType[] = [
  { value: 'annual-report', label: 'Annual Report' },
  { value: 'compliance-procedures', label: 'Compliance Procedures' },
  { value: 'environmental-policy', label: 'Environmental Policy' },
  { value: 'esg-policy', label: 'ESG Policy' },
  { value: 'esg-report', label: 'ESG Report' },
  { value: 'methodologies', label: 'Methodologies' },
  { value: 'regulatory-filings', label: 'Regulatory Filings' },
  { value: 'strategic-plan', label: 'Strategic Plan' },
  { value: 'sustainability-policy', label: 'Sustainability Policy' },
  { value: 'other', label: 'Other Document' },
];
