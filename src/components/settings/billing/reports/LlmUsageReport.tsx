
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, PieChart, Users, FileSpreadsheet } from 'lucide-react';
import FeatureUsageTab from './tabs/FeatureUsageTab';
import UserUsageTab from './tabs/UserUsageTab';
import FeatureUserBreakdownTab from './tabs/FeatureUserBreakdownTab';
import { LlmUsageReportProps } from './types';
import MonthSelector from './components/MonthSelector';

const LlmUsageReport: React.FC<LlmUsageReportProps> = ({ 
  isOpen, 
  onClose,
  selectedDate,
}) => {
  if (!isOpen) return null;
  
  const handleExportCsv = () => {
    // In a real implementation, this would generate and download a CSV file
    console.log('Exporting CSV report', format(selectedDate, 'MMMM yyyy'));
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>LLM Usage Report</CardTitle>
            <CardDescription>
              Detailed breakdown of AI word usage by feature and user for {format(selectedDate, 'MMMM yyyy')}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExportCsv}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="features">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="features">
                <PieChart className="h-4 w-4 mr-2" />
                Features
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="feature-users">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Feature-User Breakdown
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="features">
            <FeatureUsageTab selectedDate={selectedDate} />
          </TabsContent>
          
          <TabsContent value="users">
            <UserUsageTab selectedDate={selectedDate} />
          </TabsContent>
          
          <TabsContent value="feature-users">
            <FeatureUserBreakdownTab selectedDate={selectedDate} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LlmUsageReport;
