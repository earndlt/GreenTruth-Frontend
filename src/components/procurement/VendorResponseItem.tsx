
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Search } from 'lucide-react';

export interface VendorResponseItemProps {
  vendor: string;
  rfp: string;
  score: number;
  submitted: string;
}

const VendorResponseItem = ({
  vendor,
  rfp,
  score,
  submitted,
}: VendorResponseItemProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-destructive';
  };
  
  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg">
      <div className="mt-0.5">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-1 flex-1">
        <p className="font-medium">{vendor}</p>
        <p className="text-sm text-muted-foreground">Response to: {rfp}</p>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm">AI Score:</span>
            <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
          </div>
          <span className="text-xs text-muted-foreground">Submitted: {submitted}</span>
        </div>
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button size="sm">
            <Search className="h-4 w-4 mr-2" />
            Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorResponseItem;
