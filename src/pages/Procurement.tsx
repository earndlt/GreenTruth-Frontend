
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, ShoppingCart } from 'lucide-react';
import { ProcurementProvider } from '@/components/procurement/context/ProcurementContext';
import CreatePurchaseOrderDialog from '@/components/procurement/purchase/CreatePurchaseOrderDialog';
import ProductProcurementPolicies from '@/components/procurement/ProductProcurementPolicies';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import RfpResponsesTab from '@/components/procurement/rfp/RfpResponsesTab';
import CreateRfpDialog from '@/components/procurement/CreateRfpDialog';
import RfpsTab from '@/components/procurement/RfpsTab';
import DraftsTab from '@/components/procurement/DraftsTab';
import CompanySelector from '@/components/eac-registry/CompanySelector';
import { Company } from '@/components/eac-registry/CompanySelector';
import { corporateWallets } from '@/data/corporateWallets';

const Procurement = () => {
  const { subscription, assignedEntities, isAdmin } = useUser();
  const navigate = useNavigate();
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  
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

  // If user has no assigned companies/entities, show message
  if (visibleCompanies.length === 0) {
    return (
      <div className="p-8 text-center text-lg text-muted-foreground">
        You have not been assigned to any corporate entities. Please contact your administrator.
      </div>
    );
  }

  const [selectedCompany, setSelectedCompany] = useState<Company>(visibleCompanies[0]);

  useEffect(() => {
    if (!visibleCompanies.some(c => c.id === selectedCompany.id)) {
      setSelectedCompany(visibleCompanies[0]);
    }
  }, [assignedEntities, visibleCompanies.length]);

  const handleSelectCompany = (companyId: string) => {
    const company = visibleCompanies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
    }
  };
  
  return (
    <ProcurementProvider>
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Procurement</h1>
          
          <CompanySelector 
            companies={visibleCompanies}
            selectedCompany={selectedCompany}
            onSelectCompany={handleSelectCompany}
          />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button onClick={() => setIsPurchaseDialogOpen(true)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
              <CreateRfpDialog />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="rfp-responses">
          <TabsList>
            <TabsTrigger value="policies">Product Policies</TabsTrigger>
            <TabsTrigger value="rfps">RFPs</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="rfp-responses">RFP Responses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="policies" className="space-y-4 pt-4">
            <ProductProcurementPolicies selectedCompanyId={selectedCompany.id} />
          </TabsContent>
          
          <TabsContent value="rfps" className="space-y-4 pt-4">
            <RfpsTab companyId={selectedCompany.id} />
          </TabsContent>
          
          <TabsContent value="drafts" className="pt-4">
            <DraftsTab companyId={selectedCompany.id} />
          </TabsContent>
          
          <TabsContent value="rfp-responses" className="pt-4">
            <RfpResponsesTab companyId={selectedCompany.id} />
          </TabsContent>
        </Tabs>
      </div>
      <CreatePurchaseOrderDialog 
        open={isPurchaseDialogOpen} 
        onOpenChange={setIsPurchaseDialogOpen}
      />
    </ProcurementProvider>
  );
};

export default Procurement;
