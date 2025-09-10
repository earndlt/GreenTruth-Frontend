
export interface ProductPolicy {
  id: string;
  name: string;
  policyText: string;
  documentUrls: string[];
  companyId?: string;
}

export const INITIAL_PRODUCT_OPTIONS = [
  'Natural Gas',
  'Renewable Natural Gas (RNG)',
  'Methanol',
  'LNG',
  'Thermal Credits',
  'Hydrogen',
  'Ammonia'
];
