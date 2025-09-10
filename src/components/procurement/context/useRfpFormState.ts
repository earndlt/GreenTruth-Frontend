
import { useToast } from '@/hooks/use-toast';
import { 
  MrvSubcategory, 
  EnvironmentalAttribute, 
  VendorDistributionOption
} from '../types';
import { useCategories } from './hooks/useCategories';
import { useAttributes } from './hooks/useAttributes';
import { useVendorContacts } from './hooks/useVendorContacts';
import { useFormNavigation } from './hooks/useFormNavigation';
import { useTimelineState } from './hooks/useTimelineState';
import { useDraftState } from './hooks/useDraftState';
import { useFormData } from './hooks/useFormData';
import { useState } from 'react';
import { Vendor } from '../steps/vendor-selection/ExistingVendorSelector';

type FormSubmissionHandler = (data: any, isDraft?: boolean) => void;

export const useRfpFormState = (
  initialMrvSubcategories: MrvSubcategory[],
  initialEnvironmentalAttributes: EnvironmentalAttribute[],
  initialVendorOptions: VendorDistributionOption[],
  onClose: () => void,
  onFormSubmission?: FormSubmissionHandler
) => {
  const { title, setTitle, resetForm: resetFormData } = useFormData();
  const { timeline, updateTimelineItem } = useTimelineState();
  const { toast } = useToast();
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);

  const {
    selectedCategory,
    setSelectedCategory,
    mrvSubcategories,
    toggleSubcategory
  } = useCategories(initialMrvSubcategories);

  const {
    environmentalAttributes,
    toggleAttribute,
    customAttributes,
    setCustomAttributes,
    vendorOptions,
    toggleVendorOption
  } = useAttributes(initialEnvironmentalAttributes, initialVendorOptions);

  const {
    vendorContacts,
    addVendorContact,
    removeVendorContact,
    handleExcelUpload,
    downloadExcelTemplate
  } = useVendorContacts();

  const {
    generatedDraft,
    setGeneratedDraft,
    isGeneratingDraft,
    generateDraft: generateDraftInternal
  } = useDraftState();

  const getFormData = () => ({
    title,
    selectedCategory,
    mrvSubcategories: mrvSubcategories.filter(sc => sc.selected),
    environmentalAttributes: environmentalAttributes.filter(attr => attr.selected),
    customAttributes,
    vendorOptions: vendorOptions.filter(opt => opt.selected),
    vendorContacts,
    timeline: timeline.filter(item => item.enabled),
    selectedVendors
  });

  const generateDraft = async () => {
    const formData = getFormData();
    await generateDraftInternal(formData);
  };

  const resetForm = () => {
    resetFormData();
    setSelectedCategory('');
    setCustomAttributes('');
    setGeneratedDraft('');
    setSelectedVendors([]);
  };

  const handleFormSubmit = (isDraft = false) => {
    const formData = getFormData();
    
    if (onFormSubmission) {
      // Include the generated draft in the form data
      onFormSubmission({
        ...formData,
        generatedDraft: generatedDraft
      }, isDraft);
    } else {
      console.log({...formData, generatedDraft});
      toast({
        title: isDraft ? "Draft Saved" : "RFP Created",
        description: isDraft 
          ? `Saved draft RFP: ${title}` 
          : `Successfully created RFP: ${title}`,
      });
      
      onClose();
      resetForm();
    }
  };

  const {
    step,
    setStep,
    handleNext,
    handlePrevious,
    isNextDisabled
  } = useFormNavigation(getFormData);

  return {
    step,
    setStep,
    title,
    setTitle,
    selectedCategory,
    setSelectedCategory,
    mrvSubcategories,
    toggleSubcategory,
    environmentalAttributes,
    toggleAttribute,
    customAttributes,
    setCustomAttributes,
    vendorOptions,
    toggleVendorOption,
    vendorContacts,
    addVendorContact,
    removeVendorContact,
    handleExcelUpload,
    downloadExcelTemplate,
    handleNext,
    handlePrevious,
    handleSubmit: () => handleFormSubmit(false),
    saveDraft: () => handleFormSubmit(true),
    isNextDisabled,
    resetForm,
    generatedDraft,
    setGeneratedDraft,
    isGeneratingDraft,
    generateDraft,
    timeline,
    updateTimelineItem,
    selectedVendors,
    setSelectedVendors
  };
};
