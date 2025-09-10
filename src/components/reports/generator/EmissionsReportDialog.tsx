
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { productOptions } from './ComplianceReportDialog';

export const carbonStandardOptions = [
  { id: 'ghg-protocol', name: 'GHG Protocol' },
  { id: 'iso-14064', name: 'ISO 14064' },
  { id: 'pef', name: 'Product Environmental Footprint (PEF)' },
  { id: 'pcaf', name: 'Partnership for Carbon Accounting Financials' },
  { id: 'sbti', name: 'Science Based Targets initiative' },
];

export const scopeOptions = [
  { id: 'scope-1', name: 'Scope 1 (Direct Emissions)' },
  { id: 'scope-2', name: 'Scope 2 (Indirect Emissions)' },
  { id: 'scope-3', name: 'Scope 3 (Value Chain Emissions)' },
  { id: 'all-scopes', name: 'All Scopes' },
];

// Form schema for emissions report parameters
export const emissionsFormSchema = z.object({
  standard: z.string({
    required_error: "Please select a carbon accounting standard",
  }),
  product: z.string({
    required_error: "Please select a product",
  }),
  scope: z.string().optional(),
  dateRange: z.string().optional(),
});

export type EmissionsFormValues = z.infer<typeof emissionsFormSchema>;

interface EmissionsReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EmissionsFormValues) => void;
}

const EmissionsReportDialog: React.FC<EmissionsReportDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit 
}) => {
  const form = useForm<EmissionsFormValues>({
    resolver: zodResolver(emissionsFormSchema),
    defaultValues: {
      standard: "",
      product: "",
      scope: "",
      dateRange: "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Carbon Emissions Report Parameters</DialogTitle>
          <DialogDescription>
            Select the carbon accounting standard and product for your emissions report.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="standard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carbon Accounting Standard</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select standard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carbonStandardOptions.map((standard) => (
                        <SelectItem key={standard.id} value={standard.id}>
                          {standard.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productOptions.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emission Scope (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {scopeOptions.map((scope) => (
                        <SelectItem key={scope.id} value={scope.id}>
                          {scope.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Range (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Q1 2025" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Generate Report
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmissionsReportDialog;
