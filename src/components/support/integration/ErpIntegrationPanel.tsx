
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, RefreshCw } from 'lucide-react';
import { ErpIntegrationProvider } from './context';
import ConfigurationTab from './tabs/ConfigurationTab';
import FieldMappingTab from './tabs/FieldMappingTab';
import SyncHistoryTab from './tabs/SyncHistoryTab';

interface ErpIntegrationPanelProps {
  onClose: () => void;
}

const ErpIntegrationPanel: React.FC<ErpIntegrationPanelProps> = ({ onClose }) => {
  return (
    <ErpIntegrationProvider>
      <Card className="border-2 border-primary/10">
        <CardHeader className="bg-muted/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>ERP Integration for Vendor Sync</CardTitle>
              <CardDescription>Configure bi-directional synchronization with your ERP system</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="configuration">
            <TabsList className="mb-4">
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="fieldMapping">Field Mapping</TabsTrigger>
              <TabsTrigger value="syncHistory">Sync History</TabsTrigger>
            </TabsList>

            <TabsContent value="configuration">
              <ConfigurationTab />
            </TabsContent>

            <TabsContent value="fieldMapping">
              <FieldMappingTab />
            </TabsContent>

            <TabsContent value="syncHistory">
              <SyncHistoryTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ErpIntegrationProvider>
  );
};

export default ErpIntegrationPanel;
