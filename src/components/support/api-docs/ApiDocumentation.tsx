
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, RefreshCw } from "lucide-react";
import ErpIntegrationPanel from '../integration/ErpIntegrationPanel';
import ApiTabs from './ApiTabs';
import GettingStartedSection from './GettingStartedSection';
import ApiAccessTab from '@/components/settings/ApiAccessTab';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ApiDocumentationProps {
  autoOpenErpPanel?: boolean;
  initialAccessTab?: boolean;
}

const ApiDocumentation = ({ autoOpenErpPanel = false, initialAccessTab = false }: ApiDocumentationProps) => {
  const [showErpPanel, setShowErpPanel] = React.useState(!!autoOpenErpPanel);
  const [activeTab, setActiveTab] = useState<'reference' | 'access'>(initialAccessTab ? 'access' : 'reference');
  const [showIntegrationGuides, setShowIntegrationGuides] = useState(false);

  React.useEffect(() => {
    if (autoOpenErpPanel) {
      setShowErpPanel(true);
    }
  }, [autoOpenErpPanel]);

  React.useEffect(() => {
    if (initialAccessTab) {
      setActiveTab('access');
    }
  }, [initialAccessTab]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>GreenTruth API Documentation</CardTitle>
              <CardDescription>
                Comprehensive API documentation for integrating with GreenTruth systems
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => setShowErpPanel(true)}
              >
                <RefreshCw className="h-4 w-4" />
                Configure ERP Sync
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => setShowIntegrationGuides(true)}
              >
                <BookOpen className="h-4 w-4" />
                Integration Guides
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => window.open('/docs/api-reference.md', '_blank')}
              >
                <Code className="h-4 w-4" />
                API Reference
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {showErpPanel && (
            <div className="mb-6">
              <ErpIntegrationPanel onClose={() => setShowErpPanel(false)} />
            </div>
          )}

          {/* API Docs Tabs: Reference vs Access */}
          <div className="mb-4 flex gap-3">
            <button
              className={`px-3 py-1.5 rounded font-medium ${activeTab === 'reference' ? 'bg-muted text-primary' : 'hover:bg-accent'}`}
              onClick={() => setActiveTab('reference')}
            >
              API Reference
            </button>
            <button
              className={`px-3 py-1.5 rounded font-medium ${activeTab === 'access' ? 'bg-muted text-primary' : 'hover:bg-accent'}`}
              onClick={() => setActiveTab('access')}
            >
              API Access & Keys
            </button>
          </div>
          {activeTab === 'reference' && (
            <>
              <ApiTabs />
              <GettingStartedSection />
            </>
          )}
          {activeTab === 'access' && (
            <div className="pt-2">
              <ApiAccessTab />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Guides Dialog */}
      <Dialog open={showIntegrationGuides} onOpenChange={setShowIntegrationGuides}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">ERP & Carbon Accounting Integration Guides</h2>
            <p className="text-sm text-muted-foreground">
              Connect GreenTruth with your existing enterprise systems to streamline data flow and reporting
            </p>
            
            <div className="space-y-4">
              <IntegrationGuideItem 
                title="SAP Integration Guide" 
                description="Connect GreenTruth with SAP ERP and carbon accounting modules"
                path="/integration-hub/sap"
              />
              
              <IntegrationGuideItem 
                title="Microsoft Dynamics Integration" 
                description="Sync data between GreenTruth and Microsoft Dynamics 365"
                path="/integration-hub/microsoft"
              />
              
              <IntegrationGuideItem 
                title="Oracle ERP Cloud Integration" 
                description="Connect GreenTruth with Oracle ERP Cloud and environmental reporting"
                path="/integration-hub/oracle"
              />
              
              <IntegrationGuideItem 
                title="Salesforce Integration" 
                description="Integrate GreenTruth with Salesforce Net Zero Cloud and CRM"
                path="/integration-hub/salesforce"
              />
              
              <IntegrationGuideItem 
                title="Siemens SiGreen Integration" 
                description="Connect GreenTruth with Siemens SiGreen for product carbon footprinting"
                path="/integration-hub/siemens"
              />
              
              <IntegrationGuideItem 
                title="Zapier & Automation Tools" 
                description="Create no-code workflows between GreenTruth and other systems"
                path="/integration-hub/automation"
              />
              
              <IntegrationGuideItem 
                title="Data Import/Export Guide" 
                description="Best practices for bulk data transfers with GreenTruth"
                path="/integration-hub/data-transfer"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for integration guide items
const IntegrationGuideItem = ({ title, description, path }: { title: string; description: string; path: string }) => (
  <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => window.open(path, '_blank')}
      >
        View Guide
      </Button>
    </div>
  </div>
);

export default ApiDocumentation;
