
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MatchedEAC } from '../../types';
import EacCard from './EacCard';

interface EacCardsViewProps {
  matchedEACs: MatchedEAC[];
  selectedPipeline: "REX" | "Ruby";
}

const EacCardsView: React.FC<EacCardsViewProps> = ({ matchedEACs, selectedPipeline }) => {
  console.log("EacCardsView - Rendering with matchedEACs:", matchedEACs);
  
  if (!matchedEACs || matchedEACs.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No matching EACs found. Try adjusting your search criteria.</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[550px] pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
        {matchedEACs.map((eac, index) => (
          <EacCard 
            key={eac.id || `eac-${index}`} 
            eac={eac} 
            selectedPipeline={selectedPipeline} 
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default EacCardsView;
