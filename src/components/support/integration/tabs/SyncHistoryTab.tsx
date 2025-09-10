
import React from 'react';
import { useErpIntegration } from '../context';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const SyncHistoryTab: React.FC = () => {
  const {
    syncEnabled,
    lastSynced,
    isLoading,
    handleSave,
    handleSyncNow,
    testStatus
  } = useErpIntegration();

  if (!syncEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Sync Not Configured</h3>
        <p className="text-center text-muted-foreground mb-4">
          You need to configure and save your ERP integration settings before synchronization can begin.
        </p>
        <Button onClick={handleSave} disabled={testStatus !== 'success'}>
          Configure Sync
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Sync Status: 
            <span className="text-green-500 ml-2">Active</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {lastSynced 
              ? `Last synced: ${new Date(lastSynced).toLocaleString()}`
              : "No synchronization performed yet"}
          </p>
        </div>
        <Button 
          className="flex items-center gap-2" 
          onClick={handleSyncNow}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
          {isLoading ? "Syncing..." : "Sync Now"}
        </Button>
      </div>
      
      <div className="border rounded-md p-4 bg-muted/50 mt-4">
        <h4 className="font-medium mb-2">Upcoming Scheduled Syncs</h4>
        <ul className="space-y-2">
          <li className="text-sm flex justify-between">
            <span>Next daily sync:</span>
            <span className="font-medium">Tomorrow at 3:00 AM</span>
          </li>
          <li className="text-sm flex justify-between">
            <span>Next weekly full sync:</span>
            <span className="font-medium">Sunday at 1:00 AM</span>
          </li>
        </ul>
      </div>

      <div className="border rounded-md p-4 mt-4">
        <h4 className="font-medium mb-2">Recent Sync Activity</h4>
        {lastSynced ? (
          <ul className="space-y-3">
            <li className="text-sm border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium">{new Date(lastSynced).toLocaleString()}</span>
                <span className="text-green-500">Successful</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Synchronized 45 vendors: 32 updated, 8 created, 5 unchanged
              </p>
            </li>
            <li className="text-sm border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium">{new Date(Date.now() - 86400000).toLocaleString()}</span>
                <span className="text-green-500">Successful</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Synchronized 42 vendors: 10 updated, 2 created, 30 unchanged
              </p>
            </li>
            <li className="text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{new Date(Date.now() - 172800000).toLocaleString()}</span>
                <span className="text-amber-500">Partial</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Synchronized 40 vendors: 15 updated, 0 created, 25 unchanged, 3 failed
              </p>
            </li>
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No sync history available yet</p>
        )}
      </div>
    </div>
  );
};

export default SyncHistoryTab;
