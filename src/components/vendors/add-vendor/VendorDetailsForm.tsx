
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Building } from 'lucide-react';
import BasicVendorInfo from './components/BasicVendorInfo';
import VendorDescription from './components/VendorDescription';
import PaymentTerms from './components/PaymentTerms';
import { vendorSchema, VendorFormProps, VendorFormValues } from './types/vendorFormTypes';

const VendorDetailsForm: React.FC<VendorFormProps> = ({ onSubmit, initialData }) => {
  const [inviteVendor, setInviteVendor] = useState(true);
  
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: '',
      website: '',
      category: initialData?.category || '',
      description: '',
      // Initialize new address fields
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateProvince: '',
      postalCode: '',
      country: 'US',
      paymentTerms: 'net30',
      earndltClearing: true,
    },
  });

  const handleSubmit = (data: VendorFormValues) => {
    onSubmit(data, inviteVendor);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Building className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Vendor Details</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <BasicVendorInfo form={form} />
          <VendorDescription form={form} />
          <PaymentTerms form={form} />
          
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={inviteVendor}
                onCheckedChange={(checked) => setInviteVendor(checked as boolean)}
                id="invite-vendor"
              />
              <label htmlFor="invite-vendor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Send Invitation to Vendor
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Send an email invitation to the vendor to join the platform and complete their profile
            </p>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VendorDetailsForm;
