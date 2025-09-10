
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DiscoveredVendor } from './VendorDiscovery';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VendorComparisonTableProps {
  vendors: DiscoveredVendor[];
  selectedVendors: string[];
  onSelectVendor: (vendorId: string) => void;
}

const VendorComparisonTable: React.FC<VendorComparisonTableProps> = ({
  vendors,
  selectedVendors,
  onSelectVendor,
}) => {
  return (
    <ScrollArea className="rounded-md border h-[500px]">
      <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Match Score</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Sustainability</TableHead>
            <TableHead>Environmental</TableHead>
            <TableHead>Procurement</TableHead>
            <TableHead>ESG</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>
                <Checkbox
                  checked={selectedVendors.includes(vendor.id)}
                  onCheckedChange={() => onSelectVendor(vendor.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{vendor.name}</TableCell>
              <TableCell>
                <Badge 
                  className={
                    vendor.matchScore >= 90 ? 'bg-green-500' :
                    vendor.matchScore >= 80 ? 'bg-green-600' :
                    vendor.matchScore >= 70 ? 'bg-amber-500' :
                    'bg-amber-600'
                  }
                >
                  {vendor.matchScore}%
                </Badge>
              </TableCell>
              <TableCell>{vendor.category}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[150px]">
                  {vendor.products.map((product, index) => (
                    <Badge key={index} variant="outline" className="bg-muted/50">
                      {product}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      vendor.sustainability.score >= 80 
                        ? 'bg-green-500' 
                        : vendor.sustainability.score >= 60 
                        ? 'bg-amber-500' 
                        : 'bg-destructive'
                    }`} 
                    style={{ width: `${vendor.sustainability.score}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground mt-1 inline-block">
                  {vendor.sustainability.score}%
                </span>
              </TableCell>
              <TableCell>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      vendor.policyMatch.environmental >= 80 
                        ? 'bg-green-500' 
                        : vendor.policyMatch.environmental >= 60 
                        ? 'bg-amber-500' 
                        : 'bg-destructive'
                    }`} 
                    style={{ width: `${vendor.policyMatch.environmental}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground mt-1 inline-block">
                  {vendor.policyMatch.environmental}%
                </span>
              </TableCell>
              <TableCell>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      vendor.policyMatch.procurement >= 80 
                        ? 'bg-green-500' 
                        : vendor.policyMatch.procurement >= 60 
                        ? 'bg-amber-500' 
                        : 'bg-destructive'
                    }`} 
                    style={{ width: `${vendor.policyMatch.procurement}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground mt-1 inline-block">
                  {vendor.policyMatch.procurement}%
                </span>
              </TableCell>
              <TableCell>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      vendor.policyMatch.esg >= 80 
                        ? 'bg-green-500' 
                        : vendor.policyMatch.esg >= 60 
                        ? 'bg-amber-500' 
                        : 'bg-destructive'
                    }`} 
                    style={{ width: `${vendor.policyMatch.esg}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground mt-1 inline-block">
                  {vendor.policyMatch.esg}%
                </span>
              </TableCell>
              <TableCell>{vendor.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default VendorComparisonTable;
