
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Users, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Stakeholders form schema
const stakeholdersSchema = z.object({
  stakeholders: z.string().min(10, 'Stakeholder information should be more detailed'),
  regulatoryBodies: z.string().min(10, 'Regulatory bodies information should be more detailed'),
  supplyChainFactors: z.string().min(10, 'Supply chain factors should be more detailed'),
  interestAreas: z.string().min(10, 'Areas of interest should be more detailed'),
});

type StakeholdersFormValues = z.infer<typeof stakeholdersSchema>;

const BusinessStakeholdersForm = () => {
  const { toast } = useToast();
  
  // Default values for the form - in a real implementation, these would come from an API
  const defaultValues: StakeholdersFormValues = {
    stakeholders: 'Shareholders, employees, local communities in operational areas, environmental NGOs, industry partners.',
    regulatoryBodies: 'EPA, Department of Energy, California Air Resources Board, European Union Emissions Trading System, local environmental agencies.',
    supplyChainFactors: 'Global oil and gas supply chains, renewable energy component suppliers, regional distribution networks, local contractors and service providers.',
    interestAreas: 'Carbon emission reduction, renewable energy transition, methane leak reduction, water conservation in operations, community engagement programs.',
  };

  const form = useForm<StakeholdersFormValues>({
    resolver: zodResolver(stakeholdersSchema),
    defaultValues,
  });

  const onSubmit = (data: StakeholdersFormValues) => {
    // In a real implementation, this would call an API to update the profile
    console.log('Stakeholders data:', data);
    
    toast({
      title: "Stakeholders updated",
      description: "Your business context information has been successfully updated.",
      duration: 3000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Business Context
        </CardTitle>
        <CardDescription>
          Define your key stakeholders and areas of interest to help our AI provide more relevant insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="stakeholders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Stakeholders</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List your key stakeholders (e.g., shareholders, employees, local communities)" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This helps our AI understand who your company impacts and is accountable to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="regulatoryBodies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Regulatory Bodies</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List regulatory bodies relevant to your operations (e.g., EPA, SEC)" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This helps our AI track relevant regulations for your company.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="supplyChainFactors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supply Chain Factors</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe key supply chain factors (e.g., global suppliers, manufacturing locations)" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This helps our AI understand your supply chain dynamics.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interestAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Areas of Interest</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List your primary areas of interest (e.g., carbon reduction, water conservation)" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This helps our AI prioritize information relevant to your focus areas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="mt-4">
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BusinessStakeholdersForm;
