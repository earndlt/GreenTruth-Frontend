
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { SearchFormValues } from './types';

interface PolicyConsiderationsSectionProps {
  form: UseFormReturn<SearchFormValues>;
  companyName?: string;
}

const PolicyConsiderationsSection: React.FC<PolicyConsiderationsSectionProps> = ({ form, companyName = '' }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Policy Considerations {companyName && `for ${companyName}`}</h3>
      <p className="text-sm text-muted-foreground">
        The Greentruth LLM will analyze vendors against {companyName ? `${companyName}'s` : 'your company\'s'} policies
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="considerProcurementPolicy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Procurement Policy
                </FormLabel>
                <FormDescription>
                  Match against {companyName ? `${companyName}'s` : 'your'} procurement requirements
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="considerEnvironmentalPolicy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Environmental Policy
                </FormLabel>
                <FormDescription>
                  Match against {companyName ? `${companyName}'s` : 'your'} environmental standards
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="considerEsgPolicy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  ESG Policy
                </FormLabel>
                <FormDescription>
                  Match against {companyName ? `${companyName}'s` : 'your'} ESG guidelines
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default PolicyConsiderationsSection;
