
import { 
  MrvSubcategory, 
  EnvironmentalAttribute, 
  VendorDistributionOption, 
  VendorContact,
  ProductCategory,
  TimelineDate
} from '../../types';

export interface RfpDataForGeneration {
  title: string;
  selectedCategory: ProductCategory | null;
  selectedMrvSubcategories: MrvSubcategory[];
  selectedAttributes: EnvironmentalAttribute[];
  customAttributes: string;
  selectedVendorOption: VendorDistributionOption | null;
  vendorContacts: VendorContact[];
  timeline: TimelineDate[];
}

export interface BusinessProfile {
  companyName: string;
  industry: string;
  mission: string;
  sustainabilityGoals: string;
}

export interface ProductPolicy {
  id: string;
  name: string;
  policyText: string;
  documentUrls: string[];
  companyId: string;
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
