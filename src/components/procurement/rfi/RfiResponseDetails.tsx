
import React, { useState } from 'react';
import { RfiResponse } from './types/RfiTypes';
import { ResponseContent } from './components/details/ResponseContent';
import { LlmEvaluation } from './components/details/LlmEvaluation';
import { ManualGrading } from './components/details/ManualGrading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RfiResponseDetailsProps {
  response: RfiResponse;
  onAddVendor: () => void;
}

const RfiResponseDetails: React.FC<RfiResponseDetailsProps> = ({ response, onAddVendor }) => {
  const [activeTab, setActiveTab] = useState('response');
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{response.vendorName}</h2>
          <p className="text-muted-foreground">Response for: {response.subject}</p>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-xs text-muted-foreground">
              Received on {response.receivedDate}
            </span>
          </div>
        </div>

        <Button onClick={onAddVendor} className="ml-auto">
          <UserPlus className="mr-2 h-4 w-4" /> Add Vendor
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
    </div>
  );
};

export default RfiResponseDetails;
