
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RfiResponse } from '@/components/procurement/rfi/types/RfiTypes';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, UserPlus } from 'lucide-react';

interface VendorResponse {
  id: string;
  vendorName: string;
  type: 'RFP' | 'RFI';
  date: string;
  status: 'pending' | 'reviewed' | 'onboarded';
  score?: number;
  isExistingVendor: boolean;
}

// Sample data - in a real app this would come from your backend
const sampleResponses: VendorResponse[] = [
  {
    id: '1',
    vendorName: 'EcoGas Solutions',
    type: 'RFP',
    date: '2024-04-15',
    status: 'reviewed',
    score: 92,
    isExistingVendor: true
  },
  {
    id: '2',
    vendorName: 'Green Methanol Inc.',
    type: 'RFI',
    date: '2024-04-14',
    status: 'pending',
    score: 86,
    isExistingVendor: false
  },
  {
    id: '3',
    vendorName: 'CleanFuel Partners',
    type: 'RFP',
    date: '2024-04-13',
    status: 'onboarded',
    score: 88,
    isExistingVendor: false
  }
];

const VendorResponsesOverview = () => {
  const { toast } = useToast();

  const handleOnboard = (vendor: VendorResponse) => {
    toast({
      title: "Vendor Onboarding Initiated",
      description: `Started onboarding process for ${vendor.vendorName}`,
    });
  };

  const getStatusBadge = (status: VendorResponse['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending Review</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Reviewed</Badge>;
      case 'onboarded':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Onboarded</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Responses</CardTitle>
        <CardDescription>Review and onboard vendors from RFP and RFI responses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-7 p-3 text-xs font-medium text-muted-foreground bg-muted">
            <div className="col-span-2">Vendor Name</div>
            <div>Response Type</div>
            <div>Date</div>
            <div>Score</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          
          {sampleResponses.map((response) => (
            <div key={response.id} className="grid grid-cols-7 p-3 border-t items-center text-sm">
              <div className="col-span-2 font-medium flex items-center">
                {response.vendorName}
                {response.isExistingVendor && (
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                )}
              </div>
              <div>{response.type}</div>
              <div>{response.date}</div>
              <div>
                {response.score ? (
                  <div className="flex items-center">
                    <div className="w-full bg-muted rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          response.score >= 90 
                            ? 'bg-green-500' 
                            : response.score >= 70 
                            ? 'bg-amber-500' 
                            : 'bg-destructive'
                        }`} 
                        style={{ width: `${response.score}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{response.score}%</span>
                  </div>
                ) : (
                  "N/A"
                )}
              </div>
              <div>{getStatusBadge(response.status)}</div>
              <div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleOnboard(response)}
                  disabled={response.status === 'onboarded'}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {response.isExistingVendor ? 'Update' : 'Onboard'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorResponsesOverview;
