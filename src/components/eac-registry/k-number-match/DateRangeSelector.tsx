
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { KNumberMatchFormValues } from './schema';

interface DateRangeSelectorProps {
  form: UseFormReturn<KNumberMatchFormValues>;
  orderType: "spot" | "forward";
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ form, orderType }) => {
  const today = new Date();
  const isForward = orderType === "forward";
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  
  // Track the default month to display in the end date calendar
  const [endDateDefaultMonth, setEndDateDefaultMonth] = useState<Date | undefined>(undefined);

  // Update the end date default month whenever the start date changes
  useEffect(() => {
    const startDate = form.getValues("startDate");
    if (startDate) {
      // Set the end date default month to the start date (will show the same month)
      setEndDateDefaultMonth(new Date(startDate));
    }
  }, [form.watch("startDate")]);

  // Handle start date selection
  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    form.setValue('startDate', date);
    
    // Set end date default month to the selected start date
    setEndDateDefaultMonth(date);
    
    // Close start date popover and open end date popover
    setStartDateOpen(false);
    
    // Wait briefly before opening the end date popover
    setTimeout(() => {
      setEndDateOpen(true);
    }, 100);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date</FormLabel>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={field.value}
                  onSelect={handleStartDateSelect}
                  disabled={(date) => 
                    isForward ? date <= today : date > today
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>End Date</FormLabel>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={!form.getValues("startDate")}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setEndDateOpen(false);
                  }}
                  // Set the month to display using our tracked end date default month
                  defaultMonth={endDateDefaultMonth}
                  disabled={(date) => {
                    const startDate = form.getValues("startDate");
                    if (!startDate) return true;
                    
                    // For forward transactions: disable dates before or equal to start date
                    // For spot transactions: disable dates after today or before/equal to start date
                    return isForward ? 
                      date <= startDate : 
                      date > today || date <= startDate;
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateRangeSelector;
