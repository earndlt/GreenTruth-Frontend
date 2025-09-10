
import { useState } from 'react';

export const useFormNavigation = (getFormData: () => any) => {
  const [step, setStep] = useState(1);
  const totalSteps = 7; // Includes the timeline step

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isNextDisabled = () => {
    const formData = getFormData();
    
    switch (step) {
      case 1:
        return !formData.title.trim();
      case 2:
        return !formData.selectedCategory;
      case 3:
        return formData.environmentalAttributes.length === 0;
      case 4:
        return formData.vendorOptions.length === 0;
      default:
        return false;
    }
  };

  return {
    step,
    setStep,
    handleNext,
    handlePrevious,
    isNextDisabled
  };
};
