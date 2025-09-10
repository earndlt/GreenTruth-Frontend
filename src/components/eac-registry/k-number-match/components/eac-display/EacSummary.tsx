
import React from 'react';
import { formatNumber } from '@/lib/utils';
import { MatchedEAC } from '../../types';

interface EacSummaryProps {
  matchedEACs: MatchedEAC[];
}

const EacSummary: React.FC<EacSummaryProps> = ({ matchedEACs }) => {
  // Calculate total volume across all EACs
  const totalVolume = matchedEACs.reduce((sum, eac) => sum + eac.volume, 0);

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-900">
        Found {matchedEACs.length} matching EACs
      </h3>
      <p className="text-sm text-muted-foreground">
        Total Volume: {formatNumber(totalVolume)} MMBtu
      </p>
    </div>
  );
};

export default EacSummary;
