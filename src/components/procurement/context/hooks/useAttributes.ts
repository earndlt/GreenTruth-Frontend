
import { useState } from 'react';
import { EnvironmentalAttribute, VendorDistributionOption } from '../../types';

export const useAttributes = (
  initialEnvironmentalAttributes: EnvironmentalAttribute[],
  initialVendorOptions: VendorDistributionOption[]
) => {
  const [environmentalAttributesState, setEnvironmentalAttributes] = useState<EnvironmentalAttribute[]>(
    initialEnvironmentalAttributes
  );
  const [vendorOptions, setVendorOptions] = useState<VendorDistributionOption[]>(initialVendorOptions);
  const [customAttributes, setCustomAttributes] = useState<string>('');

  const toggleAttribute = (id: string) => {
    setEnvironmentalAttributes(environmentalAttributesState.map(attr => 
      attr.id === id ? { ...attr, selected: !attr.selected } : attr
    ));
  };

  const toggleVendorOption = (id: string) => {
    setVendorOptions(vendorOptions.map(opt => 
      // If this is the option being clicked, toggle it
      opt.id === id ? { ...opt, selected: !opt.selected } : 
      // If we're selecting "both", deselect the other options
      id === 'both' && opt.id !== 'both' ? { ...opt, selected: false } :
      // If we're selecting one of the individual options, deselect "both"
      id !== 'both' && opt.id === 'both' ? { ...opt, selected: false } : opt
    ));
  };

  return {
    environmentalAttributes: environmentalAttributesState,
    toggleAttribute,
    customAttributes,
    setCustomAttributes,
    vendorOptions,
    toggleVendorOption
  };
};
