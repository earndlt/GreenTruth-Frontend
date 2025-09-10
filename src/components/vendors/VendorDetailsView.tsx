
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ShoppingCart } from 'lucide-react';
import CompanyInfo from './details/CompanyInfo';
import PaymentDeliveryTerms from './details/PaymentDeliveryTerms';
import TransactionHistory from './details/TransactionHistory';
import DocumentsSection from './details/DocumentsSection';
import { Transaction, Vendor } from './types/vendorTypes';
import { useRfiResponses } from '@/components/procurement/rfi/hooks/useRfiResponses';
import VendorRfiTable from '@/components/procurement/rfi/components/VendorRfiTable';
import ComplianceReportsModal from './reports/ComplianceReportsModal';

interface VendorDetailsViewProps {
  vendor: Vendor;
  onClose?: () => void;
  companyName?: string;
}

const transactions: Transaction[] = [
  { id: 't1', type: 'Purchase', amount: '$32,500', date: '2023-12-10', status: 'Completed' },
  { id: 't2', type: 'RFP Response', amount: '$18,750', date: '2023-11-15', status: 'Accepted' },
  { id: 't3', type: 'Purchase', amount: '$45,000', date: '2023-10-30', status: 'Completed' },
  { id: 't4', type: 'RFP Response', amount: '$28,400', date: '2023-09-22', status: 'Rejected' },
];

const VendorDetailsView: React.FC<VendorDetailsViewProps> = ({ vendor, onClose, companyName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  const { filteredResponses } = useRfiResponses();
  const vendorRfis = filteredResponses.filter(rfi => rfi.vendorName === vendor.name);

  const handleViewComplianceReports = () => {
    setIsReportsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-1">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">{vendor.name}</h2>
            {companyName && (
              <span className="text-sm text-muted-foreground">
                ({companyName})
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-muted-foreground select-all font-mono">
            Vendor ID: {vendor.id}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="rfis">RFIs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4 pt-4">
          <CompanyInfo vendor={vendor} />
          <PaymentDeliveryTerms vendor={vendor} />
          <div className="pt-4 flex items-center justify-between">
            <Button variant="outline" onClick={handleViewComplianceReports}>
              <FileText className="h-4 w-4 mr-2" />
              View Compliance Reports
            </Button>
            
            <Button>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Create Purchase Order
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="pt-4">
          <TransactionHistory vendor={vendor} transactions={transactions} />
        </TabsContent>
        
        <TabsContent value="documents" className="pt-4">
          <DocumentsSection vendor={vendor} />
        </TabsContent>

        <TabsContent value="rfis" className="pt-4">
          <h3 className="text-lg font-medium mb-4">
            System-Generated RFIs Sent to this Vendor
            {companyName && ` from ${companyName}`}
          </h3>
          <VendorRfiTable rfis={vendorRfis} />
        </TabsContent>
      </Tabs>
      
      {isReportsModalOpen && (
        <ComplianceReportsModal
          open={isReportsModalOpen}
          onClose={() => setIsReportsModalOpen(false)}
          vendorId={vendor.id}
          vendorName={vendor.name}
        />
      )}
    </div>
  );
};

export default VendorDetailsView;
