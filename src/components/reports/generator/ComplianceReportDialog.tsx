
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const regulationOptions = [
  { id: 'eu-methane', name: 'EU Methane Regulation' },
  { id: 'us-epa', name: 'US EPA Gas Reporting Requirements' },
  { id: 'uk-ofgem', name: 'UK OFGEM Standards' },
  { id: 'imeo', name: 'IMEO Measurement Standards' },
  { id: 'cert-mrf', name: 'Certified MRF Protocol' },
];

export const productOptions = [
  { id: 'lng', name: 'LNG' },
  { id: 'natural-gas', name: 'Natural Gas' },
  { id: 'methanol', name: 'Methanol' },
  { id: 'ammonia', name: 'Ammonia' },
  { id: 'carbon-credits', name: 'Carbon Credits' },
];

// Form schema for compliance report parameters
export const complianceFormSchema = z.object({
  regulation: z.string({
    required_error: "Please select a regulation",
  }),
  product: z.string({
    required_error: "Please select a product",
  }),
  region: z.string().optional(),
  dateRange: z.string().optional(),
});

export type ComplianceFormValues = z.infer<typeof complianceFormSchema>;

interface ComplianceReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ComplianceFormValues) => void;
}

const ComplianceReportDialog: React.FC<ComplianceReportDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit 
}) => {
  const form = useForm<ComplianceFormValues>({
    resolver: zodResolver(complianceFormSchema),
    defaultValues: {
      regulation: "",
      product: "",
      region: "",
      dateRange: "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compliance Report Parameters</DialogTitle>
          <DialogDescription>
            Select the regulation and product for your compliance report.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="regulation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regulation</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select regulation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regulationOptions.map((regulation) => (
                        <SelectItem key={regulation.id} value={regulation.id}>
                          {regulation.name}
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
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. EU, North America" {...field} />
                  </FormControl>
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

export default ComplianceReportDialog;
