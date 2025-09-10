import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DateRangeSelector from './DateRangeSelector';
import WalletSelector from './WalletSelector';
import PositionReportTable from './PositionReportTable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { preparePositionReportForExport, type PositionData } from '@/utils/analytics/position-report-utils';

interface Wallet {
  id: string;
  name: string;
}

interface PositionReportProps {
  positionData: PositionData[];
  availableWallets: Wallet[];
  selectedWallets: string[];
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onWalletSelectionChange: (walletId: string) => void;
  onSelectAllWallets: () => void;
  onApplyFilters: () => void;
}

const PositionReport = ({
  positionData,
  availableWallets,
  selectedWallets,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onWalletSelectionChange,
  onSelectAllWallets,
  onApplyFilters
}: PositionReportProps) => {
  const { toast } = useToast();

  const handleExportPositionReport = () => {
    const exportData = preparePositionReportForExport(positionData);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Position Report");
    
    const startDateStr = format(startDate, 'MMM-dd-yyyy');
    const endDateStr = format(endDate, 'MMM-dd-yyyy');
    const fileName = `EarnDLT_Position_Report_${startDateStr}_to_${endDateStr}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
    
    toast({
      title: "Position report exported",
      description: "Downloaded as Excel spreadsheet",
    });
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>EAC Position Report</CardTitle>
            <CardDescription>Track your forward buy/sell commitments against holdings</CardDescription>
          </div>
          <Button 
            variant="outline" 
            className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            onClick={handleExportPositionReport}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-md">
            <DateRangeSelector 
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
            />
            
            <WalletSelector 
              availableWallets={availableWallets}
              selectedWallets={selectedWallets}
              onWalletSelectionChange={onWalletSelectionChange}
              onSelectAllWallets={onSelectAllWallets}
            />
            
            <div className="flex items-end">
              <Button onClick={onApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
          
          <PositionReportTable positionData={positionData} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionReport;
