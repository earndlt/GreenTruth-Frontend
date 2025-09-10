
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RfiResponse } from '../types/RfiTypes';
import { generateRfpDraft } from '../../utils/generators/draftGenerator';
import { formatProductPolicies } from '../../utils/formatters/policyFormatter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useBusinessProfileForm } from '@/hooks/use-business-profile-form';

interface RfiDetailsDialogProps {
  rfi: RfiResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RfiDetailsDialog: React.FC<RfiDetailsDialogProps> = ({ rfi, open, onOpenChange }) => {
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { form } = useBusinessProfileForm();
  
  useEffect(() => {
    if (open && rfi) {
      setIsLoading(true);
      // Generate document from business profile, documents, and policies
      generateRfiDocument(rfi)
        .then(document => {
          setGeneratedDocument(document);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error generating RFI document:", error);
          setGeneratedDocument("Error generating RFI document. Please try again later.");
          setIsLoading(false);
        });
    } else {
      setGeneratedDocument('');
    }
  }, [open, rfi, form]);

  const generateRfiDocument = async (rfi: RfiResponse): Promise<string> => {
    // Get the current business profile data from the form
    const businessProfile = {
      companyName: form.getValues('companyName'),
      industry: form.getValues('industry'),
      mission: form.getValues('mission'),
      sustainabilityGoals: form.getValues('sustainabilityGoals')
    };

    // Mock RFP data for generation
    const mockRfpData = {
      title: `Request for Information: ${rfi.subject}`,
      selectedCategory: {
        id: "category-" + Math.random().toString(36).substring(2, 10),
        name: rfi.category,
        description: `Category for ${rfi.category} related products and services`
      },
      selectedMrvSubcategories: [],
      selectedAttributes: [
        { 
          id: "attr-1", 
          name: "Carbon footprint", 
          description: "Measurement and reporting of carbon emissions", 
          selected: true 
        },
        { 
          id: "attr-2", 
          name: "Renewable energy usage", 
          description: "Percentage of operations powered by renewable energy", 
          selected: true 
        },
        { 
          id: "attr-3", 
          name: "Sustainability certification", 
          description: "Third-party verification of sustainability practices", 
          selected: true 
        }
      ],
      customAttributes: "EAC delivery capabilities, ESG compliance documentation",
      selectedVendorOption: null,
      vendorContacts: [],
      timeline: [
        { 
          enabled: true, 
          label: "Response deadline", 
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          description: "All responses must be received by this date"
        }
      ]
    };

    try {
      // Generate document using existing RFP generator but customized for RFI
      const document = await generateRfpDraft(mockRfpData, businessProfile);
      
      // Modify the generated document to be more RFI-specific
      const rfiDocument = document
        .replace(/REQUEST FOR PROPOSAL/g, "REQUEST FOR INFORMATION")
        .replace(/RFP/g, "RFI")
        .replace(/proposals/g, "information")
        .replace(/proposal/g, "response");
      
      return rfiDocument;
    } catch (error) {
      console.error("Error generating RFI document:", error);
      return "Failed to generate RFI document. Please try again.";
    }
  };

  if (!rfi) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>RFI Details: {rfi.subject}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="summary" className="mt-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="document">Generated Document</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4 mt-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Vendor</h3>
              <p className="text-base">{rfi.vendorName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="font-mono text-sm">{rfi.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <div className="flex items-center">
                <span className="capitalize">{rfi.status}</span>
                {rfi.status === "approved" && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-xs">
                    Approved
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
              <p>{rfi.category}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Received Date</h3>
              <p>{rfi.receivedDate}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="document" className="mt-2">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm p-4 border rounded-md bg-muted/50">
                  {generatedDocument}
                </pre>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RfiDetailsDialog;
