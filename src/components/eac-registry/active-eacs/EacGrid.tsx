
import React from 'react';
import EacCard from './EacCard';

interface EacGridProps {
  eacData: any[];
  onPurchase: (eac: any) => void;
}

const EacGrid: React.FC<EacGridProps> = ({ eacData, onPurchase }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {eacData.map((eac) => (
        <EacCard key={eac.id} eac={eac} onPurchase={onPurchase} />
      ))}
    </div>
  );
};

export default EacGrid;
