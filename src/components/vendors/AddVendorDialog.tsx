import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import VendorSearchStep from "./add-vendor/VendorSearchStep";
import VendorDetailsForm from "./add-vendor/VendorDetailsForm";
import InviteVendorStep from "./add-vendor/InviteVendorStep";
import SuccessStep from "./add-vendor/SuccessStep";
import { generateVendorId } from "./utils/vendorIdGenerator";
import {
  VendorFormValues,
  NewVendorData,
} from "./add-vendor/types/vendorFormTypes";

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    name: string;
    email: string;
    category: string;
  };
  companyId?: string;
  companyName?: string;
}

type Step = "search" | "details" | "invite" | "success";

const AddVendorDialog: React.FC<AddVendorDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  companyId,
  companyName,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(
    initialData ? "details" : "search"
  );
  const [vendorData, setVendorData] = useState<any>(initialData || null);
  const [foundVendor, setFoundVendor] = useState<boolean | null>(null);
  const [sendInvite, setSendInvite] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCurrentStep("details");
      setVendorData(initialData);
    }
  }, [initialData]);

  const handleVendorSearch = (result: { found: boolean; data?: any }) => {
    setFoundVendor(result.found);
    if (result.found && result.data) {
      setVendorData(result.data);
      setCurrentStep("success");
    } else {
      setCurrentStep("details");
    }
  };

  const handleVendorDetails = (data: VendorFormValues, invite: boolean) => {
    // Use the company name or a default value for entity name
    const entityName = companyName || "Default Entity";

    // Generate a system vendor ID based on the vendor name and entity name
    const vendorId = generateVendorId(data.name, entityName);

    // Create a complete vendor record
    const newVendor: NewVendorData = {
      ...data,
      id: vendorId,
      complianceScore: 0, // New vendors start with 0
      status: "active",
      lastTransaction: new Date().toISOString(),
      companyId: companyId || "acme-corp", // Associate with selected company
    };

    setVendorData(newVendor);
    setSendInvite(invite);

    if (invite) {
      setCurrentStep("invite");
    } else {
      setCurrentStep("success");
    }
  };

  const handleInviteComplete = () => {
    setCurrentStep("success");
  };

  const handleClose = () => {
    setTimeout(() => {
      setCurrentStep("search");
      setVendorData(null);
      setFoundVendor(null);
      setSendInvite(false);
    }, 300);
    onOpenChange(false);
  };

  const handleFinish = () => {
    handleClose();
  };

  // Ensure we have a proper vendor ID displayed in success step
  const ensureProperVendorId = () => {
    if (
      vendorData &&
      vendorData.name &&
      companyName &&
      (!vendorData.id || vendorData.id === "v2")
    ) {
      // Force regenerate proper ID if it's missing or incorrect
      vendorData.id = generateVendorId(vendorData.name, companyName);
    }
  };

  // Call this whenever we're about to show the success step
  if (currentStep === "success") {
    ensureProperVendorId();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Add Vendor {companyName && `to ${companyName}`}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          {currentStep === "search" && !initialData && (
            <div className="space-y-6">
              {companyName && (
                <div className="bg-muted/50 p-4 rounded-md mb-4">
                  <p className="text-sm font-medium">
                    Adding vendor for: {companyName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This vendor will be associated with {companyName} and will
                    appear in their vendor directory
                  </p>
                </div>
              )}

              <Tabs defaultValue="search" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="search">
                    <Search className="h-4 w-4 mr-2" />
                    Search Existing Vendor
                  </TabsTrigger>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="pt-4">
                  <VendorSearchStep onVendorSearch={handleVendorSearch} />
                </TabsContent>

                <TabsContent value="manual" className="pt-4">
                  <div className="text-center py-6">
                    <Button onClick={() => setCurrentStep("details")}>
                      Continue to Manual Entry
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentStep === "details" && (
            <div>
              {companyName && (
                <div className="bg-muted/50 p-4 rounded-md mb-4">
                  <p className="text-sm font-medium">
                    Adding vendor for: {companyName}
                  </p>
                </div>
              )}
              <VendorDetailsForm
                onSubmit={handleVendorDetails}
                initialData={vendorData}
              />
            </div>
          )}

          {currentStep === "invite" && (
            <InviteVendorStep
              vendorData={vendorData}
              onComplete={handleInviteComplete}
              companyName={companyName}
            />
          )}

          {currentStep === "success" && (
            <SuccessStep
              vendorData={vendorData}
              foundInSystem={!!foundVendor}
              inviteSent={sendInvite}
              onFinish={handleFinish}
              companyName={companyName}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddVendorDialog;
