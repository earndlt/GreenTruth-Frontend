
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import VendorSearchForm from './VendorSearchForm';
import VendorDiscoveryResults from './VendorDiscoveryResults';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SendRfiDialog from '@/components/procurement/rfi/SendRfiDialog';

export type DiscoveredVendor = {
  id: string;
  name: string;
  matchScore: number;
  category: string;
  products: string[];
  sustainability: {
    score: number;
    certifications: string[];
  };
  location: string;
  description: string;
  complianceScore: number;
  policyMatch: {
    environmental: number;
    procurement: number;
    esg: number;
  };
};

// Sample discovered vendors data (in a real implementation, this would come from API)
const sampleVendors: DiscoveredVendor[] = [
  {
    id: '1',
    name: 'EcoGas Solutions',
    matchScore: 92,
    category: 'Natural Gas',
    products: ['Renewable Natural Gas', 'Low-carbon Gas'],
    sustainability: {
      score: 88,
      certifications: ['ISO 14001', 'Carbon Trust Standard'],
    },
    location: 'Texas, USA',
    description: 'Leading provider of low-carbon natural gas solutions with certified environmental practices.',
    complianceScore: 95,
    policyMatch: {
      environmental: 92,
      procurement: 90,
      esg: 94,
    },
  },
  {
    id: '2',
    name: 'Green Methanol Inc.',
    matchScore: 86,
    category: 'Methanol',
    products: ['Bio-methanol', 'Synthetic Methanol'],
    sustainability: {
      score: 85,
      certifications: ['ISCC PLUS', 'GreenCircle Certified'],
    },
    location: 'Louisiana, USA',
    description: 'Producer of sustainable methanol using innovative carbon capture technologies.',
    complianceScore: 88,
    policyMatch: {
      environmental: 85,
      procurement: 88,
      esg: 86,
    },
  },
  {
    id: '3',
    name: 'CleanFuel Partners',
    matchScore: 79,
    category: 'Natural Gas',
    products: ['CNG', 'Hydrogen-enriched Natural Gas'],
    sustainability: {
      score: 76,
      certifications: ['EcoVadis Gold'],
    },
    location: 'Oklahoma, USA',
    description: 'Innovative natural gas supplier focused on clean energy transitions.',
    complianceScore: 81,
    policyMatch: {
      environmental: 78,
      procurement: 81,
      esg: 79,
    },
  },
  {
    id: '4',
    name: 'SynthChem Solutions',
    matchScore: 74,
    category: 'Methanol',
    products: ['Industrial Methanol', 'Green Methanol'],
    sustainability: {
      score: 72,
      certifications: ['ISO 50001'],
    },
    location: 'California, USA',
    description: 'Chemical manufacturer specializing in low-carbon methanol production.',
    complianceScore: 75,
    policyMatch: {
      environmental: 73,
      procurement: 76,
      esg: 72,
    },
  },
];

interface VendorDiscoveryProps {
  companyId: string;
  companyName: string;
}

const VendorDiscovery: React.FC<VendorDiscoveryProps> = ({ companyId, companyName }) => {
  const [searchResults, setSearchResults] = useState<DiscoveredVendor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<DiscoveredVendor[]>([]);
  const [isRfiDialogOpen, setIsRfiDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (searchParams: any) => {
    setIsSearching(true);
    setHasSearched(false);
    
    try {
      // In a real implementation, this would be an API call to the RAG LLM
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter the sample vendors based on search criteria
      const filteredVendors = sampleVendors.filter(vendor => {
        if (searchParams.productType && !vendor.category.toLowerCase().includes(searchParams.productType.toLowerCase())) {
          return false;
        }
        
        if (searchParams.sustainabilityRating && vendor.sustainability.score < parseInt(searchParams.sustainabilityRating)) {
          return false;
        }
        
        return true;
      });
      
      setSearchResults(filteredVendors);
      setHasSearched(true);
      
      toast({
        title: "Search Completed",
        description: `Found ${filteredVendors.length} vendors matching your criteria.`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "There was an error processing your request.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRfi = () => {
    if (selectedVendors.length === 0) {
      toast({
        title: "No Vendors Selected",
        description: "Please select at least one vendor to send an RFI.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRfiDialogOpen(true);
  };

  const handleCreateRfp = () => {
    if (selectedVendors.length === 0) {
      toast({
        title: "No Vendors Selected",
        description: "Please select at least one vendor to create an RFP.",
        variant: "destructive",
      });
      return;
    }
    
    // This functionality would be implemented separately
    toast({
      title: "Create RFP",
      description: `Creating RFP for ${selectedVendors.length} selected vendors for ${companyName}.`,
    });
  };

  const handleVendorSelection = (vendor: DiscoveredVendor, isSelected: boolean) => {
    if (isSelected) {
      setSelectedVendors(prev => [...prev, vendor]);
    } else {
      setSelectedVendors(prev => prev.filter(v => v.id !== vendor.id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Discovery: {companyName}</CardTitle>
        <CardDescription>
          Find vendors that align with {companyName}'s business requirements and sustainability goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="search">
          <TabsList className="mb-4">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="results" disabled={!hasSearched}>Results ({searchResults.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <VendorSearchForm 
              onSearch={handleSearch} 
              isSearching={isSearching} 
              companyName={companyName}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <VendorDiscoveryResults 
              vendors={searchResults} 
              onVendorSelect={handleVendorSelection}
              selectedVendors={selectedVendors}
              onSendRfi={handleSendRfi}
              onCreateRfp={handleCreateRfp}
              companyName={companyName}
            />
          </TabsContent>
        </Tabs>
        
        <SendRfiDialog 
          open={isRfiDialogOpen} 
          onOpenChange={setIsRfiDialogOpen} 
          vendors={selectedVendors}
          companyId={companyId}
          companyName={companyName}
        />
      </CardContent>
    </Card>
  );
};

export default VendorDiscovery;
