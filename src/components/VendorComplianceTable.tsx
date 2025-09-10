
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Vendor {
  id: number;
  name: string;
  complianceScore: number;
  status: 'compliant' | 'at-risk' | 'non-compliant';
  industry: string;
  lastUpdated: string;
}

const vendors: Vendor[] = [
  {
    id: 1,
    name: 'Eco Materials Inc.',
    complianceScore: 95,
    status: 'compliant',
    industry: 'Manufacturing',
    lastUpdated: '2 days ago',
  },
  {
    id: 2,
    name: 'GreenTech Solutions',
    complianceScore: 88,
    status: 'compliant',
    industry: 'Technology',
    lastUpdated: '1 week ago',
  },
  {
    id: 3,
    name: 'Industrial Chemicals Ltd.',
    complianceScore: 72,
    status: 'at-risk',
    industry: 'Chemicals',
    lastUpdated: '3 days ago',
  },
  {
    id: 4,
    name: 'Global Shipping Co.',
    complianceScore: 63,
    status: 'at-risk',
    industry: 'Logistics',
    lastUpdated: '5 days ago',
  },
  {
    id: 5,
    name: 'MetalWorks Manufacturing',
    complianceScore: 45,
    status: 'non-compliant',
    industry: 'Manufacturing',
    lastUpdated: '1 day ago',
  },
];

const getStatusBadge = (status: Vendor['status']) => {
  switch (status) {
    case 'compliant':
      return <Badge className="bg-green-500 hover:bg-green-600">Compliant</Badge>;
    case 'at-risk':
      return <Badge className="bg-amber-500 hover:bg-amber-600">At Risk</Badge>;
    case 'non-compliant':
      return <Badge className="bg-destructive hover:bg-destructive/90">Non-Compliant</Badge>;
    default:
      return null;
  }
};

const VendorComplianceTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vendor</TableHead>
          <TableHead>Compliance Score</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.map((vendor) => (
          <TableRow key={vendor.id}>
            <TableCell className="font-medium">{vendor.name}</TableCell>
            <TableCell>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    vendor.complianceScore >= 80 
                      ? 'bg-green-500' 
                      : vendor.complianceScore >= 60 
                      ? 'bg-amber-500' 
                      : 'bg-destructive'
                  }`} 
                  style={{ width: `${vendor.complianceScore}%` }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground mt-1 inline-block">
                {vendor.complianceScore}%
              </span>
            </TableCell>
            <TableCell>{getStatusBadge(vendor.status)}</TableCell>
            <TableCell>{vendor.industry}</TableCell>
            <TableCell>{vendor.lastUpdated}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VendorComplianceTable;
