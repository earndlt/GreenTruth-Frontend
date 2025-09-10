
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { KNumberMatchFormValues } from '../schema';
import { getContractIdLabel, getContractIdPlaceholder } from '../utils/formLabels';

interface ContractIdFieldProps {
  form: UseFormReturn<KNumberMatchFormValues>;
  contractValidated: boolean | null;
  selectedPipeline: "REX" | "Ruby";
}

const ContractIdField = ({ form, contractValidated, selectedPipeline }: ContractIdFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="contractId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{getContractIdLabel(selectedPipeline)}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                placeholder={getContractIdPlaceholder(selectedPipeline)}
                {...field}
              />
              {contractValidated !== null && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {contractValidated ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ContractIdField;
