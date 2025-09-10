import { MrvSubcategory, ProductCategory, EnvironmentalAttribute, VendorDistributionOption } from './types';

export const mrvSubcategories: MrvSubcategory[] = [
  { id: 'mrv-1', name: 'Production', description: 'MRV data for natural gas extraction and production', selected: false },
  { id: 'mrv-2', name: 'Processing', description: 'MRV data for natural gas processing facilities', selected: false },
  { id: 'mrv-3', name: 'Transportation', description: 'MRV data for natural gas pipeline transport', selected: false },
  { id: 'mrv-4', name: 'Distribution', description: 'MRV data for natural gas distribution networks', selected: false },
  { id: 'mrv-5', name: 'Gathering and Boosting', description: 'MRV data for natural gas gathering and boosting operations', selected: false },
];

export const environmentalAttributes: EnvironmentalAttribute[] = [
  { id: '6', name: 'QET Compatible', description: 'Compatible with QET emissions tracking', selected: false },
  { id: '7', name: 'CET Compatible', description: 'Compatible with CET emissions tracking, lacks ISO aligned validation', selected: false },
  { id: '1', name: 'Carbon Neutral', description: 'Products with net-zero carbon emissions', selected: false },
  { id: '3', name: 'Water Usage', description: 'Considers water consumption impact', selected: false },
  { id: '8', name: 'Land Usage', description: 'Minimizes impact on land resources', selected: false },
  { id: '9', name: 'Air Impact', description: 'Reduces effects on air quality', selected: false },
  { id: '10', name: 'Community Impact', description: 'Considers effects on local communities', selected: false },
];

export const vendorDistributionOptions: VendorDistributionOption[] = [
  { 
    id: 'specific-vendors', 
    name: 'Specific Vendors', 
    description: 'Send this RFP to a specific list of vendors that you select', 
    selected: false 
  },
  { 
    id: 'earndlt-community', 
    name: 'EarnDLT Community', 
    description: 'Broadcast this RFP to the entire EarnDLT vendor community', 
    selected: false 
  },
  { 
    id: 'both', 
    name: 'Both Options', 
    description: 'Send to specific vendors AND broadcast to the EarnDLT community', 
    selected: false 
  },
];

export const productCategories: ProductCategory[] = [
  { id: '8', name: 'MRV Natural Gas', description: 'Measurement, Reporting, and Verification for natural gas operations' },
  { id: '1', name: 'Renewable Energy Solutions', description: 'Solar, wind, hydro, and geothermal power systems' },
  { id: '2', name: 'Biofuels Production', description: 'Ethanol, biodiesel, and advanced biofuel production systems' },
  { id: '3', name: 'Industrial Chemicals', description: 'Sustainable industrial and specialty chemicals' },
  { id: '4', name: 'Green Hydrogen', description: 'Hydrogen fuel production and distribution systems' },
  { id: '5', name: 'Carbon Capture Technologies', description: 'Direct air capture and point-source carbon sequestration' },
];
