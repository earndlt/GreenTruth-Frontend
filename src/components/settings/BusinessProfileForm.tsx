
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Building, Check } from 'lucide-react';
import BasicInfoFields from './business-profile/BasicInfoFields';
import MissionGoalsFields from './business-profile/MissionGoalsFields';
import { useBusinessProfileForm } from '@/hooks/use-business-profile-form';

const BusinessProfileForm = () => {
  const { form, onSubmit } = useBusinessProfileForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Building className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Business Profile</h2>
        </div>

        <BasicInfoFields form={form} />
        <MissionGoalsFields form={form} />
        
        <Button type="submit" className="mt-4">
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default BusinessProfileForm;
