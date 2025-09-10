
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search } from 'lucide-react';
import { SearchFormValues, searchFormSchema } from './search/types';
import MainSearchFields from './search/MainSearchFields';
import PolicyConsiderationsSection from './search/PolicyConsiderationsSection';
import LocationField from './search/LocationField';
import SpecificationsField from './search/SpecificationsField';

interface VendorSearchFormProps {
  onSearch: (data: SearchFormValues) => void;
  isSearching: boolean;
  companyName?: string;
}

const VendorSearchForm: React.FC<VendorSearchFormProps> = ({ 
  onSearch, 
  isSearching, 
  companyName = '' 
}) => {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      productType: '',
      productSpecifications: '',
      productionLocation: '',
      considerProcurementPolicy: true,
      considerEnvironmentalPolicy: true,
      considerEsgPolicy: true,
      additionalRequirements: '',
    },
  });

  const handleSubmit = (data: SearchFormValues) => {
    onSearch(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {companyName && (
          <div className="bg-muted/50 p-4 rounded-md mb-4">
            <p className="text-sm font-medium">Searching for vendors for: {companyName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Vendors discovered will be matched against {companyName}'s procurement policies and requirements
            </p>
          </div>
        )}

        <MainSearchFields form={form} />
        
        <LocationField form={form} />
        
        <SpecificationsField form={form} />

        <PolicyConsiderationsSection form={form} companyName={companyName} />

        <FormField
          control={form.control}
          name="additionalRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Requirements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Describe any additional requirements or context for ${companyName ? companyName + "'s" : "your"} vendor search...`}
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide any specific details that will help identify the right vendors
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSearching} className="w-full">
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Find Matching Vendors
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default VendorSearchForm;
