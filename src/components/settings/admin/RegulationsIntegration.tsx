
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRegulations } from '@/context/RegulationsContext';
import { Database, RefreshCw, Shield, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';

const RegulationsIntegration: React.FC = () => {
  const { 
    lastSync, 
    syncFrequency, 
    setSyncFrequency, 
    syncRegulations, 
    syncInProgress,
    documents,
    error
  } = useRegulations();
  
  const { toast } = useToast();
  
  const handleSyncNow = async () => {
    try {
      await syncRegulations(true);
    } catch (error) {
      console.error('Error triggering manual sync:', error);
    }
  };
  
  const formatLastSync = () => {
    if (!lastSync) return 'Never';
    
    try {
      const syncDate = new Date(lastSync);
      return `${formatDistanceToNow(syncDate)} ago (${format(syncDate, 'PPP p')})`;
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Regulations.gov Integration</CardTitle>
          <CardDescription>
            Configure automatic sync with U.S. regulatory information
          </CardDescription>
        </div>
        <Shield className="h-5 w-5 text-primary" />
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Sync Frequency</h3>
              <Select 
                value={syncFrequency}
                onValueChange={(value) => {
                  setSyncFrequency(value as 'daily' | 'weekly' | 'monthly');
                  toast({
                    title: "Sync frequency updated",
                    description: `Regulations will now sync ${value}`,
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Last Synchronization</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{formatLastSync()}</span>
                {lastSync && (
                  <Badge variant="outline" className="ml-2">
                    {documents.length} documents
                  </Badge>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleSyncNow}
                disabled={syncInProgress}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncInProgress ? 'animate-spin' : ''}`} />
                {syncInProgress ? 'Syncing...' : 'Sync Now'}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium">Sync Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Integration Status</h3>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                Connected
              </Badge>
              <span className="text-sm">API key is valid and integration is active</span>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              This integration automatically syncs relevant U.S. regulations from Regulations.gov based on your organization's products and business profile.
            </p>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Data Sources</h3>
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Regulations.gov API v4</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulationsIntegration;
