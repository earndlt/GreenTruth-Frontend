
import React from 'react';
import { MatchedEAC } from './types';

// Import our components
import NoEacsFound from './components/eac-display/NoEacsFound';
import EacSummary from './components/eac-display/EacSummary';
import EacListView from './components/eac-display/EacListView';

interface MatchedEacsDisplayProps {
  matchedEACs: MatchedEAC[];
  selectedPipeline: "REX" | "Ruby";
}

const MatchedEacsDisplay: React.FC<MatchedEacsDisplayProps> = ({ 
  matchedEACs,
  selectedPipeline
}) => {
  console.log("MatchedEacsDisplay - Rendering with EAC count:", matchedEACs?.length, "Pipeline:", selectedPipeline);
  
  if (!matchedEACs || matchedEACs.length === 0) {
    return <NoEacsFound />;
  }

  return (
    <div className="space-y-4" data-testid="matched-eacs-display">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Matched EACs</h2>
      </div>
      
      <EacSummary matchedEACs={matchedEACs} />
      
      <div className="mt-4">
        <EacListView matchedEACs={matchedEACs} selectedPipeline={selectedPipeline} />
      </div>
    </div>
  );
};

export default MatchedEacsDisplay;
