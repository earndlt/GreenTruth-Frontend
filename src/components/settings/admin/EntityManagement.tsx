
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Search, Clock, Info } from 'lucide-react';
import AddEntityDialog from './AddEntityDialog';
import { corporateWallets } from '@/data/corporateWallets';
import { WalletEntity } from '@/types/wallet';

const EntityManagement = () => {
  const [entities, setEntities] = useState<WalletEntity[]>(corporateWallets);
  const [isAddEntityDialogOpen, setIsAddEntityDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEntity = (newEntity: WalletEntity) => {
    setEntities([...entities, newEntity]);
    setIsAddEntityDialogOpen(false);
  };

  const refreshEntities = () => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Corporate Entities</CardTitle>
          <CardDescription>
            Manage corporate entities and verify their identity
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={refreshEntities}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddEntityDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Entity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* 24-Hour Approval Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-blue-900">
                Approval Process Timeline
              </h3>
              <p className="text-sm text-blue-800">
                Corporate entity verification and approval may take up to <strong>24 hours</strong> to complete. 
                You will receive a notification once the process is finished.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-700">
                <Info className="h-3 w-3" />
                <span>This includes D&B verification, compliance checks, and internal review processes.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search entities..."
            className="w-full rounded-md border border-input pl-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        
        <div className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-5 p-4 text-xs font-medium text-muted-foreground">
              <div>Name</div>
              <div>Wallet ID</div>
              <div>Type</div>
              <div>KYC Status</div>
              <div>Actions</div>
            </div>
            {entities.map((entity) => (
              <div key={entity.id} className="grid grid-cols-5 p-4 border-t items-center">
                <div className="font-medium">{entity.name}</div>
                <div className="font-mono text-xs truncate">{entity.walletId.substring(0, 10)}...</div>
                <div>{entity.division || 'Corporate'}</div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Verified
                  </span>
                </div>
                <div>
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <AddEntityDialog 
        open={isAddEntityDialogOpen} 
        onOpenChange={setIsAddEntityDialogOpen}
        onAddEntity={handleAddEntity}
      />
    </Card>
  );
};

export default EntityManagement;
