
/**
 * Utility functions for calculating EAC delivery dates based on transaction details
 */

/**
 * Calculate delivery dates based on frequency for forward transactions
 * Ensures monthly deliveries that are temporally matched with physical molecules
 * within 60 days of receipt
 */
export const calculateDeliveryDates = (
  transactionType: string, 
  startDate?: string, 
  endDate?: string,
  deliveryFrequency?: string
): string[] => {
  if (transactionType !== 'forward' || !startDate || !endDate) {
    // For spot transactions, we return a single delivery date (60 days from now)
    if (transactionType === 'spot') {
      const sixtyDaysFromNow = new Date();
      sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
      return [sixtyDaysFromNow.toLocaleDateString()];
    }
    return [];
  }
  
  const deliveryDates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate the contract duration in milliseconds
  const contractDuration = end.getTime() - start.getTime();
  const contractDurationDays = contractDuration / (1000 * 60 * 60 * 24);
  
  // Calculate number of monthly deliveries
  // We always use monthly delivery frequency regardless of what was passed
  const deliveryCount = Math.max(1, Math.ceil(contractDurationDays / 30));
  
  // Calculate monthly delivery dates
  // Each delivery will occur within 60 days after the month's gas flow
  for (let i = 0; i < deliveryCount; i++) {
    const monthEnd = new Date(start);
    monthEnd.setMonth(monthEnd.getMonth() + i + 1); // End of the month
    
    // Delivery occurs within 60 days after the month's gas flow
    const deliveryDate = new Date(monthEnd);
    deliveryDate.setDate(deliveryDate.getDate() + 30); // Approximately 30 days after month end
    
    deliveryDates.push(new Date(deliveryDate).toLocaleDateString());
  }
  
  return deliveryDates;
};

/**
 * Get delivery dates display text based on number of dates
 * Instead of returning JSX directly, we'll return the text content
 */
export const getDeliveryDatesDisplayText = (deliveryDates: string[]): string => {
  if (deliveryDates.length === 0) {
    return "No deliveries scheduled";
  } else if (deliveryDates.length === 1) {
    return `Token delivery will occur within 60 days: approximately ${deliveryDates[0]}`;
  } else {
    return `EAC tokens will be delivered in ${deliveryDates.length} monthly batches within 60 days of each month's physical gas flow`;
  }
};

/**
 * Get the CSS class name for the delivery dates display
 */
export const getDeliveryDatesDisplayClass = (): string => {
  return "text-xs text-gray-500 mt-1";
};
