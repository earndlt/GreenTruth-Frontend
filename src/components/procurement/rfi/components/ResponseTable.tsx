
import React from 'react';
import { RfiResponse } from '../types/RfiTypes';

interface ResponseTableProps {
  responses: RfiResponse[];
  onViewResponse: (response: RfiResponse) => void;
  // onAddVendor removed for this table version
}

const ResponseTable: React.FC<ResponseTableProps> = ({ 
  responses, 
  onViewResponse
}) => {
  if (responses.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No responses found matching your criteria.</div>;
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-6 p-3 text-xs font-medium text-muted-foreground bg-muted">
        <div className="col-span-2">Vendor</div>
        <div className="col-span-2">Subject</div>
        <div>Received</div>
        {/* Removed Actions header */}
      </div>
      
      {responses.map((response) => (
        <div
          key={response.id}
          className="grid grid-cols-6 p-3 border-t items-center text-sm cursor-pointer hover:bg-muted/50"
          onClick={() => onViewResponse(response)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onViewResponse(response);
            }
          }}
        >
          <div className="col-span-2 font-medium">{response.vendorName}</div>
          <div className="col-span-2 truncate">{response.subject}</div>
          <div>{response.receivedDate}</div>
          <div></div>
        </div>
      ))}
    </div>
  );
};

export default ResponseTable;

