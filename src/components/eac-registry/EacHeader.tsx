import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Map, ExternalLink, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EacHeader = () => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  
  const handleTabChange = (tab: string) => {
    // Navigate to the EAC registry page with state to activate specific tab
    navigate('/eac-registry', { 
      state: { activeTab: tab }
    });
  };
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">EAC Registry</h1>
      <div className="flex items-center space-x-2">
        {/* <Button 
          variant="outline" 
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          onClick={() => handleTabChange('pipeline-map')}
        >
          <Map className="h-4 w-4 mr-2" />
          EAC Map
        </Button> */}
        <Button 
          variant="outline" 
          className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
          onClick={() => window.open('https://earndlt.example.com/account', '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Access EarnDLT Account
        </Button>
        
        {/* Filter Dialog */}
        <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Filter EACs</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="producer">Producer</Label>
                <Input id="producer" placeholder="Filter by producer name" />
              </div>
              
              <div className="space-y-3">
                <Label>Certificate Type</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="rsg" />
                    <label htmlFor="rsg" className="text-sm">RSG Certified</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="carbon-neutral" />
                    <label htmlFor="carbon-neutral" className="text-sm">Carbon Neutral</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="low-methane" />
                    <label htmlFor="low-methane" className="text-sm">Low Methane Intensity</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ferc" defaultChecked />
                    <label htmlFor="ferc" className="text-sm">FERC Authorized</label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Min" type="number" min="0" step="0.01" />
                  <Input placeholder="Max" type="number" min="0" step="0.01" />
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={() => setFilterOpen(false)}>Cancel</Button>
                <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Discover EACs Button */}
        <Button onClick={() => handleTabChange('active')}>
          <Search className="h-4 w-4 mr-2" />
          Discover EACs
        </Button>
      </div>
    </div>
  );
};

export default EacHeader;
