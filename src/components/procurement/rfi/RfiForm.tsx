
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DiscoveredVendor } from '@/components/vendor-discovery/VendorDiscovery';

const formSchema = z.object({
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  dueDate: z.string(),
  additionalInformation: z.string().optional(),
  requestFinancials: z.boolean().default(false),
  requestCertifications: z.boolean().default(true),
  requestInsurance: z.boolean().default(false),
});

export interface RfiFormProps {
  vendors: DiscoveredVendor[];
  onSubmit: (data: any) => void;
  companyName?: string;
}

const RfiForm: React.FC<RfiFormProps> = ({ vendors, onSubmit, companyName = '' }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: `RFI: Information request for ${vendors[0]?.category || 'products/services'}`,
      dueDate: (() => {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date.toISOString().slice(0, 10);
      })(),
      additionalInformation: '',
      requestFinancials: false,
      requestCertifications: true,
      requestInsurance: false,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      vendors: vendors.map(v => v.name).join(', '),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
        {companyName && (
          <div className="bg-muted/50 p-4 rounded-md mb-4">
            <p className="text-sm font-medium">Sending RFI from: {companyName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              The RFI will be sent on behalf of {companyName} to {vendors.length} selected vendor(s)
            </p>
          </div>
        )}
        
        <div className="bg-muted/50 p-4 rounded-md mb-4">
          <h3 className="text-sm font-medium">Selected Vendors:</h3>
          <ul className="mt-2 space-y-1">
            {vendors.map((vendor) => (
              <li key={vendor.id} className="text-sm flex items-center">
                <span className="h-2 w-2 rounded-full bg-primary mr-2" />
                {vendor.name} ({vendor.category})
              </li>
            ))}
          </ul>
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This will be used as the subject line for the RFI email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response Due Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                When do you need responses by?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalInformation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional details or specific questions..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide any specific information you'd like to request from the vendors.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Request Documents</h3>
          
          <FormField
            control={form.control}
            name="requestCertifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Request Certifications
                  </FormLabel>
                  <FormDescription>
                    Request environmental and quality certifications
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="requestFinancials"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Request Financial Information
                  </FormLabel>
                  <FormDescription>
                    Request company financial statements
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="requestInsurance"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Request Insurance Information
                  </FormLabel>
                  <FormDescription>
                    Request proof of insurance and coverage details
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Generate RFI Draft
        </Button>
      </form>
    </Form>
  );
};

export default RfiForm;
