
import React from 'react';
import { cn } from '@/lib/utils';

interface EmissionPointCardProps {
  emissionPoint: string;
  className?: string;
  index?: number;
  selectedPipeline?: string;
  counterparty?: any;
}

const EmissionPointCard = ({ 
  emissionPoint, 
  className,
  index = 0, 
  selectedPipeline = "REX",
  counterparty = null
}: EmissionPointCardProps) => {
  const getEmissionPointColor = (point: string) => {
    switch (point) {
      case 'production': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-green-100 text-green-800';
      case 'transportation': return 'bg-purple-100 text-purple-800';
      case 'gathering': return 'bg-amber-100 text-amber-800';
      case 'thermal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatEmissionPoint = (point: string): string => {
    switch (point) {
      case 'production': return 'P';
      case 'processing': return 'Pr';
      case 'transportation': return 'T';
      case 'gathering': return 'G';
      case 'thermal': return 'C';
      default: return point.charAt(0).toUpperCase();
    }
  };

  return (
    <div className={cn(
      'flex items-center justify-center w-6 h-6 rounded-full font-medium text-xs',
      getEmissionPointColor(emissionPoint),
      className
    )}>
      {formatEmissionPoint(emissionPoint)}
    </div>
  );
};

export default EmissionPointCard;
