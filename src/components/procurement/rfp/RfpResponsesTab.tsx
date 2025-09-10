
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ResponseFilters from './components/ResponseFilters';
import ResponseTable from './components/ResponseTable';
import RfpResponseDetails from './RfpResponseDetails';
import { RfpResponse } from './types/RfpResponseTypes';

interface RfpResponsesTabProps {
  companyId: string;
}

const RfpResponsesTab: React.FC<RfpResponsesTabProps> = ({ companyId }) => {
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  
  // Example data - in a real app, this would be fetched based on companyId
  const mockResponses: RfpResponse[] = [
    {
      id: 'resp1',
      vendorName: 'EcoGas Solutions',
      rfpTitle: 'RNG Supply for Q3-Q4 2025',
      submittedDate: '2025-03-15',
      status: 'new',
      score: null,
      email: 'contact@ecogassolutions.com',
      receivedDate: '2025-03-15',
      contactEmail: 'contact@ecogassolutions.com',
    },
    {
      id: 'resp2',
      vendorName: 'GreenFuel Inc.',
      rfpTitle: 'RNG Supply for Q3-Q4 2025',
      submittedDate: '2025-03-14',
      status: 'reviewed',
      score: 87,
      email: 'info@greenfuel.com',
      receivedDate: '2025-03-14',
      contactEmail: 'info@greenfuel.com',
      subject: 'Response to RNG Supply RFP',
      category: 'Energy',
      llmScore: {
        overall: 87,
        procurement: 85,
        environmental: 90,
        esg: 86
      }
    },
    {
      id: 'resp3',
      vendorName: 'CarbonTrust LLC',
      rfpTitle: 'Carbon Credits - Forestry Projects',
      submittedDate: '2025-03-12',
      status: 'shortlisted',
      score: 92,
      email: 'sales@carbontrust.com',
      receivedDate: '2025-03-12',
      contactEmail: 'sales@carbontrust.com',
      subject: 'Forestry Carbon Credits Response',
      category: 'Carbon Credits'
    }
  ];

  // Filter the responses based on the current filter
  const filteredResponses = currentFilter === 'all' 
    ? mockResponses 
    : mockResponses.filter(response => response.status === currentFilter);

  const getSelectedResponse = () => {
    return mockResponses.find(response => response.id === selectedResponseId) || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">RFP Responses</h3>
        <Button variant="outline" size="sm">Export</Button>
      </div>
      
      <ResponseFilters currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} />
      
      {selectedResponseId ? (
        <RfpResponseDetails 
          response={getSelectedResponse()!} 
          onAddVendor={() => setSelectedResponseId(null)} 
        />
      ) : (
        <ResponseTable 
          responses={filteredResponses} 
          onViewDetails={setSelectedResponseId} 
        />
      )}
    </div>
  );
};

export default RfpResponsesTab;
