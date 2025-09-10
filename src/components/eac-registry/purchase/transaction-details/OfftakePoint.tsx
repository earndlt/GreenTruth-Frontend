
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormValues, EacData } from '../types';

interface OfftakePointProps {
  form: UseFormReturn<FormValues>;
  eacData: EacData;
}

const OfftakePoint: React.FC<OfftakePointProps> = ({ form, eacData }) => {
  return (
    <FormField
      control={form.control}
      name="offtakePoint"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Offtake Point/Hub</FormLabel>
          <FormControl>
            <Input
              placeholder="Offtake point or hub"
              {...field}
              disabled
            />
          </FormControl>
          <FormDescription>
            Selected from the map: {eacData.deliveryPoint.name}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OfftakePoint;
