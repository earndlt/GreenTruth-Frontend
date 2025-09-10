
import { RfpDataForGeneration } from '../types/draft-types';

export const formatRfpData = (rfpData: RfpDataForGeneration): string => {
  const sections = [
    `Title: ${rfpData.title}`,
    `Category: ${rfpData.selectedCategory?.name || 'Not specified'}`,
  ];

  if (rfpData.selectedMrvSubcategories.length > 0) {
    sections.push(`Subcategories: ${rfpData.selectedMrvSubcategories.map(sub => sub.name).join(', ')}`);
  }

  if (rfpData.selectedAttributes.length > 0) {
    sections.push(`Environmental Attributes: ${rfpData.selectedAttributes.map(attr => attr.name).join(', ')}`);
  }

  if (rfpData.customAttributes) {
    sections.push(`Additional Requirements: ${rfpData.customAttributes}`);
  }

  if (rfpData.selectedVendorOption) {
    sections.push(`Distribution Method: ${rfpData.selectedVendorOption.name}`);
  }

  return sections.join('\n');
};
