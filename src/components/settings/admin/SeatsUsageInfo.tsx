
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface SeatsUsageInfoProps {
  usedSeats: number;
  seatLimit: number;
  onUpgradeClick: () => void;
}

const SeatsUsageInfo = ({ usedSeats, seatLimit, onUpgradeClick }: SeatsUsageInfoProps) => {
  const availableSeats = seatLimit - usedSeats;

  return (
    <div className="flex items-center justify-between mt-4 p-4 rounded-md bg-blue-50 border border-blue-100">
      <div>
        <p className="text-sm font-medium text-blue-800">
          User Seats: {usedSeats} of {seatLimit} used
        </p>
        <p className="text-xs text-blue-600 mt-1">
          {availableSeats > 0 
            ? `You can add ${availableSeats} more user${availableSeats !== 1 ? 's' : ''} with your current plan.` 
            : 'You\'ve reached your plan\'s user limit. Upgrade to add more users.'}
        </p>
      </div>
      {availableSeats <= 2 && (
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white" 
          onClick={onUpgradeClick}
        >
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Upgrade Plan
        </Button>
      )}
    </div>
  );
};

export default SeatsUsageInfo;
