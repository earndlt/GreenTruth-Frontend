
export interface ComplianceAlert {
  id: number;
  type: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
}

export const complianceAlerts: ComplianceAlert[] = [
  {
    id: 1,
    type: 'high',
    title: 'New EPA regulation affecting chemical supply chain',
    description: 'Regulation #2023-456 introduces stricter requirements for chemical transport',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'medium',
    title: 'EU-Lex update on carbon reporting standards',
    description: 'Updated reporting standards will go into effect in Q1 2024',
    time: '5 hours ago',
  },
  {
    id: 3,
    type: 'low',
    title: 'UNEP compliance report available',
    description: 'Annual UNEP compliance report for industrial sectors published',
    time: '1 day ago',
  },
  {
    id: 4,
    type: 'high',
    title: 'Critical supply chain vulnerability detected',
    description: 'Three vendors in your network have been flagged for compliance issues',
    time: '1 day ago',
  },
  {
    id: 5,
    type: 'medium',
    title: 'Upcoming regulatory changes for industrial waste',
    description: 'New standards for industrial waste management expected next quarter',
    time: '2 days ago',
  },
];
