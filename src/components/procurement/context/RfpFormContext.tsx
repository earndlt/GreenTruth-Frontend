
import React, { createContext, useContext } from 'react';
import { 
  mrvSubcategories, 
  environmentalAttributes,
  vendorDistributionOptions 
} from '../rfp-form-data';
import { useRfpFormState } from './useRfpFormState';
import { RfpFormContextType } from './types';
import { useProcurement } from './ProcurementContext';

const RfpFormContext = createContext<RfpFormContextType | undefined>(undefined);

export const useRfpForm = () => {
  const context = useContext(RfpFormContext);
  if (!context) {
    throw new Error('useRfpForm must be used within an RfpFormProvider');
  }
  return context;
};

export const RfpFormProvider: React.FC<{ 
  children: React.ReactNode;
  onClose: () => void;
}> = ({ children, onClose }) => {
  const { addRfp, addDraft } = useProcurement();
  
  const handleFormSubmission = (data: any, isDraft: boolean = false) => {
    const { 
      title, 
      selectedCategory, 
      mrvSubcategories, 
      environmentalAttributes, 
      customAttributes, 
      vendorOptions,
      generatedDraft 
    } = data;
    
    // Generate a description based on selected options
    const description = `RFP for ${selectedCategory === '8' 
      ? mrvSubcategories.filter(sc => sc.selected).map(sc => sc.name).join(', ') 
      : 'various products'} with ${environmentalAttributes.filter(attr => attr.selected).map(attr => attr.name).join(', ')}`;
    
    if (isDraft) {
      addDraft({
        title,
        description,
        completeness: Math.floor(Math.random() * 30) + 40, // Random completeness between 40-70%
        dueDate: "Not published",
        responses: 0
      });
    } else {
      addRfp({
        title,
        description,
        status: 'active',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        responses: 0,
        rfpText: generatedDraft || "No RFP text generated" // Include the generated RFP
      });
    }
    
    onClose();
  };
  
  const rfpFormState = useRfpFormState(
    mrvSubcategories,
    environmentalAttributes,
    vendorDistributionOptions,
    onClose,
    handleFormSubmission
  );

  return (
    <RfpFormContext.Provider value={rfpFormState}>
      {children}
    </RfpFormContext.Provider>
  );
};
