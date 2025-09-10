
import React, { useState, useEffect } from 'react';
import { Check, Search } from 'lucide-react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { KNumberMatchFormValues } from '../schema';
import { receiptLocationsByZone, validReceiptLocations } from '../utils/receiptLocations';

interface ReceiptLocationFieldProps {
  form: UseFormReturn<KNumberMatchFormValues>;
  selectedPipeline: "REX" | "Ruby";
}

const ReceiptLocationField: React.FC<ReceiptLocationFieldProps> = ({ form, selectedPipeline }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Clear receipt location when pipeline changes from REX to Ruby
  useEffect(() => {
    if (selectedPipeline !== 'REX') {
      form.setValue('receiptLocationId', '');
    }
  }, [selectedPipeline, form]);

  // Only show this field for REX pipeline
  if (selectedPipeline !== 'REX') {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="receiptLocationId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>REX Receipt Location ID (Rcpt LOC)</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || ''}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Receipt Location ID" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Search locations..."
                  className="mb-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {searchTerm ? (
                <div className="max-h-[300px] overflow-y-auto">
                  {validReceiptLocations
                    .filter(loc => 
                      loc.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      loc.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(location => (
                      <SelectItem key={location.id} value={location.id}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{location.id}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[250px] ml-2">
                            {location.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  }
                </div>
              ) : (
                Object.entries(receiptLocationsByZone).map(([zone, locations]) => (
                  <SelectGroup key={zone}>
                    <SelectLabel>{zone}</SelectLabel>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{location.id}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[250px] ml-2">
                            {location.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))
              )}
            </SelectContent>
          </Select>
          <FormDescription>
            Select the REX receipt location ID associated with this contract
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReceiptLocationField;
