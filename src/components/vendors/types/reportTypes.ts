
export interface ComplianceReportSummary {
  score: number;
  impact: 'positive' | 'neutral' | 'negative';
  highlights: string[];
}

export interface ComplianceReport {
  id: string;
  vendorId: string;
  title: string;
  date: string;
  transactionId: string;
  eacQuantity: number;
  eacType: string;
  esgPolicyMatch: ComplianceReportSummary;
  procurementPolicyMatch: ComplianceReportSummary;
  sustainabilityPolicyMatch: ComplianceReportSummary;
  overallScore: number;
  status: 'reviewed' | 'pending' | 'flagged';
}
