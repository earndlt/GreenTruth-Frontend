
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { MatchedEAC } from '../../types';
import EmissionPointCard from '../EmissionPointCard';

interface EacTableRowProps {
  eac: MatchedEAC;
}

const EacTableRow: React.FC<EacTableRowProps> = ({ eac }) => {
  return (
    <tr key={eac.id} className="border-b">
      <td className="p-2 align-middle font-mono text-xs">{eac.id}</td>
      <td className="p-2 align-middle">
        <div className="flex items-center">
          <EmissionPointCard 
            emissionPoint={eac.emissionPoint} 
            className="mr-2 h-5 w-5" 
          />
          <span>
            {eac.emissionPoint === 'thermal' 
              ? 'Carbon Offset' 
              : eac.emissionPoint.charAt(0).toUpperCase() + eac.emissionPoint.slice(1)
            }
          </span>
        </div>
      </td>
      <td className="p-2 align-middle text-right">
        {formatNumber(eac.dailyVolume || 0)} MMBtu/day
      </td>
      <td className="p-2 align-middle text-right">
        {formatNumber(eac.volume)} MMBtu
      </td>
      <td className="p-2 align-middle">{eac.emissionFactor}</td>
      <td className="p-2 align-middle">
        {eac.counterparty?.name ? (
          <span>
            {eac.counterparty.name}
            {eac.counterparty.isApproved && (
              <CheckCircle className="h-3 w-3 text-green-500 inline ml-1" />
            )}
          </span>
        ) : (
          <Badge variant="outline" className="bg-gray-50">
            Book & Claim
          </Badge>
        )}
      </td>
    </tr>
  );
};

export default EacTableRow;
