import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchTransactionVolumeData, 
  fetchEacDistributionData, 
  fetchRevenueGenerationData, 
  fetchTradingActivityData, 
  getWalletTotalsData, 
  fetchPositionReportData, 
  getAvailableWallets 
} from '@/utils/analytics';

// Import refactored components
import AnalyticsHeader from './analytics/AnalyticsHeader';
import SummaryMetricsCards from './analytics/SummaryMetricsCards';
import TransactionVolumeChart from './analytics/TransactionVolumeChart';
import EacDistributionChart from './analytics/EacDistributionChart';
import RevenueGenerationChart from './analytics/RevenueGenerationChart';
import TradingActivityChart from './analytics/TradingActivityChart';
import PositionReport from './analytics/position-report/PositionReport';

// Chart color configuration
const chartConfig = {
  'Natural Gas': { color: '#f97316' }, // orange-500
  'LNG': { color: '#0ea5e9' }, // sky-500
  'Methanol': { color: '#14b8a6' }, // teal-500
  'Thermal Credits': { color: '#22c55e' }, // green-500
  'Base Transactions': { color: '#8b5cf6' }, // violet-500
  'Secondary Transfers': { color: '#ec4899' }, // pink-500
  'volume': { color: '#3b82f6' }, // blue-500
  'transactions': { color: '#f43f5e' }, // rose-500
  'activity': { color: '#8b5cf6' }, // violet-500
};

// Pie chart colors
const COLORS = ['#f97316', '#0ea5e9', '#14b8a6', '#22c55e'];

const AnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  
  // Position Report states
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().setMonth(new Date().getMonth() + 2)));
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [positionData, setPositionData] = useState(() => fetchPositionReportData([], startDate, endDate));
  
  // Load data from our utilities (simulating API calls)
  const transactionVolumeData = fetchTransactionVolumeData();
  const eacDistributionData = fetchEacDistributionData();
  const revenueGenerationData = fetchRevenueGenerationData();
  const tradingActivityData = fetchTradingActivityData();
  const walletTotals = getWalletTotalsData();
  const availableWallets = getAvailableWallets();
  
  const handleRefreshData = () => {
    setIsRefreshing(true);
    
    // Simulate API refresh with a timeout
    setTimeout(() => {
      setIsRefreshing(false);
      // Refresh position data
      setPositionData(fetchPositionReportData(selectedWallets, startDate, endDate));
      toast({
        title: "Data refreshed",
        description: "Latest EarnDLT data has been loaded",
      });
    }, 1200);
  };
  
  const handleExportData = () => {
    toast({
      title: "Report exported",
      description: "Analytics data has been prepared for download",
    });
  };
  
  const handleWalletSelectionChange = (walletId: string) => {
    if (selectedWallets.includes(walletId)) {
      setSelectedWallets(selectedWallets.filter(id => id !== walletId));
    } else {
      setSelectedWallets([...selectedWallets, walletId]);
    }
  };
  
  const handleSelectAllWallets = () => {
    if (selectedWallets.length === availableWallets.length) {
      setSelectedWallets([]);
    } else {
      setSelectedWallets(availableWallets.map(wallet => wallet.id));
    }
  };
  
  const handleApplyFilters = () => {
    setPositionData(fetchPositionReportData(selectedWallets, startDate, endDate));
    toast({
      title: "Filters applied",
      description: "Position report has been updated",
    });
  };
  
  return (
    <div className="pt-4 space-y-6">
      <AnalyticsHeader 
        onRefreshData={handleRefreshData}
        onExportData={handleExportData}
        isRefreshing={isRefreshing}
      />
      
      <SummaryMetricsCards walletTotals={walletTotals} />
      
      {/* Main charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionVolumeChart 
          data={transactionVolumeData} 
          chartConfig={chartConfig} 
        />
        
        <EacDistributionChart 
          data={eacDistributionData} 
          colors={COLORS} 
        />
        
        <PositionReport 
          positionData={positionData}
          availableWallets={availableWallets}
          selectedWallets={selectedWallets}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(date) => date && setStartDate(date)}
          onEndDateChange={(date) => date && setEndDate(date)}
          onWalletSelectionChange={handleWalletSelectionChange}
          onSelectAllWallets={handleSelectAllWallets}
          onApplyFilters={handleApplyFilters}
        />
        
        <RevenueGenerationChart 
          data={revenueGenerationData} 
          chartConfig={chartConfig} 
        />
        
        <TradingActivityChart 
          data={tradingActivityData} 
          chartConfig={chartConfig} 
        />
      </div>
    </div>
  );
};

export default AnalyticsTab;
