
import React from 'react';
import UsageBarChart from '../components/UsageBarChart';
import UsageTable from '../components/UsageTable';
import { formatNumber, formatPercentage } from '../utils/formatUtils';
import { featureUsageData } from '../data/mockData';

interface FeatureUsageTabProps {
  selectedDate?: Date;
}

const FeatureUsageTab: React.FC<FeatureUsageTabProps> = ({ selectedDate = new Date() }) => {
  // In a real implementation, we would fetch data for the selected month
  // const usageData = fetchFeatureUsageData(selectedDate);
  // For now, we'll use the mock data
  const usageData = featureUsageData;
  
  const columns = [
    {
      key: 'featureName',
      header: 'Feature',
      cell: (item: typeof usageData[0]) => item.featureName,
      align: 'left' as const
    },
    {
      key: 'wordsReadUsed',
      header: 'Words Read',
      cell: (item: typeof usageData[0]) => formatNumber(item.wordsReadUsed),
      align: 'right' as const
    },
    {
      key: 'wordsWrittenUsed',
      header: 'Words Written',
      cell: (item: typeof usageData[0]) => formatNumber(item.wordsWrittenUsed),
      align: 'right' as const
    },
    {
      key: 'totalWordsUsed',
      header: 'Total Words',
      cell: (item: typeof usageData[0]) => formatNumber(item.totalWordsUsed),
      align: 'right' as const
    },
    {
      key: 'percentage',
      header: 'Percentage',
      cell: (item: typeof usageData[0]) => formatPercentage(item.percentage),
      align: 'right' as const
    }
  ];
  
  const barKeys = [
    { key: 'wordsReadUsed', name: 'Words Read', color: '#3b82f6' },
    { key: 'wordsWrittenUsed', name: 'Words Written', color: '#10b981' }
  ];

  return (
    <div className="space-y-4">
      <UsageBarChart 
        data={usageData}
        xAxisKey="featureName"
        barKeys={barKeys}
      />
      <UsageTable 
        data={usageData}
        columns={columns}
      />
    </div>
  );
};

export default FeatureUsageTab;
