
import React from 'react';
import { MatchedEAC } from '../../types';
import { formatNumber } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getReceiptLocationNameById } from '../../utils/receiptLocations';

interface EacListViewProps {
  matchedEACs: MatchedEAC[];
  selectedPipeline: "REX" | "Ruby";
}

const EacListView: React.FC<EacListViewProps> = ({ matchedEACs, selectedPipeline }) => {
  const [expandedEacs, setExpandedEacs] = React.useState<Record<string, boolean>>({});

  const toggleEac = (eacId: string) => {
    setExpandedEacs(prev => ({
      ...prev,
      [eacId]: !prev[eacId]
    }));
  };

  if (!matchedEACs || matchedEACs.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No matching EACs found. Try adjusting your search criteria.</p>
      </div>
    );
  }
  
  console.log("EacListView rendering with", matchedEACs.length, "EACs");
  
  return (
    <div className="space-y-4" data-testid="eac-list-view">
      <p className="text-sm text-muted-foreground">
        Environmental Attribute Certificates linked to contract · {matchedEACs.length} Found
      </p>
      
      {matchedEACs.map((eac) => (
        <div 
          key={eac.id} 
          className="border rounded-md overflow-hidden bg-white shadow-sm"
          data-testid={`eac-item-${eac.id}`}
        >
          <div className="flex justify-between items-start p-4 border-b">
            <div>
              <div className="flex items-center">
                <h3 className="text-md font-semibold text-slate-900">{eac.id}</h3>
                <Badge className="ml-2" variant="outline">
                  {eac.emissionPoint.charAt(0).toUpperCase() + eac.emissionPoint.slice(1)}
                  {eac.emissionPoint === 'thermal' && eac.qetCompatible && ' • Carbon Offset'}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-md font-bold">{formatNumber(eac.volume)} MMBtu</div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 border-b">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Contract ID:</p>
                <p className="text-sm font-medium">K# {eac.contractId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Upstream Contract:</p>
                <p className="text-sm font-medium">K# {eac.upstreamContractId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Downstream Contract:</p>
                <p className="text-sm font-medium">K# {eac.downstreamContractId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {eac.emissionPoint === 'transportation' ? "Path:" : "Source Facility:"}
                </p>
                <p className="text-sm font-medium">
                  {eac.emissionPoint === 'transportation' && eac.receiptLocationId ? (
                    <>
                      {eac.receiptLocationId} - {getReceiptLocationNameById(eac.receiptLocationId) || 'Unknown Location'}
                    </>
                  ) : (
                    eac.sourceFacility
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Emission Factor:</p>
                <p className="text-sm font-medium">{eac.emissionFactor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Time Range:</p>
                <p className="text-sm font-medium">{eac.timeRange}</p>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-2 flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-gray-900"
              onClick={() => toggleEac(eac.id)}
            >
              <span className="flex items-center">
                {expandedEacs[eac.id] ? (
                  <>Counterparty <ChevronUp className="ml-1 h-4 w-4" /></>
                ) : (
                  <>Counterparty <ChevronDown className="ml-1 h-4 w-4" /></>
                )}
              </span>
            </Button>
            <div className="text-sm">
              {eac.counterparty?.name ? (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {eac.counterparty.isApproved ? 'Approved' : ''}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-leaf-50 text-leaf-700 border-leaf-200">
                  Book & Claim
                </Badge>
              )}
            </div>
          </div>
          
          {expandedEacs[eac.id] && eac.counterparty && (
            <div className="px-4 py-3 bg-slate-50 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company:</p>
                  <p className="text-sm font-medium">{eac.counterparty.name}</p>
                </div>
                {eac.counterparty.contactName && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact:</p>
                    <p className="text-sm font-medium">{eac.counterparty.contactName}</p>
                  </div>
                )}
                {eac.counterparty.email && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email:</p>
                    <p className="text-sm font-medium">{eac.counterparty.email}</p>
                  </div>
                )}
                {eac.counterparty.phone && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone:</p>
                    <p className="text-sm font-medium">{eac.counterparty.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EacListView;
