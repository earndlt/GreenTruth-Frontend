
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../types';

interface TransactionTypeSelectorProps {
  form: UseFormReturn<FormValues>;
}

const TransactionTypeSelector: React.FC<TransactionTypeSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="transactionType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Transaction Type</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spot" id="spot" />
                <label htmlFor="spot" className="text-sm font-medium">
                  Spot (One-time) Purchase
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="forward" id="forward" />
                <label htmlFor="forward" className="text-sm font-medium">
                  Forward (Scheduled Future) Purchase
                </label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TransactionTypeSelector;
