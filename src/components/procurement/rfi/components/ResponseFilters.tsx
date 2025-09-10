
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';

interface ResponseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ResponseFilters: React.FC<ResponseFiltersProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Input
          placeholder="Search responses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      <Button variant="outline">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
    </div>
  );
};

export default ResponseFilters;

