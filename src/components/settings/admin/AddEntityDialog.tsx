
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, Shield, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { WalletEntity } from '@/types/wallet';
import { useToast } from '@/hooks/use-toast';

// Generate a random wallet ID (in a real app this would be done on the backend)
const generateWalletId = () => {
  return `0x${Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)).join('')}`;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Entity name must be at least 2 characters." }),
  division: z.string().optional(),
  duns: z.string().min(9, { message: "DUNS number must be at least 9 characters." }),
  taxId: z.string().min(9, { message: "Tax ID must be at least 9 characters." }),
  address: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zip: z.string().min(5, { message: "ZIP code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
});

interface AddEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEntity: (entity: WalletEntity) => void;
}

const AddEntityDialog = ({ open, onOpenChange, onAddEntity }: AddEntityDialogProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      division: "",
      duns: "",
      taxId: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "USA",
    },
  });

  const verifyWithDnB = async (data: z.infer<typeof formSchema>) => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    // This would be an actual API call to D&B KYC service in a real app
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful verification
      setVerificationResult({
        success: true,
        message: "Entity successfully verified with Dun & Bradstreet",
        details: {
          riskScore: "Low",
          foundationDate: "2005-03-15",
          status: "Active",
          lastUpdated: new Date().toISOString(),
        }
      });
      
      return true;
    } catch (error) {
      setVerificationResult({
        success: false,
        message: "Verification failed. Please check the provided information.",
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // First verify with D&B
    const isVerified = await verifyWithDnB(data);
    
    if (isVerified) {
      // Create new entity
      const newEntity: WalletEntity = {
        id: uuidv4(),
        name: data.name,
        walletId: generateWalletId(),
        ...(data.division && { division: data.division }),
        holdings: [] // Initialize with empty holdings
      };
      
      // Add the entity
      onAddEntity(newEntity);
      
      // Show success toast
      toast({
        title: "Entity Added Successfully",
        description: `${data.name} has been added and KYC verified.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Corporate Entity</DialogTitle>
          <DialogDescription>
            Add a new corporate entity and run KYC verification through Dun & Bradstreet.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter corporate entity name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division/Subsidiary</FormLabel>
                    <FormControl>
                      <Input placeholder="Division or subsidiary (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DUNS Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="D&B DUNS Number" {...field} />
                    </FormControl>
                    <FormDescription>
                      9-digit identifier assigned by Dun & Bradstreet
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID (EIN)*</FormLabel>
                    <FormControl>
                      <Input placeholder="Tax Identification Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address*</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City*</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State*</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP*</FormLabel>
                      <FormControl>
                        <Input placeholder="ZIP Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country*</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {verificationResult && (
              <div className={`p-4 rounded-md border ${verificationResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start">
                  <Shield className={`h-5 w-5 mt-0.5 ${verificationResult.success ? 'text-green-600' : 'text-red-600'}`} />
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${verificationResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {verificationResult.success ? 'Verification Successful' : 'Verification Failed'}
                    </h3>
                    <div className="mt-1 text-sm text-gray-700">
                      <p>{verificationResult.message}</p>
                      {verificationResult.details && (
                        <div className="mt-2 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>Risk Score: {verificationResult.details.riskScore}</div>
                            <div>Founded: {verificationResult.details.foundationDate}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              {!verificationResult?.success ? (
                <Button type="submit" disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Building className="mr-2 h-4 w-4" />
                      Verify & Add Entity
                    </>
                  )}
                </Button>
              ) : (
                <Button type="button" onClick={() => onOpenChange(false)}>
                  Complete
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntityDialog;
