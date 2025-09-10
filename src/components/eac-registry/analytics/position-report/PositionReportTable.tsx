
import React, { useState } from 'react';
import { AlertTriangle, Info, FileSpreadsheet, Download } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { type PositionData, type TransactionDetail, prepareTransactionDetailsForExport } from '@/utils/analytics/position-report-utils';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';

interface PositionReportTableProps {
  positionData: PositionData[];
}

const RISK_COLORS = {
  'High Risk': 'text-red-500 bg-red-50 border-red-200',
  'Medium Risk': 'text-amber-500 bg-amber-50 border-amber-200',
  'Low Risk': 'text-green-500 bg-green-50 border-green-200',
};

const PositionReportTable = ({ positionData }: PositionReportTableProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<TransactionDetail[]>([]);
  const [selectedDetails, setSelectedDetails] = useState<{
    type: 'Buy' | 'Sell';
    commodity: string;
    month: string;
    unit: string;
  } | null>(null);
  
  const hasHighRisk = positionData.some(item => item.riskStatus === 'High Risk');
  
  const handleCommitmentClick = (
    transactions: TransactionDetail[], 
    type: 'Buy' | 'Sell', 
    commodity: string, 
    month: string,
    unit: string
  ) => {
    // Only show dialog if there are transactions
    if (transactions.length === 0) {
      toast({
        title: "No transactions available",
        description: `There are no ${type.toLowerCase()} commitments for ${commodity} in ${month}`,
      });
      return;
    }
    
    setSelectedTransactions(transactions);
    setSelectedDetails({ type, commodity, month, unit });
    setIsDialogOpen(true);
  };
  
  const handleExportTransactions = () => {
    if (!selectedDetails || selectedTransactions.length === 0) return;
    
    const { type, commodity, month, unit } = selectedDetails;
    const exportData = prepareTransactionDetailsForExport(
      selectedTransactions, 
      commodity, 
      month, 
      type, 
      unit
    );
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${type} Transactions`);
    
    const fileName = `EarnDLT_${type}_Transactions_${commodity}_${month.replace(/\s/g, '_')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast({
      title: "Transactions exported",
      description: "Downloaded as Excel spreadsheet",
    });
  };
  
  return (
    <>
      {hasHighRisk && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm font-medium">
            Warning: You have high-risk positions that may require immediate attention
          </p>
        </div>
      )}
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commodity</TableHead>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Current Holdings</TableHead>
              <TableHead className="text-right">Buy Commitments</TableHead>
              <TableHead className="text-right">Sell Commitments</TableHead>
              <TableHead className="text-right">Net Position</TableHead>
              <TableHead>Risk Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positionData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{item.commodity}</div>
                </TableCell>
                <TableCell>{item.month}</TableCell>
                <TableCell className="text-right">
                  {item.holdings.toLocaleString()} {item.unit}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleCommitmentClick(
                      item.buyTransactions, 
                      'Buy', 
                      item.commodity, 
                      item.month,
                      item.unit
                    )}
                    className={`cursor-pointer hover:text-blue-600 focus:outline-none ${item.buyTransactions.length > 0 ? 'underline decoration-dotted decoration-1 underline-offset-4' : ''}`}
                    title={item.buyTransactions.length > 0 ? 'Click to view transaction details' : 'No transactions available'}
                  >
                    {item.buyCommitments.toLocaleString()} {item.unit}
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleCommitmentClick(
                      item.sellTransactions, 
                      'Sell', 
                      item.commodity, 
                      item.month,
                      item.unit
                    )}
                    className={`cursor-pointer hover:text-blue-600 focus:outline-none ${item.sellTransactions.length > 0 ? 'underline decoration-dotted decoration-1 underline-offset-4' : ''}`}
                    title={item.sellTransactions.length > 0 ? 'Click to view transaction details' : 'No transactions available'}
                  >
                    {item.sellCommitments.toLocaleString()} {item.unit}
                  </button>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.netPosition.toLocaleString()} {item.unit}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${RISK_COLORS[item.riskStatus]}`}>
                    {item.riskStatus}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-muted-foreground mt-2">
        <p>This position report is updated directly from EarnDLT and reflects your company's current trading position and risk exposure.</p>
        <p className="mt-1">Use the Excel export feature to download detailed data for offline analysis or reporting.</p>
        <p className="mt-1 flex items-center gap-1">
          <Info className="h-4 w-4" />
          Click on the Buy or Sell Commitment figures to view detailed transaction breakdowns.
        </p>
      </div>
      
      {/* Transaction Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDetails?.type} Commitments for {selectedDetails?.commodity} ({selectedDetails?.month})
            </DialogTitle>
            <DialogDescription>
              Detailed breakdown of all {selectedDetails?.type.toLowerCase()} transactions contributing to this commitment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="rounded-md border overflow-hidden mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Counterparty</TableHead>
                  <TableHead className="text-right">Amount ({selectedDetails?.unit})</TableHead>
                  <TableHead className="text-right">Price ($ per {selectedDetails?.unit})</TableHead>
                  <TableHead className="text-right">Total Value ($)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTransactions.map((tx, i) => (
                  <TableRow key={i}>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>{tx.counterparty}</TableCell>
                    <TableCell className="text-right">{tx.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${tx.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${tx.totalValue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/20 font-medium">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">
                    {selectedTransactions.reduce((sum, tx) => sum + tx.amount, 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Weighted average price */}
                    $
                    {(selectedTransactions.reduce((sum, tx) => sum + (tx.price * tx.amount), 0) / 
                      selectedTransactions.reduce((sum, tx) => sum + tx.amount, 0)).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${selectedTransactions.reduce((sum, tx) => sum + tx.totalValue, 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              onClick={handleExportTransactions}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PositionReportTable;
