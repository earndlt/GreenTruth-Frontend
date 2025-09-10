
import { useState } from 'react';
import { createDefaultTimeline } from './useTimelineState';

export const useFormData = () => {
  const [title, setTitle] = useState('');
  
  const resetForm = () => {
    setTitle('');
  };

  const getFormData = (
    selectedCategory: string | null,
    mrvSubcategories: any[],
    environmentalAttributes: any[],
    customAttributes: string,
    vendorOptions: any[],
    vendorContacts: any[],
    timeline: any[]
  ) => ({
    title,
    selectedCategory,
    mrvSubcategories: mrvSubcategories.filter((sc: any) => sc.selected),
    environmentalAttributes: environmentalAttributes.filter((attr: any) => attr.selected),
    customAttributes,
    vendorOptions: vendorOptions.filter((opt: any) => opt.selected),
    vendorContacts,
    timeline: timeline.filter((item: any) => item.enabled)
  });

  return {
    title,
    setTitle,
    resetForm,
    getFormData
  };
};
