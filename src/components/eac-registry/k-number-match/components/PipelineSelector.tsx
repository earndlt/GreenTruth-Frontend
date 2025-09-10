
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { KNumberMatchFormValues } from '../schema';

interface PipelineSelectorProps {
  form: UseFormReturn<KNumberMatchFormValues>;
}

const PipelineSelector = ({ form }: PipelineSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="pipeline"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Pipeline</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select pipeline" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="REX">REX Pipeline</SelectItem>
              <SelectItem value="Ruby">Ruby Pipeline</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PipelineSelector;
