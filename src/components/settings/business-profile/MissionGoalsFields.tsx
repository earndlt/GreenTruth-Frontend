
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import type { BusinessProfileFormValues } from './BasicInfoFields';

interface MissionGoalsFieldsProps {
  form: UseFormReturn<BusinessProfileFormValues>;
}

const MissionGoalsFields: React.FC<MissionGoalsFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="mission"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mission Statement</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your company's mission" 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              This helps our AI understand your company's core purpose.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="sustainabilityGoals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sustainability Goals</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your company's sustainability goals" 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              This helps our AI align with your environmental objectives.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MissionGoalsFields;
