
export type EnvironmentalAttribute = {
  id: string;
  name: string;
  description: string;
  selected: boolean;
};

export type ProductCategory = {
  id: string;
  name: string;
  description: string;
};

export type MrvSubcategory = {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  icon?: string; // Optional icon name for visual representation
};

export type VendorDistributionOption = {
  id: string;
  name: string;
  description: string;
  selected: boolean;
};

export type VendorContact = {
  id: string;
  name: string;
  businessName: string;
  email: string;
};

export type TimelineDate = {
  label: string;
  date: Date | null;
  description: string;
  enabled: boolean;
};

export interface CreateRfpFormData {
  title: string;
  selectedCategory: string | null;
  selectedSubcategories: MrvSubcategory[];
  selectedAttributes: EnvironmentalAttribute[];
  customAttributes: string;
  selectedVendorOptions: VendorDistributionOption[];
  vendorContacts: VendorContact[];
  rfpText?: string;
  timeline?: TimelineDate[];
}

export type RfpData = {
  title: string;
  description: string;
  status: 'active' | 'closed' | 'draft';
  dueDate: string;
  responses: number;
  rfpText?: string;
};

export type DraftRfpData = {
  title: string;
  description: string;
  completeness: number;
  dueDate: string;
  responses: number;
};
