
import React from 'react';
import { cn } from "@/lib/utils";
import { RfpResponse } from '../types/RfpResponseTypes';
import { getStatusBadge } from '../utils/statusUtils';

interface ResponseTableProps {
  responses: RfpResponse[];
  onViewDetails: (responseId: string) => void;
}

const ResponseTable: React.FC<ResponseTableProps> = ({ 
  responses, 
  onViewDetails 
}) => {
  if (responses.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <h3 className="text-lg font-medium text-muted-foreground">No responses found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          There are no responses matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-5 p-3 text-xs font-medium text-muted-foreground bg-muted">
        <div className="col-span-2">Vendor</div>
        <div>RFP Title</div>
        <div>Received</div>
        <div>Status</div>
      </div>
      
      {responses.map((response) => (
        <div
          key={response.id}
          onClick={() => onViewDetails(response.id)}
          className={cn(
            "grid grid-cols-5 p-3 border-t items-center text-sm",
            "cursor-pointer hover:bg-muted/50 transition-colors",
            "active:bg-muted"
          )}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onViewDetails(response.id);
            }
          }}
        >
          <div className="col-span-2 font-medium">{response.vendorName}</div>
          <div>{response.rfpTitle}</div>
          <div>{response.receivedDate}</div>
          <div>{getStatusBadge(response.status)}</div>
        </div>
      ))}
    </div>
  );
};

export default ResponseTable;
