
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { KNumberMatchFormValues } from '../schema';

interface OrderTypeSelectorProps {
  form: UseFormReturn<KNumberMatchFormValues>;
}

const OrderTypeSelector = ({ form }: OrderTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="orderType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Order Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="spot">Spot Order</SelectItem>
              <SelectItem value="forward">Forward Order</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OrderTypeSelector;
