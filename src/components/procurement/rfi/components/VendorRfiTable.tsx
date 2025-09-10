
import React, { useState } from "react";
import { Mail } from "lucide-react";
import { RfiResponse } from "../types/RfiTypes";
import RfiDetailsDialog from "./RfiDetailsDialog";

interface VendorRfiTableProps {
  rfis: RfiResponse[];
  showVendorColumn?: boolean;
}

const VendorRfiTable: React.FC<VendorRfiTableProps> = ({ rfis, showVendorColumn = false }) => {
  const [selectedRfi, setSelectedRfi] = useState<RfiResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (rfis.length === 0) {
    return (
      <div className="text-muted-foreground py-4 text-center">
        No RFIs have been sent to any vendors yet.
      </div>
    );
  }

  const handleRowClick = (rfi: RfiResponse) => {
    setSelectedRfi(rfi);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="border rounded-md overflow-x-auto">
        <div className={`grid text-xs font-medium px-4 py-2 bg-muted text-muted-foreground ${
          showVendorColumn ? "grid-cols-5" : "grid-cols-4"
        }`}>
          {showVendorColumn && <div>Vendor</div>}
          <div>Subject</div>
          <div>Status</div>
          <div>Received</div>
          <div>Email</div>
        </div>
        {rfis.map(rfi => (
          <div
            key={rfi.id}
            onClick={() => handleRowClick(rfi)}
            className={`grid px-4 py-2 border-t items-center text-sm cursor-pointer hover:bg-muted/50 ${
              showVendorColumn ? "grid-cols-5" : "grid-cols-4"
            }`}
          >
            {showVendorColumn && <div>{rfi.vendorName}</div>}
            <div>{rfi.subject}</div>
            <div>
              <span className="capitalize">{rfi.status}</span>
              {rfi.status === "approved" && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-xs">
                  Approved
                </span>
              )}
            </div>
            <div>{rfi.receivedDate}</div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs">{rfi.email}</span>
            </div>
          </div>
        ))}
      </div>

      <RfiDetailsDialog
        rfi={selectedRfi}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default VendorRfiTable;
