
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Lock, Building, Globe } from 'lucide-react';

export type VisibilityOption = 'private' | 'company' | 'community';

interface DocumentVisibilityDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (visibility: VisibilityOption) => void;
  selectionMode?: boolean; // Optional flag to indicate pre-selection mode
}

const formSchema = z.object({
  visibility: z.enum(['private', 'company', 'community'] as const),
});

const DocumentVisibilityDialog = ({ open, onClose, onConfirm, selectionMode = false }: DocumentVisibilityDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visibility: 'private',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onConfirm(values.visibility);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{selectionMode ? "Document Visibility" : "Set Document Visibility"}</DialogTitle>
          <DialogDescription>
            {selectionMode 
              ? "Choose who will be able to access documents you're about to upload."
              : "Choose who can access the documents you are uploading."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pt-2">
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid gap-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <RadioGroupItem value="private" />
                      </FormControl>
                      <Lock className="h-5 w-5 text-primary" />
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        <div className="font-medium">Private</div>
                        <div className="text-sm text-muted-foreground">Only you can access this document</div>
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <RadioGroupItem value="company" />
                      </FormControl>
                      <Building className="h-5 w-5 text-primary" />
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        <div className="font-medium">Company-wide</div>
                        <div className="text-sm text-muted-foreground">Everyone in your organization can access this document</div>
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <RadioGroupItem value="community" />
                      </FormControl>
                      <Globe className="h-5 w-5 text-primary" />
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        <div className="font-medium">GreenTruth Community</div>
                        <div className="text-sm text-muted-foreground">Share with all GreenTruth platform users</div>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button type="submit">
                {selectionMode ? "Continue" : "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentVisibilityDialog;
