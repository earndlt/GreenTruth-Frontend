
import React from 'react';
import { cn } from "@/lib/utils"
import { Vendor } from '../types/vendorTypes';

interface VendorTableProps {
  vendors: Vendor[];
  onViewVendor: (id: string) => void;
  companyName?: string;
}

const VendorTable: React.FC<VendorTableProps> = ({ vendors, onViewVendor, companyName }) => {
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-6 p-3 text-xs font-medium text-muted-foreground bg-muted">
        <div className="col-span-2">Vendor Name</div>
        <div>Vendor ID</div>
        <div>Category</div>
        <div>Location</div>
        <div>Compliance</div>
      </div>
      
      {vendors.length > 0 ? (
        vendors.map((vendor) => (
          <div 
            key={vendor.id} 
            className={cn(
              "grid grid-cols-6 p-3 border-t items-center text-sm",
              "cursor-pointer hover:bg-muted/50 transition-colors",
              "active:bg-muted"
            )}
            onClick={() => onViewVendor(vendor.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onViewVendor(vendor.id);
              }
            }}
          >
            <div className="col-span-2 font-medium">{vendor.name}</div>
            <div>
              <span className="font-mono text-xs text-muted-foreground">{vendor.id}</span>
            </div>
            <div>{vendor.category}</div>
            <div>{vendor.location}</div>
            <div>
              <div className="flex items-center">
                <div className="w-full bg-muted rounded-full h-2 mr-2">
                  <div 
                    className={`h-2 rounded-full ${
                      vendor.complianceScore >= 90 
                        ? 'bg-green-500' 
                        : vendor.complianceScore >= 70 
                        ? 'bg-amber-500' 
                        : 'bg-destructive'
                    }`} 
                    style={{ width: `${vendor.complianceScore}%` }}
                  ></div>
                </div>
                <span className="text-xs">{vendor.complianceScore}%</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No vendors found {companyName ? `for ${companyName}` : ''} matching your search criteria.
        </div>
      )}
    </div>
  );
};

export default VendorTable;
