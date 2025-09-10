
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormValues } from '../types';

const SEGMENTS = [
  { id: 'production', label: 'Production' },
  { id: 'processing', label: 'Processing' },
  { id: 'gathering_boosting', label: 'Gathering & Boosting' },
  { id: 'transportation', label: 'Transportation' },
  { id: 'distribution', label: 'Distribution' },
] as const;

interface SegmentSelectorProps {
  form: UseFormReturn<FormValues>;
}

const SegmentSelector: React.FC<SegmentSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="segment"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Natural Gas Segment</FormLabel>
          <div className="space-y-3 bg-background rounded-md border p-4">
            {SEGMENTS.map((segment) => (
              <div key={segment.id} className="flex items-center space-x-2">
                <Checkbox
                  id={segment.id}
                  checked={field.value?.includes(segment.id)}
                  onCheckedChange={(checked) => {
                    const currentValue = field.value || [];
                    const newValue = checked
                      ? [...currentValue, segment.id]
                      : currentValue.filter((value) => value !== segment.id);
                    field.onChange(newValue);
                  }}
                />
                <label
                  htmlFor={segment.id}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {segment.label}
                </label>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SegmentSelector;
