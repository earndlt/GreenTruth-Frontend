import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateRfpDraft } from "../../utils/generators/draftGenerator";
import { ProductCategory } from "../../types";
import { productCategories } from "../../rfp-form-data";

export const useDraftState = () => {
  const [generatedDraft, setGeneratedDraft] = useState("");
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const { toast } = useToast();

  const generateDraft = async (formData: any) => {
    setIsGeneratingDraft(true);

    try {
      const selectedCategoryObj = formData.selectedCategory
        ? productCategories.find(
            (c: ProductCategory) => c.id === formData.selectedCategory
          )
        : null;

      // Mock business profile - in a real app, this would come from user data
      const businessProfile = {
        companyName: "Acme Corporation",
        industry: "Energy",
        mission:
          "To develop the affordable, reliable, ever-cleaner energy that enables human progress.",
        sustainabilityGoals:
          "Achieve net zero carbon emissions by 2050 and reduce carbon intensity by 35% by 2028.",
      };

      const rfpDataForGeneration = {
        title: formData.title,
        selectedCategory: selectedCategoryObj,
        selectedMrvSubcategories: formData.mrvSubcategories.filter(
          (sc: any) => sc.selected
        ),
        selectedAttributes: formData.environmentalAttributes.filter(
          (attr: any) => attr.selected
        ),
        customAttributes: formData.customAttributes,
        selectedVendorOption:
          formData.vendorOptions.find((opt: any) => opt.selected) || null,
        vendorContacts: formData.vendorContacts,
        timeline: formData.timeline,
      };

      const draft = await generateRfpDraft(
        rfpDataForGeneration,
        businessProfile
      );
      setGeneratedDraft(draft);

      toast({
        title: "RFP Draft Generated",
        description:
          "Your AI-generated RFP draft is ready for review and editing.",
      });
    } catch (error) {
      console.error("Failed to generate RFP draft:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate RFP draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  return {
    generatedDraft,
    setGeneratedDraft,
    isGeneratingDraft,
    generateDraft,
  };
};
