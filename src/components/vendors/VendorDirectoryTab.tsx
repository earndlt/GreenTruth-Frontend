
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Plus, Upload, Download, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useErpIntegration } from '@/components/support/integration/context';
import VendorDetailsView from './VendorDetailsView';
import VendorTable from './components/VendorTable';
import VendorSearchBar from './components/VendorSearchBar';
import { useVendorDirectory } from './hooks/useVendorDirectory';
import { useUser } from '@/context/UserContext';

interface VendorDirectoryTabProps {
  onAddVendorClick: () => void;
  companyId: string;
  companyName: string;
}

const VendorDirectoryTab: React.FC<VendorDirectoryTabProps> = ({ 
  onAddVendorClick, 
  companyId, 
  companyName 
}) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedVendor,
    setSelectedVendor,
    filteredVendors,
  } = useVendorDirectory(companyId); // Pass companyId to filter vendors
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { syncEnabled, handleSyncNow, isLoading } = useErpIntegration();
  const { subscription } = useUser();

  // Integration Hub access: requires 'integration-hub' in org's subscription.addons
  const hasIntegrationHub = subscription?.addons?.includes('integration-hub');

  const handleViewVendor = (vendorId: string) => {
    setSelectedVendor(vendorId);
  };

  const closeVendorDetails = () => {
    setSelectedVendor(null);
  };

  const getVendorDetails = (vendorId: string) => {
    return filteredVendors.find(vendor => vendor.id === vendorId);
  };

  // Updated per requirement: Always show button, but only enabled if Integration Hub enabled
  const handleErpSync = () => {
    // Direct to Integration Hub and highlight ERP Sync if eligible
    if (hasIntegrationHub) {
      navigate('/integration-hub', { state: { autoOpenErpPanel: true } });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Vendor Directory: {companyName}</CardTitle>
            <CardDescription>Manage your vendor relationships and information for {companyName}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleErpSync}
              disabled={!hasIntegrationHub}
              className={
                !hasIntegrationHub 
                  ? "bg-background border border-input text-muted-foreground pointer-events-none opacity-60"
                  : ""
              }
            >
              <Database className="h-4 w-4 mr-2" />
              {isLoading ? "Syncing..." : "Sync with ERP"}
            </Button>
            <Button size="sm" onClick={onAddVendorClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <VendorSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <VendorTable 
          vendors={filteredVendors}
          onViewVendor={handleViewVendor}
          companyName={companyName}
        />
      </CardContent>

      {selectedVendor && (
        <Sheet open={!!selectedVendor} onOpenChange={closeVendorDetails}>
          <SheetContent className="w-[90%] sm:max-w-[800px]">
            <SheetHeader>
              <SheetTitle>Vendor Details - {companyName}</SheetTitle>
            </SheetHeader>
            <VendorDetailsView 
              vendor={getVendorDetails(selectedVendor)} 
              onClose={closeVendorDetails}
              companyName={companyName}
            />
          </SheetContent>
        </Sheet>
      )}
    </Card>
  );
};

export default VendorDirectoryTab;
