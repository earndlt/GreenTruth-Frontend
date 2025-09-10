import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ApiAccessTab = () => {
  const [activeTab, setActiveTab] = useState('keys');
  const [erpSyncEnabled, setErpSyncEnabled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEnableErpSync = () => {
    setErpSyncEnabled(true);
    toast({
      title: "ERP Sync Enabled",
      description: "Navigate to the configuration page to setup your integration"
    });
  };

  const navigateToApiDocs = () => {
    // Navigate to new Integration Hub page
    navigate('/integration-hub');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Access</CardTitle>
        <CardDescription>
          Manage API keys and access for integrations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="erp">ERP Integration</TabsTrigger>
            <TabsTrigger value="origins">Allowed Origins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keys" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex space-x-2">
                <Input 
                  id="api-key" 
                  defaultValue="••••••••••••••••••••••••••••••" 
                  disabled 
                  className="font-mono"
                />
                <Button variant="outline">Reveal</Button>
                <Button variant="outline">Regenerate</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last used: 2 hours ago
              </p>
            </div>
            
            <div className="space-y-2 mt-6">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <div className="flex space-x-2">
                <Input 
                  id="webhook-url" 
                  value="https://api.greentruth.com/webhook/vendor-updates" 
                  disabled 
                  className="font-mono"
                />
                <Button variant="outline">Copy</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use this URL to receive vendor updates from external systems
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="erp" className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Vendor Synchronization with ERP</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable bi-directional sync between GreenTruth vendors and your ERP system
                  </p>
                </div>
                <Switch 
                  checked={erpSyncEnabled}
                  onCheckedChange={setErpSyncEnabled}
                />
              </div>
              
              {erpSyncEnabled ? (
                <div className="mt-4 space-y-4">
                  <div className="text-sm">
                    <span className="font-medium block">Status:</span>
                    <span className="text-amber-500">Not configured</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild>
                      <Link to="/support">
                        Configure Integration
                      </Link>
                    </Button>
                    
                    <Button variant="outline" disabled>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <Button onClick={handleEnableErpSync}>
                    Enable ERP Sync
                  </Button>
                </div>
              )}
            </div>
            
            <div className="rounded-md border p-4 bg-muted/30">
              <h3 className="font-medium mb-2">Benefits of ERP Integration</h3>
              <ul className="space-y-1 text-sm">
                <li>• Automatically sync vendor records between systems</li>
                <li>• Ensure consistent vendor information across your organization</li>
                <li>• Reduce manual data entry and potential errors</li>
                <li>• Keep compliance status synchronized</li>
              </ul>
              
              <div className="mt-4">
                <Button variant="link" size="sm" className="flex items-center p-0" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Learn more about ERP integration
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="origins" className="space-y-4">
            <div className="space-y-2">
              <Label>Allowed Origins</Label>
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">https://yourcompany.com</span>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">https://analytics.yourcompany.com</span>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Add New Origin
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-muted/30 flex justify-between">
        <p className="text-xs text-muted-foreground">
          For security, API keys are never displayed in full
        </p>
        <Button variant="ghost" size="sm" onClick={navigateToApiDocs}>
          View API Documentation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiAccessTab;
