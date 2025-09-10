
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import VendorSearchForm from './VendorSearchForm';
import VendorSearchResults from './VendorSearchResults';
import { mockVendors } from './mockVendorData';

interface VendorSearchStepProps {
  onVendorSearch: (result: { found: boolean; data?: any }) => void;
}

const VendorSearchStep: React.FC<VendorSearchStepProps> = ({ onVendorSearch }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  
  const onSubmit = async (data: { searchTerm: string }) => {
    setIsSearching(true);
    
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration, we'll check if the search term contains "eco" to show mock results
      const results = data.searchTerm.toLowerCase().includes('eco') ? mockVendors : [];
      
      setSearchResults(results);
      setHasSearched(true);
      
      if (results.length > 0) {
        toast({
          title: "Vendors Found",
          description: `Found ${results.length} vendors matching your search criteria.`,
        });
      } else {
        toast({
          title: "No Vendors Found",
          description: "No matching vendors found in the Greentruth system.",
        });
        onVendorSearch({ found: false });
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search for vendor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        <p>Search for an existing vendor in the Greentruth system. If the vendor is found, we'll automatically connect and import their profile data.</p>
      </div>
      
      <VendorSearchForm 
        isSearching={isSearching}
        onSubmit={onSubmit}
      />
      
      {hasSearched && searchResults.length > 0 && (
        <VendorSearchResults 
          vendors={searchResults}
          onSelectVendor={(vendor) => {
            toast({
              title: "Vendor Selected",
              description: "Vendor found in the Greentruth system.",
            });
            onVendorSearch({ found: true, data: vendor });
          }}
        />
      )}
      
      <div className="text-sm text-muted-foreground mt-4 border-t pt-4">
        <p>Tip: For demo purposes, search for "eco" to find vendors, or use any other term to simulate not finding a vendor.</p>
      </div>
    </div>
  );
};

export default VendorSearchStep;
