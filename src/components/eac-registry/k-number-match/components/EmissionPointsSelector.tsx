
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { KNumberMatchFormValues } from '../schema';
import { getEmissionPointLabel } from '../utils/formLabels';

interface EmissionPointsSelectorProps {
  form: UseFormReturn<KNumberMatchFormValues>;
}

const EmissionPointsSelector = ({ form }: EmissionPointsSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="emissionPoints"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Emission Points</FormLabel>
          <div className="space-y-2">
            {["production", "processing", "transportation"].map(point => (
              <div key={point} className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value?.includes(point)}
                  onCheckedChange={(checked) => {
                    const currentValue = field.value || [];
                    if (checked) {
                      field.onChange([...currentValue, point]);
                    } else {
                      field.onChange(
                        currentValue.filter(val => val !== point)
                      );
                    }
                  }}
                  id={`emission-point-${point}`}
                />
                <label
                  htmlFor={`emission-point-${point}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {getEmissionPointLabel(point)}
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

export default EmissionPointsSelector;
