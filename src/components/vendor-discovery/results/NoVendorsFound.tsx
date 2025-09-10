
import React from 'react';
import { SearchX } from 'lucide-react';

interface NoVendorsFoundProps {
  companyName?: string;
}

const NoVendorsFound: React.FC<NoVendorsFoundProps> = ({ companyName = '' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/50 rounded-full p-6 mb-4">
        <SearchX className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No Vendors Found</h3>
      <p className="text-muted-foreground max-w-md">
        We couldn't find any vendors matching your criteria
        {companyName ? ` for ${companyName}` : ''}.
        Try adjusting your search parameters or using more general terms.
      </p>
    </div>
  );
};

export default NoVendorsFound;
