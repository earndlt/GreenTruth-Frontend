
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const llmPreferencesSchema = z.object({
  aiPersona: z.string().min(2, 'AI persona description must be at least 2 characters'),
  voiceStyle: z.string().min(1, 'Voice style is required'),
  citationStyle: z.string().min(1, 'Citation style is required'),
  responseLength: z.string().min(1, 'Response length preference is required'),
  technicalLevel: z.string().min(1, 'Technical level is required'),
  additionalInstructions: z.string().optional(),
});

type LlmPreferencesFormValues = z.infer<typeof llmPreferencesSchema>;

const LlmPreferencesForm = () => {
  const { toast } = useToast();
  
  // Default values for the form - in a real implementation, these would come from an API
  const defaultValues: LlmPreferencesFormValues = {
    aiPersona: 'Professional, factual advisor focusing on regulatory compliance and environmental standards',
    voiceStyle: 'professional',
    citationStyle: 'apa',
    responseLength: 'balanced',
    technicalLevel: 'medium',
    additionalInstructions: 'Focus on compliance with international standards. Highlight financial implications of regulatory changes.',
  };

  const form = useForm<LlmPreferencesFormValues>({
    resolver: zodResolver(llmPreferencesSchema),
    defaultValues,
  });

  const onSubmit = (data: LlmPreferencesFormValues) => {
    // In a real implementation, this would call an API to update the LLM preferences
    console.log('LLM preferences data:', data);
    
    // Store in localStorage for demo purposes
    localStorage.setItem('llmPreferences', JSON.stringify(data));
    
    toast({
      title: "AI preferences updated",
      description: "Your Greentruth AI preferences have been successfully updated.",
      duration: 3000,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Greentruth AI Preferences</h2>
        </div>
        
        <FormField
          control={form.control}
          name="aiPersona"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Persona Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe how you want the AI to present itself" 
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Define the tone and personality of the Greentruth AI when interacting with your team.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="voiceStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voice Style</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                    <SelectItem value="direct">Direct and Concise</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="simplified">Simplified</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How the AI should communicate in written responses.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="citationStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Citation Style</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select citation style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="apa">APA Style</SelectItem>
                    <SelectItem value="mla">MLA Style</SelectItem>
                    <SelectItem value="chicago">Chicago Style</SelectItem>
                    <SelectItem value="harvard">Harvard Style</SelectItem>
                    <SelectItem value="reference-only">Reference Only</SelectItem>
                    <SelectItem value="links">Hyperlinks</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Format for citations in AI responses.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="responseLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Response Length</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select response length" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Preferred level of detail in responses.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="technicalLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select technical level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basic">Basic (Non-Technical)</SelectItem>
                    <SelectItem value="medium">Medium (Some Technical Details)</SelectItem>
                    <SelectItem value="high">High (Technical)</SelectItem>
                    <SelectItem value="expert">Expert (Highly Technical)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Level of technical language in AI responses.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="additionalInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Instructions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any other specific preferences or instructions for the AI" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide any additional guidance for how the AI should respond to queries.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="mt-4">
          Save AI Preferences
        </Button>
      </form>
    </Form>
  );
};

export default LlmPreferencesForm;
