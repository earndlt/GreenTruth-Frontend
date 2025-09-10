
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpenText, Pencil } from 'lucide-react';

const OverageRatesTable: React.FC = () => {
  return (
    <div className="space-y-2 pt-2">
      <h4 className="text-sm font-medium">Overage Rates</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Per</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="flex items-center">
              <BookOpenText className="h-4 w-4 mr-2 text-blue-500" />
              Words Read
            </TableCell>
            <TableCell>$15</TableCell>
            <TableCell>750K words</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="flex items-center">
              <Pencil className="h-4 w-4 mr-2 text-green-500" />
              Words Written
            </TableCell>
            <TableCell>$100</TableCell>
            <TableCell>750K words</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default OverageRatesTable;
