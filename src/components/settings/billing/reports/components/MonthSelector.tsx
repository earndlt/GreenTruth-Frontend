
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MonthSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  maxDate?: Date;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ 
  selectedDate, 
  onChange,
  maxDate = new Date() 
}) => {
  // Generate list of available months (last 12 months)
  const generateAvailableMonths = () => {
    const months = [];
    const today = new Date();
    
    // Add up to 12 previous months
    for (let i = 0; i < 12; i++) {
      const date = subMonths(today, i);
      
      // Don't add future months
      if (date <= maxDate) {
        months.push(date);
      }
    }
    
    return months;
  };
  
  const availableMonths = generateAvailableMonths();
  
  const handlePreviousMonth = () => {
    const earliestMonth = availableMonths[availableMonths.length - 1];
    const previousMonth = subMonths(selectedDate, 1);
    
    // Only go back if not beyond the earliest available month
    if (previousMonth >= earliestMonth) {
      onChange(previousMonth);
    }
  };
  
  const handleNextMonth = () => {
    const nextMonth = addMonths(selectedDate, 1);
    
    // Don't allow selecting beyond current month
    if (nextMonth <= maxDate) {
      onChange(nextMonth);
    }
  };
  
  const handleSelectChange = (value: string) => {
    const [month, year] = value.split('-');
    const date = new Date(parseInt(year), parseInt(month), 1);
    onChange(date);
  };
  
  const isEarliestMonth = selectedDate.getTime() <= availableMonths[availableMonths.length - 1].getTime();
  const isLatestMonth = selectedDate.getTime() >= availableMonths[0].getTime();
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={handlePreviousMonth}
        disabled={isEarliestMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Select 
        value={`${selectedDate.getMonth()}-${selectedDate.getFullYear()}`}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            {format(selectedDate, 'MMMM yyyy')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((date) => (
            <SelectItem 
              key={`${date.getMonth()}-${date.getFullYear()}`} 
              value={`${date.getMonth()}-${date.getFullYear()}`}
            >
              {format(date, 'MMMM yyyy')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleNextMonth}
        disabled={isLatestMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MonthSelector;
