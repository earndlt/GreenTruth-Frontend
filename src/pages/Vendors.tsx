
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VendorDiscovery from '@/components/vendor-discovery/VendorDiscovery';
import RfiResponsesTab from '@/components/procurement/rfi/RfiResponsesTab';
import VendorDirectoryTab from '@/components/vendors/VendorDirectoryTab';
import AddVendorDialog from '@/components/vendors/AddVendorDialog';
import { ErpIntegrationProvider } from '@/components/support/integration/context';
import CompanySelector from '@/components/eac-registry/CompanySelector';
import { Company } from '@/components/eac-registry/CompanySelector';
import { corporateWallets } from '@/data/corporateWallets';
import { useUser } from '@/context/UserContext';

const Vendors = () => {
  const [isAddVendorDialogOpen, setIsAddVendorDialogOpen] = useState(false);

  // Convert wallet entities to companies for selector
  const companies: Company[] = corporateWallets.map(wallet => ({
    id: wallet.id,
    name: wallet.name,
    walletId: wallet.walletId,
  }));

  // ---- Start filter logic for current user's assigned entities ----
  const { assignedEntities, isAdmin } = useUser();
  
  // If user is admin, show all companies, otherwise filter by assigned entities
  const visibleCompanies = isAdmin 
    ? companies 
    : companies.filter(company => assignedEntities.includes(company.id));

  // If user has no assigned companies/entities, nothing to show:
  if (visibleCompanies.length === 0) {
    return (
      <div className="p-8 text-center text-lg text-muted-foreground">
        You have not been assigned to any corporate entities. Please contact your administrator.
      </div>
    );
  }

  // Set default selected company as first that is assigned to user
  const [selectedCompany, setSelectedCompany] = useState<Company>(visibleCompanies[0]);

  useEffect(() => {
    // If assignment changes, always ensure selectedCompany is valid:
    if (!visibleCompanies.some(c => c.id === selectedCompany.id)) {
      setSelectedCompany(visibleCompanies[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedEntities, visibleCompanies.length]);

  const handleAddVendorClick = () => {
    setIsAddVendorDialogOpen(true);
  };

  const handleSelectCompany = (companyId: string) => {
    const company = visibleCompanies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
        
        <CompanySelector 
          companies={visibleCompanies}
          selectedCompany={selectedCompany}
          onSelectCompany={handleSelectCompany}
        />
      </div>
      
      <ErpIntegrationProvider>
        <Tabs defaultValue="directory">
          <TabsList>
            <TabsTrigger value="directory">Directory</TabsTrigger>
            <TabsTrigger value="discovery">Discovery</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          </TabsList>
          
          <TabsContent value="directory" className="pt-4">
            <VendorDirectoryTab 
              onAddVendorClick={handleAddVendorClick}
              companyId={selectedCompany.id}
              companyName={selectedCompany.name}
            />
          </TabsContent>
          
          <TabsContent value="discovery" className="pt-4">
            <VendorDiscovery companyId={selectedCompany.id} companyName={selectedCompany.name} />
          </TabsContent>
          
          <TabsContent value="onboarding" className="pt-4">
            <RfiResponsesTab companyId={selectedCompany.id} />
          </TabsContent>
        </Tabs>
      </ErpIntegrationProvider>
      
      <AddVendorDialog 
        open={isAddVendorDialogOpen} 
        onOpenChange={setIsAddVendorDialogOpen}
        companyId={selectedCompany.id}
        companyName={selectedCompany.name}
      />
    </div>
  );
};

export default Vendors;
