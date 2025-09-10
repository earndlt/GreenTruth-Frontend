
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';
import { SearchFormValues } from './types';

interface SpecificationsFieldProps {
  form: UseFormReturn<SearchFormValues>;
}

const SpecificationsField = ({ form }: SpecificationsFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="productSpecifications"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Product Specifications</FormLabel>
          <FormControl>
            <div className="relative">
              <Settings className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="E.g., ISO certified, low-carbon, etc." 
                className="pl-8"
                {...field} 
              />
            </div>
          </FormControl>
          <FormDescription>
            Enter specific product requirements or certifications
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SpecificationsField;
