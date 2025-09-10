
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RfiResponseDetails from './RfiResponseDetails';
import { useToast } from '@/hooks/use-toast';
import ResponseTable from './components/ResponseTable';
import ResponseFilters from './components/ResponseFilters';
import { getStatusBadge } from './utils/statusUtils';
import { useRfiResponses } from './hooks/useRfiResponses';
import { RfiResponse } from './types/RfiTypes';
import AddVendorDialog from '@/components/vendors/AddVendorDialog';
import VendorRfiTable from './components/VendorRfiTable';

interface RfiResponsesTabProps {
  companyId?: string;
}

const RfiResponsesTab: React.FC<RfiResponsesTabProps> = ({ companyId }) => {
  const [selectedResponse, setSelectedResponse] = useState<RfiResponse | null>(null);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const { toast } = useToast();
  const {
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    filteredResponses,
    approveResponse
  } = useRfiResponses(companyId); // Pass company ID to filter responses

  const handleAddVendor = (response: RfiResponse) => {
    setSelectedResponse(response);
    setShowAddVendor(true);
  };

  const handleAddVendorDialogChange = (open: boolean) => {
    if (!open && selectedResponse) {
      approveResponse(selectedResponse.id);
      toast({
        title: "Success",
        description: "Vendor has been successfully added",
      });
      setSelectedResponse(null);
    }
    setShowAddVendor(open);
  };

  const { filteredResponses: allRfis } = useRfiResponses(companyId);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>RFI Responses</CardTitle>
            <CardDescription>Review and grade vendor responses to your RFIs</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ResponseFilters 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />

          <Tabs value={selectedTab} onValueChange={setSelectedTab} defaultValue="rfis">
            <TabsList>
              <TabsTrigger value="rfis">RFIs</TabsTrigger>
              <TabsTrigger value="all">All Responses</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
            </TabsList>

            <TabsContent value="rfis" className="pt-4">
              <h3 className="text-lg font-medium mb-4">System-Generated RFIs Sent to All Vendors</h3>
              <VendorRfiTable rfis={allRfis} showVendorColumn />
            </TabsContent>

            <TabsContent value="all" className="pt-4">
              <ResponseTable 
                responses={filteredResponses}
                onViewResponse={setSelectedResponse}
              />
            </TabsContent>
            
            <TabsContent value="new" className="pt-4">
              <ResponseTable 
                responses={filteredResponses.filter(r => r.status === 'new')} 
                onViewResponse={setSelectedResponse}
              />
            </TabsContent>
            
            <TabsContent value="reviewed" className="pt-4">
              <ResponseTable 
                responses={filteredResponses.filter(r => r.status === 'reviewed' || r.status === 'graded')} 
                onViewResponse={setSelectedResponse}
              />
            </TabsContent>
            
            <TabsContent value="approved" className="pt-4">
              <ResponseTable 
                responses={filteredResponses.filter(r => r.status === 'approved')} 
                onViewResponse={setSelectedResponse}
              />
            </TabsContent>
          </Tabs>
        </div>

        {selectedResponse && (
          <Dialog open={!!selectedResponse} onOpenChange={(open) => !open && setSelectedResponse(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>RFI Response: {selectedResponse.subject}</DialogTitle>
              </DialogHeader>
              <RfiResponseDetails 
                response={selectedResponse}
                onAddVendor={() => handleAddVendor(selectedResponse)}
              />
            </DialogContent>
          </Dialog>
        )}

        <AddVendorDialog 
          open={showAddVendor} 
          onOpenChange={handleAddVendorDialogChange}
          initialData={selectedResponse ? {
            name: selectedResponse.vendorName,
            // Use the vendor's contact email, NOT RFI/RFP special address
            email: selectedResponse.contactEmail || '',
            category: selectedResponse.category
          } : undefined}
          companyId={companyId}
        />
      </CardContent>
    </Card>
  );
};

export default RfiResponsesTab;
