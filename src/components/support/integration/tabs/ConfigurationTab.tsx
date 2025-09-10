
import React from 'react';
import { useErpIntegration } from '../context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Check, AlertTriangle } from 'lucide-react';

const ConfigurationTab: React.FC = () => {
  const {
    selectedErp,
    setSelectedErp,
    syncDirection,
    setSyncDirection,
    syncFrequency,
    setSyncFrequency,
    apiEndpoint,
    setApiEndpoint,
    apiKey,
    setApiKey,
    isLoading,
    isTesting,
    testStatus,
    handleTestConnection,
    handleSave,
    useErpVendorIds,
    setUseErpVendorIds,
  } = useErpIntegration();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="erp-system">ERP System</Label>
          <Select 
            value={selectedErp} 
            onValueChange={setSelectedErp}
          >
            <SelectTrigger id="erp-system">
              <SelectValue placeholder="Select ERP System" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sap">SAP</SelectItem>
              <SelectItem value="microsoft">Microsoft Dynamics</SelectItem>
              <SelectItem value="oracle">Oracle NetSuite</SelectItem>
              <SelectItem value="salesforce">Salesforce</SelectItem>
              <SelectItem value="custom">Custom API</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sync-direction">Sync Direction</Label>
          <Select 
            value={syncDirection} 
            onValueChange={setSyncDirection}
          >
            <SelectTrigger id="sync-direction">
              <SelectValue placeholder="Select Sync Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bidirectional">Bi-directional</SelectItem>
              <SelectItem value="push">Push Only (GreenTruth → ERP)</SelectItem>
              <SelectItem value="pull">Pull Only (ERP → GreenTruth)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sync-frequency">Sync Frequency</Label>
          <Select 
            value={syncFrequency} 
            onValueChange={setSyncFrequency}
          >
            <SelectTrigger id="sync-frequency">
              <SelectValue placeholder="Select Sync Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="manual">Manual Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <Label htmlFor="api-endpoint">API Endpoint</Label>
          <Input 
            id="api-endpoint" 
            placeholder="https://your-erp-system.com/api" 
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="api-key">API Key/Token</Label>
          <Input 
            id="api-key" 
            type="password" 
            placeholder="Enter your API key" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      </div>

      {/* NEW: Vendor ID precedence control */}
      <div className="flex items-center gap-4 mt-6 rounded-md border p-4 bg-muted/40">
        <Switch
          id="vendor-id-precedence"
          checked={useErpVendorIds}
          onCheckedChange={setUseErpVendorIds}
        />
        <div>
          <Label htmlFor="vendor-id-precedence" className="cursor-pointer">
            <span className="font-medium">ERP Vendor ID takes precedence</span>
          </Label>
          <p className="text-xs text-muted-foreground mt-1 max-w-[440px]">
            If enabled, Vendor IDs assigned by your ERP system will be used as the primary ID for vendor records during synchronization.
            If disabled, GreenTruth will use its own 8-digit vendor ID based on the full vendor name (CRC32 hash).
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center pt-4 gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isTesting || !apiEndpoint || !apiKey}
          >
            {isTesting ? "Testing..." : "Test Connection"}
          </Button>
          {testStatus === 'success' && (
            <span className="text-green-500 flex items-center gap-1">
              <Check className="h-4 w-4" /> Connected
            </span>
          )}
          {testStatus === 'error' && (
            <span className="text-red-500 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Failed
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            onClick={handleSave}
            disabled={isLoading || testStatus !== 'success'}
          >
            {isLoading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationTab;

