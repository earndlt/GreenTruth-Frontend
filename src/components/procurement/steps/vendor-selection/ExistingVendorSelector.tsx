
import React, { useState, useEffect } from 'react';
import { Check, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Types for our vendors
export type Vendor = {
  id: string;
  name: string;
  type: string[];
  category: string;
  location: string;
  isSelected?: boolean;
};

// Sample vendor data - in a real app, this would come from an API
const sampleVendors: Vendor[] = [
  { id: '1', name: 'EcoGas Solutions', type: ['Natural Gas', 'MRV Gas'], category: 'Energy', location: 'Texas' },
  { id: '2', name: 'Green Energy Partners', type: ['Renewable Energy', 'Solar'], category: 'Energy', location: 'California' },
  { id: '3', name: 'Carbon Neutral Systems', type: ['Carbon Credits', 'MRV Gas'], category: 'Environmental', location: 'New York' },
  { id: '4', name: 'Sustainable Materials Co', type: ['Recycled Materials', 'Packaging'], category: 'Materials', location: 'Oregon' },
  { id: '5', name: 'EcoLogistics', type: ['Transportation', 'Logistics'], category: 'Transportation', location: 'Illinois' },
  { id: '6', name: 'BioDiesel Providers', type: ['Biofuels', 'Alternative Fuels'], category: 'Energy', location: 'Iowa' },
  { id: '7', name: 'Natural Resource Technologies', type: ['Natural Gas', 'Oil'], category: 'Energy', location: 'Oklahoma' },
  { id: '8', name: 'Clean Air Monitoring', type: ['MRV Gas', 'Monitoring Equipment'], category: 'Environmental', location: 'Washington' },
];

// Available filters
const vendorTypes = [...new Set(sampleVendors.flatMap(vendor => vendor.type))];
const vendorCategories = [...new Set(sampleVendors.map(vendor => vendor.category))];

interface ExistingVendorSelectorProps {
  productCategory: string | null;
  onSelectVendors: (vendors: Vendor[]) => void;
  selectedVendors: Vendor[];
}

const ExistingVendorSelector = ({ 
  productCategory, 
  onSelectVendors, 
  selectedVendors
}: ExistingVendorSelectorProps) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Initialize vendors with selection state
  useEffect(() => {
    const initialVendors = sampleVendors.map(vendor => ({
      ...vendor,
      isSelected: selectedVendors.some(sv => sv.id === vendor.id)
    }));
    setVendors(initialVendors);
    setFilteredVendors(initialVendors);
  }, [selectedVendors]);
  
  // Apply auto-suggestion based on product category
  useEffect(() => {
    if (productCategory) {
      // For example, if MRV is selected, suggest vendors with MRV Gas
      let suggestedType = '';
      
      if (productCategory === '8') { // MRV category
        suggestedType = 'MRV Gas';
      } else if (productCategory === '1') { // Energy
        suggestedType = 'Natural Gas';
      }
      
      if (suggestedType) {
        setTypeFilter(suggestedType);
      }
    }
  }, [productCategory]);
  
  // Apply filters when they change
  useEffect(() => {
    let results = vendors;
    
    // Apply search filter
    if (searchQuery) {
      results = results.filter(vendor => 
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(vendor => 
        vendor.type.includes(typeFilter)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      results = results.filter(vendor => 
        vendor.category === categoryFilter
      );
    }
    
    setFilteredVendors(results);
  }, [vendors, searchQuery, typeFilter, categoryFilter]);
  
  // Toggle vendor selection
  const toggleVendorSelection = (vendorId: string) => {
    const updatedVendors = vendors.map(vendor => {
      if (vendor.id === vendorId) {
        return { ...vendor, isSelected: !vendor.isSelected };
      }
      return vendor;
    });
    
    setVendors(updatedVendors);
    
    // Update parent component with selected vendors
    const newSelectedVendors = updatedVendors.filter(v => v.isSelected);
    onSelectVendors(newSelectedVendors);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Select from Existing Vendors</h3>
      
      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Product Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {vendorTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {vendorCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={clearFilters} title="Clear filters">
            <Tag className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Vendor list */}
      <ScrollArea className="h-[300px] border rounded-md">
        <div className="p-4 space-y-2">
          {filteredVendors.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No vendors match your criteria
            </p>
          ) : (
            filteredVendors.map(vendor => (
              <div 
                key={vendor.id}
                className={cn(
                  "flex items-center space-x-2 p-3 rounded-md cursor-pointer",
                  vendor.isSelected ? "bg-primary/10 border border-primary/50" : "border hover:bg-muted/50"
                )}
                onClick={() => toggleVendorSelection(vendor.id)}
              >
                <Checkbox 
                  checked={vendor.isSelected}
                  onCheckedChange={() => toggleVendorSelection(vendor.id)}
                  id={`vendor-${vendor.id}`}
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`vendor-${vendor.id}`}
                    className="cursor-pointer text-sm font-medium"
                  >
                    {vendor.name}
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vendor.type.map(type => (
                      <span 
                        key={`${vendor.id}-${type}`} 
                        className="text-xs bg-muted px-2 py-0.5 rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {vendor.location}
                    </span>
                  </div>
                </div>
                {vendor.isSelected && (
                  <div className="text-primary">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <div className="text-sm text-muted-foreground">
        {selectedVendors.length} vendors selected
      </div>
    </div>
  );
};

export default ExistingVendorSelector;
