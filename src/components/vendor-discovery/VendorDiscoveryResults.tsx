
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VendorCard from './results/VendorCard';
import NoVendorsFound from './results/NoVendorsFound';
import VendorComparisonTable from './VendorComparisonTable';
import VendorActionButtons from './results/VendorActionButtons';
import { Checkbox } from '@/components/ui/checkbox';
import { DiscoveredVendor } from './VendorDiscovery';

interface VendorDiscoveryResultsProps {
  vendors: DiscoveredVendor[];
  onVendorSelect?: (vendor: DiscoveredVendor, isSelected: boolean) => void;
  selectedVendors?: DiscoveredVendor[];
  onSendRfi: () => void;
  onCreateRfp: () => void;
  companyName?: string;
}

const VendorDiscoveryResults: React.FC<VendorDiscoveryResultsProps> = ({ 
  vendors, 
  onVendorSelect, 
  selectedVendors = [],
  onSendRfi,
  onCreateRfp,
  companyName = ''
}) => {
  const [viewingVendor, setViewingVendor] = useState<DiscoveredVendor | null>(null);

  if (!vendors.length) {
    return <NoVendorsFound companyName={companyName} />;
  }

  const isSelected = (vendorId: string) => {
    return selectedVendors.some(v => v.id === vendorId);
  };

  const handleSelectVendor = (vendor: DiscoveredVendor, checked: boolean) => {
    if (onVendorSelect) {
      onVendorSelect(vendor, checked);
    }
  };

  const handleViewDetails = (vendor: DiscoveredVendor) => {
    setViewingVendor(vendor);
    // In a real application, this might open a modal or navigate to a details page
  };

  // Convert selectedVendors to just an array of IDs for the comparison table
  const selectedVendorIds = selectedVendors.map(vendor => vendor.id);

  // Handler for the comparison table vendor selection
  const handleComparisonTableSelect = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor && onVendorSelect) {
      const isCurrentlySelected = isSelected(vendorId);
      onVendorSelect(vendor, !isCurrentlySelected);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Found {vendors.length} potential vendors for {companyName}
        </h2>
        <VendorActionButtons 
          selectedCount={selectedVendors.length}
          onSendRfi={onSendRfi}
          onCreateRfp={onCreateRfp}
          companyName={companyName}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="relative overflow-hidden">
            {onVendorSelect && (
              <div className="absolute top-2 right-2 z-10">
                <Checkbox
                  checked={isSelected(vendor.id)}
                  onCheckedChange={(checked) => 
                    handleSelectVendor(vendor, checked as boolean)
                  }
                />
              </div>
            )}
            <VendorCard 
              vendor={vendor} 
              selected={isSelected(vendor.id)}
              onSelect={(vendorId) => {
                const vendor = vendors.find(v => v.id === vendorId);
                if (vendor && onVendorSelect) {
                  onVendorSelect(vendor, !isSelected(vendorId));
                }
              }}
              onViewDetails={handleViewDetails}
              companyName={companyName}
            />
          </Card>
        ))}
      </div>
      
      {vendors.length > 1 && (
        <div className="pt-4">
          <h3 className="text-lg font-medium mb-4">Vendor Comparison for {companyName}</h3>
          <VendorComparisonTable 
            vendors={vendors} 
            selectedVendors={selectedVendorIds}
            onSelectVendor={handleComparisonTableSelect}
          />
        </div>
      )}
    </div>
  );
};

export default VendorDiscoveryResults;
