
import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

export type ReportType = 'compliance' | 'emissions' | 'vendor' | 'custom';

export interface ReportOption {
  id: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const reportOptions: ReportOption[] = [
  {
    id: 'compliance',
    title: 'Compliance Report',
    description: 'Generate a regulatory compliance report based on EAC transactions',
    icon: <FileSpreadsheet className="h-5 w-5 text-primary" />
  },
  {
    id: 'emissions',
    title: 'Carbon Emissions Report',
    description: 'Calculate and report on carbon footprint based on EACs',
    icon: <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
  },
  {
    id: 'vendor',
    title: 'Vendor Analytics Report',
    description: 'Analyze vendor performance and EAC certification metrics',
    icon: <FileSpreadsheet className="h-5 w-5 text-amber-500" />
  },
  {
    id: 'custom',
    title: 'Custom Report',
    description: 'Generate a customized report with selected EAC metrics',
    icon: <FileSpreadsheet className="h-5 w-5 text-blue-500" />
  }
];

interface ReportOptionsProps {
  selectedReport: ReportType | null;
  onSelectReport: (type: ReportType) => void;
}

const ReportOptions: React.FC<ReportOptionsProps> = ({ selectedReport, onSelectReport }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reportOptions.map((option) => (
        <div
          key={option.id}
          className={`border rounded-md p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
            selectedReport === option.id ? 'border-primary bg-muted/50' : 'border-border'
          }`}
          onClick={() => onSelectReport(option.id)}
        >
          <div className="flex items-start gap-3">
            {option.icon}
            <div>
              <h3 className="font-medium">{option.title}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
            {selectedReport === option.id && (
              <ChevronRight className="h-4 w-4 ml-auto text-primary" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportOptions;
