
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, CircleAlert, Info } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import AssignedEntitiesSelector from '@/components/settings/admin/dialogs/AssignedEntitiesSelector';
import { Company } from '@/components/eac-registry/CompanySelector';
import { corporateWallets } from '@/data/corporateWallets';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SuccessStepProps {
  vendorData: any;
  foundInSystem: boolean;
  inviteSent: boolean;
  onFinish: () => void;
  companyName?: string;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ 
  vendorData, 
  foundInSystem, 
  inviteSent,
  onFinish,
  companyName
}) => {
  const { assignedEntities, isAdmin } = useUser();
  
  // Convert wallet entities to companies for selector
  const companies: Company[] = corporateWallets.map(wallet => ({
    id: wallet.id,
    name: wallet.name,
    walletId: wallet.walletId,
  }));

  // If user is admin, show all companies, otherwise filter by assigned entities
  const visibleCompanies = isAdmin 
    ? companies 
    : companies.filter(company => assignedEntities.includes(company.id));

  // Initialize with current company already selected
  const currentCompanyId = visibleCompanies.find(c => c.name === companyName)?.id;
  const [selectedEntities, setSelectedEntities] = useState<string[]>(
    currentCompanyId ? [currentCompanyId] : []
  );

  const handleEntityChange = (entityId: string) => {
    setSelectedEntities(current =>
      current.includes(entityId)
        ? current.filter(id => id !== entityId)
        : [...current, entityId]
    );
  };

  const handleFinish = () => {
    // TODO: In a future implementation, this would trigger creating the vendor
    // in multiple entity directories based on selectedEntities
    onFinish();
  };

  return (
    <div className="space-y-6 py-6">
      <div className="text-center">
        <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        
        <h2 className="text-xl font-semibold mt-4">
          {foundInSystem ? "Vendor Added" : "Vendor Created"}
        </h2>
        
        <p className="text-muted-foreground max-w-md mx-auto mt-2">
          {vendorData.name} has been successfully {foundInSystem ? "added to" : "created in"} your 
          vendor directory{companyName ? ` for ${companyName}` : ''}.
          {inviteSent && " An invitation has been sent to the vendor."}
        </p>
      </div>

      <div className="bg-muted p-4 rounded-md text-left mt-6">
        <h3 className="text-sm font-medium mb-2">Vendor Details</h3>
        <div className="space-y-1">
          <div className="flex items-start">
            <span className="font-medium text-sm min-w-[120px]">ID:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-mono">{vendorData.id || "Not assigned"}</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    Vendor IDs follow the format: [EntityHash]-[VendorHash]<br />
                    This ensures uniqueness across corporate entities.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-start">
            <span className="font-medium text-sm min-w-[120px]">Name:</span>
            <span className="text-sm">{vendorData.name}</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium text-sm min-w-[120px]">Category:</span>
            <span className="text-sm">{vendorData.category || "Not specified"}</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium text-sm min-w-[120px]">Email:</span>
            <span className="text-sm">{vendorData.email || "Not specified"}</span>
          </div>
        </div>
      </div>

      {visibleCompanies.length > 1 && (
        <div className="border p-4 rounded-md">
          <h3 className="text-sm font-medium mb-4">Add to Additional Corporate Entities</h3>
          <AssignedEntitiesSelector
            companies={visibleCompanies}
            assignedEntities={selectedEntities}
            handleEntityChange={handleEntityChange}
          />
        </div>
      )}
      
      {!inviteSent && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-start space-x-2 text-left">
          <CircleAlert className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Vendor Not Notified</p>
            <p className="text-sm text-amber-700 mt-1">
              The vendor has not been notified. You can invite them from the vendor details page at any time.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button onClick={handleFinish}>
          Finish
        </Button>
      </div>
    </div>
  );
};

export default SuccessStep;
