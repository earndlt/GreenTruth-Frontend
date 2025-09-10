
import { MrvSubcategory, EnvironmentalAttribute, VendorDistributionOption, VendorContact, CreateRfpFormData, ProductCategory, TimelineDate } from '../types';
import { Vendor } from '../steps/vendor-selection/ExistingVendorSelector';

export interface RfpFormContextType {
  step: number;
  setStep: (step: number) => void;
  title: string;
  setTitle: (title: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string) => void;
  mrvSubcategories: MrvSubcategory[];
  toggleSubcategory: (id: string) => void;
  environmentalAttributes: EnvironmentalAttribute[];
  toggleAttribute: (id: string) => void;
  customAttributes: string;
  setCustomAttributes: (text: string) => void;
  vendorOptions: VendorDistributionOption[];
  toggleVendorOption: (id: string) => void;
  vendorContacts: VendorContact[];
  addVendorContact: (contact: Omit<VendorContact, 'id'>) => void;
  removeVendorContact: (id: string) => void;
  handleExcelUpload: (file: File) => void;
  downloadExcelTemplate: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => void;
  saveDraft: () => void;
  isNextDisabled: () => boolean;
  resetForm: () => void;
  generatedDraft: string;
  setGeneratedDraft: (draft: string) => void;
  isGeneratingDraft: boolean;
  generateDraft: () => Promise<void>;
  timeline: TimelineDate[];
  updateTimelineItem: (index: number, updates: Partial<TimelineDate>) => void;
  selectedVendors: Vendor[];
  setSelectedVendors: (vendors: Vendor[]) => void;
}
