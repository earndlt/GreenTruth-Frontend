
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const businessProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(2, 'Industry must be at least 2 characters'),
  size: z.string().min(1, 'Company size is required'),
  yearFounded: z.string().regex(/^\d{4}$/, 'Please enter a valid year (e.g., 2000)'),
  headquarters: z.string().min(2, 'Headquarters location is required'),
  mission: z.string().min(10, 'Mission statement should be more detailed'),
  sustainabilityGoals: z.string().min(10, 'Sustainability goals should be more detailed'),
});

type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>;

interface BasicInfoFieldsProps {
  form: UseFormReturn<BusinessProfileFormValues>;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Energy, Technology, Healthcare" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Size</FormLabel>
            <FormControl>
              <Input placeholder="Number of employees" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="yearFounded"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year Founded</FormLabel>
            <FormControl>
              <Input placeholder="YYYY" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="headquarters"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Headquarters</FormLabel>
            <FormControl>
              <Input placeholder="City, Country" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export type { BusinessProfileFormValues };
export { businessProfileSchema };
export default BasicInfoFields;
