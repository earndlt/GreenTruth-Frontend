
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { SearchFormValues } from './types';

interface LocationFieldProps {
  form: UseFormReturn<SearchFormValues>;
}

const LocationField = ({ form }: LocationFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="productionLocation"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preferred Production Location</FormLabel>
          <FormControl>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="E.g., North America, United States, Texas" 
                className="pl-8"
                {...field} 
              />
            </div>
          </FormControl>
          <FormDescription>
            Enter preferred location for production facilities
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
