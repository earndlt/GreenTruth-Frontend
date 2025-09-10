
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface NoEacsFoundProps {
  isLoading?: boolean;
}

const NoEacsFound: React.FC<NoEacsFoundProps> = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h3 className="text-lg font-semibold mb-1">Loading EACs</h3>
        <p className="text-muted-foreground">
          Please wait while we fetch matching EACs for your contract
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-lg font-semibold mb-1">No EACs Found</h3>
      <p className="text-muted-foreground">
        Try adjusting your search parameters to find matching EACs
      </p>
    </div>
  );
};

export default NoEacsFound;
