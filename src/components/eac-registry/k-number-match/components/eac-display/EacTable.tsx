
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { MatchedEAC } from '../../types';
import { formatNumber } from '@/lib/utils';

interface EacTableProps {
  matchedEACs: MatchedEAC[];
}

const EacTable: React.FC<EacTableProps> = ({ matchedEACs }) => {
  console.log("EacTable - Rendering with matchedEACs:", matchedEACs);
  
  if (!matchedEACs || matchedEACs.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No matching EACs found. Try adjusting your search criteria.</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border overflow-x-auto max-h-[550px]">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead>EAC ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contract ID</TableHead>
            <TableHead>Source Facility</TableHead>
            <TableHead className="text-right">Volume (MMBtu)</TableHead>
            <TableHead className="text-right">Daily Volume</TableHead>
            <TableHead>Emission Factor</TableHead>
            <TableHead>Time Range</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matchedEACs.map((eac) => (
            <TableRow key={eac.id} className="hover:bg-slate-50">
              <TableCell className="font-medium">{eac.id}</TableCell>
              <TableCell>
                {eac.emissionPoint.charAt(0).toUpperCase() + eac.emissionPoint.slice(1)}
              </TableCell>
              <TableCell>K# {eac.contractId}</TableCell>
              <TableCell>{eac.sourceFacility}</TableCell>
              <TableCell className="text-right">{formatNumber(eac.volume)}</TableCell>
              <TableCell className="text-right">{eac.dailyVolume ? formatNumber(eac.dailyVolume) + ' MMBtu/day' : 'N/A'}</TableCell>
              <TableCell>{eac.emissionFactor}</TableCell>
              <TableCell>{eac.timeRange}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EacTable;
