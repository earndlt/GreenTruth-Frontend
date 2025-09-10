
import React from 'react';
import { format, addDays } from 'date-fns';
import { Check, Calendar } from 'lucide-react';

interface DeliveryScheduleVisualProps {
  startDate: string;
  endDate: string;
}

const DeliveryScheduleVisual: React.FC<DeliveryScheduleVisualProps> = ({
  startDate,
  endDate,
}) => {
  const getDeliveryDates = () => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error("Invalid date inputs:", { startDate, endDate });
        return [];
      }
      
      // Calculate the number of months between start and end dates
      const monthDiff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000)));
      
      console.log(`Calculating ${monthDiff} months of deliveries from ${startDate} to ${endDate}`);
      
      return Array.from({ length: monthDiff }, (_, index) => {
        // For each month, calculate the end date and delivery date
        const monthEnd = new Date(start);
        monthEnd.setMonth(start.getMonth() + index + 1);
        
        // If this would go beyond the end date, use the end date
        if (monthEnd > end) {
          monthEnd.setTime(end.getTime());
        }
        
        const deliveryDate = addDays(monthEnd, 60); // 60 days after month end
        return {
          periodEnd: monthEnd,
          deliveryDate: deliveryDate
        };
      });
    } catch (error) {
      console.error("Error calculating delivery dates:", error);
      return [];
    }
  };

  const deliverySchedule = getDeliveryDates();

  if (deliverySchedule.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      <p className="font-medium text-sm">Estimated EAC Delivery Schedule:</p>
      <div className="space-y-2">
        {deliverySchedule.map((delivery, index) => (
          <div 
            key={index} 
            className="flex items-center p-3 bg-green-50 border border-green-100 rounded"
          >
            <Calendar className="h-4 w-4 text-green-600 mr-2" />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">Delivery {index + 1}:</span>
                {' '}
                Physical flow period: {format(delivery.periodEnd, 'MMM d, yyyy')}
              </p>
              <p className="text-xs text-gray-600">
                Expected EAC delivery by: {format(delivery.deliveryDate, 'MMM d, yyyy')}
              </p>
            </div>
            <Check className="h-4 w-4 text-green-500 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryScheduleVisual;
