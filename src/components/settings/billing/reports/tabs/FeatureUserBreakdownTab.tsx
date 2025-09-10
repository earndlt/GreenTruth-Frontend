
import React from 'react';
import { BookOpenText, Pencil } from 'lucide-react';
import UsageTable from '../components/UsageTable';
import { formatNumber, formatPercentage } from '../utils/formatUtils';
import { featureUserData } from '../data/mockData';

interface FeatureUserBreakdownTabProps {
  selectedDate?: Date;
}

const FeatureUserBreakdownTab: React.FC<FeatureUserBreakdownTabProps> = ({ selectedDate = new Date() }) => {
  // In a real implementation, we would fetch data for the selected month
  // const breakdownData = fetchFeatureUserBreakdownData(selectedDate);
  // For now, we'll use the mock data
  const breakdownData = featureUserData;
  
  return (
    <div className="space-y-6">
      {breakdownData.map((feature) => (
        <div key={feature.featureName} className="space-y-2">
          <h3 className="text-lg font-medium">
            {feature.featureName} ({formatNumber(feature.totalWords)} words total)
          </h3>
          <div className="text-sm text-muted-foreground flex space-x-4">
            <div className="flex items-center">
              <BookOpenText className="h-4 w-4 mr-1 text-blue-500" />
              <span>Read: {formatNumber(feature.totalWordsRead)} words</span>
            </div>
            <div className="flex items-center">
              <Pencil className="h-4 w-4 mr-1 text-green-500" />
              <span>Written: {formatNumber(feature.totalWordsWritten)} words</span>
            </div>
          </div>
          
          <UsageTable 
            data={feature.users}
            columns={[
              {
                key: 'userName',
                header: 'User',
                cell: (user) => user.userName,
                align: 'left' as const
              },
              {
                key: 'wordsReadUsed',
                header: 'Words Read',
                cell: (user) => formatNumber(user.wordsReadUsed),
                align: 'right' as const
              },
              {
                key: 'wordsWrittenUsed',
                header: 'Words Written',
                cell: (user) => formatNumber(user.wordsWrittenUsed),
                align: 'right' as const
              },
              {
                key: 'totalWordsUsed',
                header: 'Total Words',
                cell: (user) => formatNumber(user.totalWordsUsed),
                align: 'right' as const
              },
              {
                key: 'percentage',
                header: 'Percentage',
                cell: (user) => formatPercentage(user.percentage),
                align: 'right' as const
              }
            ]}
          />
        </div>
      ))}
    </div>
  );
};

export default FeatureUserBreakdownTab;
