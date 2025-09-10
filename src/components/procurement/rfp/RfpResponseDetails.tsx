
import React, { useState } from 'react';
import { RfpResponse } from './types/RfpResponseTypes';
import { ResponseContent } from './components/details/ResponseContent';
import { LlmEvaluation } from './components/details/LlmEvaluation';
import { ManualGrading } from './components/details/ManualGrading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import ContractUploadDialog from '../steps/contract/ContractUploadDialog';
import PurchaseOrderDialog from '../steps/purchase/PurchaseOrderDialog';
import { useToast } from '@/hooks/use-toast';

interface RfpResponseDetailsProps {
  response: RfpResponse;
  onAddVendor: () => void;
}

const RfpResponseDetails: React.FC<RfpResponseDetailsProps> = ({ response, onAddVendor }) => {
  const [activeTab, setActiveTab] = useState('response');
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const { toast } = useToast();

  const handleApproveResponse = () => {
    setShowContractDialog(true);
  };

  const handleContractContinue = () => {
    setShowContractDialog(false);
    setShowPurchaseDialog(true);
  };

  const handlePurchaseOrderSubmit = () => {
    setShowPurchaseDialog(false);
    toast({
      title: "Success",
      description: "Purchase order has been created and vendor has been added",
    });
    onAddVendor();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{response.vendorName}</h2>
          <p className="text-muted-foreground">Response for: {response.rfpTitle}</p>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-xs text-muted-foreground">
              Received on {response.receivedDate}
            </span>
          </div>
        </div>
        
        <Button onClick={handleApproveResponse} className="ml-auto">
          <Check className="mr-2 h-4 w-4" /> Approve Response
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="response">Response Content</TabsTrigger>
          <TabsTrigger value="evaluation">LLM Evaluation</TabsTrigger>
          <TabsTrigger value="manual-grading">Manual Grading</TabsTrigger>
        </TabsList>
        
        <TabsContent value="response" className="pt-4">
          <ResponseContent response={response} onNavigate={setActiveTab} />
        </TabsContent>
        
        <TabsContent value="evaluation" className="pt-4">
          <LlmEvaluation response={response} onNavigate={setActiveTab} />
        </TabsContent>
        
        <TabsContent value="manual-grading" className="pt-4">
          <ManualGrading 
            response={response} 
            onNavigate={setActiveTab}
            onAddVendor={onAddVendor}
          />
        </TabsContent>
      </Tabs>

      <ContractUploadDialog
        open={showContractDialog}
        onOpenChange={setShowContractDialog}
        onContinue={handleContractContinue}
        onSkip={() => setShowPurchaseDialog(true)}
      />

      <PurchaseOrderDialog
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        vendorName={response.vendorName}
        onSubmit={handlePurchaseOrderSubmit}
      />
    </div>
  );
};

export default RfpResponseDetails;
