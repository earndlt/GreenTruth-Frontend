
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, BookOpen, TicketIcon, Code, Info } from 'lucide-react';
import KnowledgeBase from '@/components/support/KnowledgeBase';
import SupportTicket from '@/components/support/SupportTicket';
import HubspotChat from '@/components/support/HubspotChat';
import ApiDocumentation from '@/components/support/api-docs/ApiDocumentation';

const Support = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'knowledge-base';
  const autoOpenErpPanel = searchParams.get('erp-integration') === 'true';
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <HelpCircle className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-bold">Help & Support</h1>
      </div>
      
      <div className="mb-6 bg-muted/30 rounded-lg p-4 flex items-center">
        <Info className="h-6 w-6 mr-3 text-blue-500" />
        <div>
          <h2 className="font-medium">New to GreenTruth?</h2>
          <p className="text-sm text-muted-foreground">Check out our detailed platform overview in the Knowledge Base for features, pricing, and technical architecture.</p>
        </div>
      </div>
      
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="knowledge-base" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="support-ticket" className="flex items-center">
            <TicketIcon className="mr-2 h-4 w-4" />
            Submit a Ticket
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge-base">
          <KnowledgeBase />
        </TabsContent>
        
        <TabsContent value="support-ticket">
          <SupportTicket />
        </TabsContent>
      </Tabs>
      
      <HubspotChat />
    </div>
  );
};

export default Support;
