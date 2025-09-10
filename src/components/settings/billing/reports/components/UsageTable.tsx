
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpenText, Pencil } from 'lucide-react';
import { formatNumber } from '../utils/formatUtils';

interface UsageTableProps {
  data: Array<{
    [key: string]: any;
  }>;
  columns: Array<{
    key: string;
    header: string;
    cell: (item: any) => React.ReactNode;
    align?: 'left' | 'right';
  }>;
}

const UsageTable: React.FC<UsageTableProps> = ({ data, columns }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead 
              key={column.key} 
              className={column.align === 'right' ? 'text-right' : ''}
            >
              {column.header.includes('Words Read') ? (
                <div className="flex items-center justify-end space-x-1">
                  <BookOpenText className="h-4 w-4" />
                  <span>Words Read</span>
                </div>
              ) : column.header.includes('Words Written') ? (
                <div className="flex items-center justify-end space-x-1">
                  <Pencil className="h-4 w-4" />
                  <span>Words Written</span>
                </div>
              ) : (
                column.header
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell 
                key={`${index}-${column.key}`}
                className={column.align === 'right' ? 'text-right' : ''}
              >
                {column.cell(item)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsageTable;
