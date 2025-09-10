
import React from 'react';
import { Leaf, ShieldCheck, Landmark } from 'lucide-react';

interface PolicyMatchProps {
  environmental: number;
  procurement: number;
  esg: number;
}

const PolicyMatch: React.FC<PolicyMatchProps> = ({ environmental, procurement, esg }) => {
  const renderProgressBar = (value: number) => (
    <div className="w-full bg-muted rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${
          value >= 80 
            ? 'bg-green-500' 
            : value >= 60 
            ? 'bg-amber-500' 
            : 'bg-destructive'
        }`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Policy Match Analysis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        The Greentruth graph RAG LLM has analyzed how this vendor aligns with your company policies:
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Leaf className="h-4 w-4 text-green-500 mr-2" />
                <span className="font-medium">Environmental Policy Match</span>
              </div>
              <span className="font-medium">{environmental}%</span>
            </div>
            {renderProgressBar(environmental)}
            <p className="text-xs text-muted-foreground mt-1">
              How well the vendor's environmental practices align with your company's environmental policy.
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <ShieldCheck className="h-4 w-4 text-blue-500 mr-2" />
                <span className="font-medium">Procurement Policy Match</span>
              </div>
              <span className="font-medium">{procurement}%</span>
            </div>
            {renderProgressBar(procurement)}
            <p className="text-xs text-muted-foreground mt-1">
              How well the vendor meets your company's procurement requirements and standards.
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <Landmark className="h-4 w-4 text-purple-500 mr-2" />
                <span className="font-medium">ESG Policy Match</span>
              </div>
              <span className="font-medium">{esg}%</span>
            </div>
            {renderProgressBar(esg)}
            <p className="text-xs text-muted-foreground mt-1">
              How well the vendor's ESG practices align with your company's ESG guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyMatch;
