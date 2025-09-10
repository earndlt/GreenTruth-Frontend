
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export interface ResponseFiltersProps {
  currentFilter: string;
  setCurrentFilter: React.Dispatch<React.SetStateAction<string>>;
}

const ResponseFilters: React.FC<ResponseFiltersProps> = ({ 
  currentFilter, 
  setCurrentFilter 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by vendor or RFP title"
          value={currentFilter}
          onChange={(e) => setCurrentFilter(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};

export default ResponseFilters;
