
import React from 'react';
import { CheckCircle, Users, Building, Globe } from 'lucide-react';
import { VendorDistributionOption } from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import VendorContactsForm from './VendorContactsForm';
import { useRfpForm } from '../context/RfpFormContext';
import ExistingVendorSelector, { Vendor } from './vendor-selection/ExistingVendorSelector';

interface VendorSelectionStepProps {
  vendorOptions: VendorDistributionOption[];
  toggleVendorOption: (id: string) => void;
}

const VendorSelectionStep: React.FC<VendorSelectionStepProps> = ({
  vendorOptions,
  toggleVendorOption
}) => {
  const { 
    selectedCategory,
    selectedVendors,
    setSelectedVendors 
  } = useRfpForm();

  const specificVendorsSelected = vendorOptions.find(opt => opt.id === 'specific-vendors')?.selected;
  const bothOptionsSelected = vendorOptions.find(opt => opt.id === 'both')?.selected;

  // Show vendor contacts form if specific vendors or both options are selected
  const showVendorContactsForm = specificVendorsSelected || bothOptionsSelected;

  const handleVendorSelection = (vendors: Vendor[]) => {
    setSelectedVendors(vendors);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Vendor Distribution</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose how you'd like to distribute this RFP to potential vendors
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {vendorOptions.map((option) => (
          <Card 
            key={option.id}
            className={cn(
              "cursor-pointer transition-all border-2",
              option.selected ? "border-primary shadow-md" : "border-border"
            )}
            onClick={() => toggleVendorOption(option.id)}
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-start gap-4">
              <div className={cn(
                "rounded-full p-2 w-10 h-10 flex items-center justify-center",
                option.selected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {option.id === 'specific-vendors' && <Building className="h-5 w-5" />}
                {option.id === 'earndlt-community' && <Globe className="h-5 w-5" />}
                {option.id === 'both' && <Users className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <CardTitle className="text-base flex items-center justify-between">
                  {option.name}
                  {option.selected && <CheckCircle className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Show existing vendor selector if specific vendors or both are selected */}
      {showVendorContactsForm && (
        <div className="space-y-6 mt-2">
          <ExistingVendorSelector 
            productCategory={selectedCategory}
            onSelectVendors={handleVendorSelection}
            selectedVendors={selectedVendors}
          />
          
          <div className="border-t border-border pt-6">
            <VendorContactsForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorSelectionStep;
