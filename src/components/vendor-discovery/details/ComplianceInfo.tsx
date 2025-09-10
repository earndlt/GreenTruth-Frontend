
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ComplianceInfoProps {
  score: number;
}

const ComplianceInfo: React.FC<ComplianceInfoProps> = ({ score }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Compliance Information</h3>
      <div className="flex items-center mb-3">
        <BarChart3 className="h-5 w-5 text-muted-foreground mr-2" />
        <span className="text-base font-medium">Compliance Score: {score}%</span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full ${
            score >= 80 
              ? 'bg-green-500' 
              : score >= 60 
              ? 'bg-amber-500' 
              : 'bg-destructive'
          }`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        This vendor has demonstrated a strong commitment to regulatory compliance and follows industry best practices.
      </p>
    </div>
  );
};

export default ComplianceInfo;
