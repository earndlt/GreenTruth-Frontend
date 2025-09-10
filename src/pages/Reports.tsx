
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, BarChart, PieChart } from 'lucide-react';
import AutoReportGenerator from '@/components/reports/AutoReportGenerator';
import WalletReportInsights from '@/components/reports/WalletReportInsights';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
      
      {/* Agentic Reporting Components */}
      <AutoReportGenerator />
      <WalletReportInsights />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Compliance Summary
              </div>
            </CardTitle>
            <CardDescription>Monthly compliance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Last updated: April 8, 2025
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Carbon Emissions
              </div>
            </CardTitle>
            <CardDescription>Quarterly emissions report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Last updated: April 5, 2025
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Vendor Analytics
              </div>
            </CardTitle>
            <CardDescription>Supplier performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Last updated: April 9, 2025
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Reports generated in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Q1 2025 Sustainability Report", date: "April 7, 2025", type: "PDF" },
              { name: "March Compliance Summary", date: "April 2, 2025", type: "Excel" },
              { name: "Supply Chain Risk Assessment", date: "March 29, 2025", type: "PDF" },
              { name: "Vendor Compliance Audit", date: "March 25, 2025", type: "Excel" },
              { name: "Carbon Footprint Analysis", date: "March 20, 2025", type: "PDF" }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-muted-foreground">{report.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm px-2 py-1 bg-muted rounded-full">{report.type}</span>
                  <button className="p-1 hover:bg-muted rounded-full">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
