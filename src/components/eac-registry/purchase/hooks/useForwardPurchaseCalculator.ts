
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '../types';

export const useForwardPurchaseCalculator = (
  form: UseFormReturn<FormValues>,
  transactionType: string
) => {
  const dailyVolumeWatch = form.watch('dailyVolume');
  const deliveryFrequencyWatch = form.watch('deliveryFrequency');
  const startDateWatch = form.watch('startDate');
  const endDateWatch = form.watch('endDate');
  
  useEffect(() => {
    if (transactionType === 'forward' && 
        dailyVolumeWatch && 
        deliveryFrequencyWatch && 
        startDateWatch && 
        endDateWatch) {
      
      const start = new Date(startDateWatch);
      const end = new Date(endDateWatch);
      
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      const dailyVolume = parseFloat(dailyVolumeWatch);
      const totalVolume = dailyVolume * diffDays;
      
      let adjustedVolume = totalVolume;
      switch(deliveryFrequencyWatch) {
        case 'daily':
          break;
        case 'weekly':
          adjustedVolume = Math.ceil(totalVolume / 7) * 7;
          break;
        case 'monthly':
          adjustedVolume = Math.ceil(totalVolume / 30) * 30;
          break;
        case 'quarterly':
          adjustedVolume = Math.ceil(totalVolume / 90) * 90;
          break;
        case 'annually':
          adjustedVolume = Math.ceil(totalVolume / 365) * 365;
          break;
      }
      
      form.setValue('quantity', adjustedVolume.toString());
    }
  }, [dailyVolumeWatch, deliveryFrequencyWatch, startDateWatch, endDateWatch, transactionType, form]);
};
