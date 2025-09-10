
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { FormValues } from '../types';

interface ForwardPurchaseDetailsProps {
  form: UseFormReturn<FormValues>;
}

const ForwardPurchaseDetails: React.FC<ForwardPurchaseDetailsProps> = ({ form }) => {
  // Set the delivery frequency to monthly by default
  React.useEffect(() => {
    form.setValue('deliveryFrequency', 'monthly');
  }, [form]);

  return (
    <div className="space-y-4 border-l-2 border-blue-200 pl-4 ml-1 mt-4">
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700 text-sm">
          EACs are delivered in monthly batches within 60 days of the physical molecules received. Payment is collected upon each token delivery.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="Select start date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="Select end date"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="deliveryFrequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Delivery Frequency</FormLabel>
            <FormControl>
              <Input
                type="text"
                value="Monthly"
                disabled
                className="bg-gray-100"
              />
            </FormControl>
            <FormDescription>
              Monthly delivery is the standard frequency for all EAC purchases
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dailyVolume"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Daily Volume (MMBtu)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter daily volume"
                {...field}
                min="1"
                onWheel={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (
                    e.key === 'ArrowUp' || 
                    e.key === 'ArrowDown' || 
                    e.key === 'e' || 
                    e.key === '+' || 
                    e.key === '-'
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Used to calculate total quantity based on date range
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ForwardPurchaseDetails;
