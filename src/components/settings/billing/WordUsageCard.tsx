
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LlmUsageReport from './reports/LlmUsageReport';
import UsageProgressBar from './reports/components/UsageProgressBar';
import OverageRatesTable from './reports/components/OverageRatesTable';
import UsageAlert from './reports/components/UsageAlert';
import MonthSelector from './reports/components/MonthSelector';

interface WordUsageCardProps {
  wordsReadUsage: number;
  wordsWrittenUsage: number;
  wordsReadLimit: number;
  wordsWrittenLimit: number;
}

const WordUsageCard: React.FC<WordUsageCardProps> = ({ 
  wordsReadUsage, 
  wordsWrittenUsage, 
  wordsReadLimit, 
  wordsWrittenLimit 
}) => {
  const [showUsageReport, setShowUsageReport] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const readUsagePercentage = (wordsReadUsage / wordsReadLimit) * 100;
  const writeUsagePercentage = (wordsWrittenUsage / wordsWrittenLimit) * 100;
  
  const readHighUsage = readUsagePercentage > 80;
  const writeHighUsage = writeUsagePercentage > 80;
  
  const readOverageUnits = Math.max(0, Math.ceil((wordsReadUsage - wordsReadLimit) / 750000));
  const readOverageCharges = readOverageUnits * 15;
  const showReadOverage = wordsReadUsage > wordsReadLimit;
  
  const writeOverageUnits = Math.max(0, Math.ceil((wordsWrittenUsage - wordsWrittenLimit) / 750000));
  const writeOverageCharges = writeOverageUnits * 100;
  const showWriteOverage = wordsWrittenUsage > wordsWrittenLimit;
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Word Usage</CardTitle>
            <CardDescription>
              Track your monthly word allocation and overages for reading and writing
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {showUsageReport && (
              <MonthSelector 
                selectedDate={selectedDate}
                onChange={setSelectedDate}
              />
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowUsageReport(!showUsageReport)}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              {showUsageReport ? 'Hide' : 'View'} Usage Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <UsageProgressBar 
            type="read"
            usage={wordsReadUsage}
            limit={wordsReadLimit}
            showOverage={showReadOverage}
            overageUnits={readOverageUnits}
            overageCharges={readOverageCharges}
            overageRate={15}
          />
          
          <UsageProgressBar 
            type="write"
            usage={wordsWrittenUsage}
            limit={wordsWrittenLimit}
            showOverage={showWriteOverage}
            overageUnits={writeOverageUnits}
            overageCharges={writeOverageCharges}
            overageRate={100}
          />
          
          {showUsageReport && (
            <LlmUsageReport 
              isOpen={showUsageReport} 
              onClose={() => setShowUsageReport(false)}
              selectedDate={selectedDate}
            />
          )}
          
          <OverageRatesTable />
          
          <UsageAlert 
            readUsagePercentage={readUsagePercentage}
            writeUsagePercentage={writeUsagePercentage}
            readHighUsage={readHighUsage}
            writeHighUsage={writeHighUsage}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WordUsageCard;
