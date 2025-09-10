import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  businessProfileSchema,
  type BusinessProfileFormValues,
} from "@/components/settings/business-profile/BasicInfoFields";

export const useBusinessProfileForm = () => {
  const { toast } = useToast();

  // Default values for the form - in a real implementation, these would come from an API
  const defaultValues: BusinessProfileFormValues = {
    companyName: "Acme Corporation",
    industry: "Energy",
    size: "50,000+",
    yearFounded: "1879",
    headquarters: "San Ramon, California",
    mission:
      "To develop the affordable, reliable, ever-cleaner energy that enables human progress.",
    sustainabilityGoals:
      "Achieve net zero carbon emissions by 2050 and reduce carbon intensity by 35% by 2028.",
  };

  const form = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues,
  });

  const onSubmit = (data: BusinessProfileFormValues) => {
    console.log("Business profile data:", data);


    // Save the business profile data to localStorage so the header can access it
    localStorage.setItem('businessProfile', JSON.stringify(data));

    // Trigger a storage event so the header updates immediately
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'businessProfile',
      newValue: JSON.stringify(data),
      oldValue: localStorage.getItem('businessProfile')
    }));

    toast({
      title: "Profile updated",
      description: "Your business profile has been successfully updated.",
      duration: 3000,
    });
  };

  return {
    form,
    onSubmit,
  };
};
