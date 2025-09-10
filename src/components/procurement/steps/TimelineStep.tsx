
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { TimelineDate } from '../types';
import { cn } from '@/lib/utils';

interface TimelineStepProps {
  timeline: TimelineDate[];
  updateTimelineItem: (index: number, updates: Partial<TimelineDate>) => void;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ timeline, updateTimelineItem }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">RFP Timeline</h3>
        <p className="text-muted-foreground">
          Define key dates for your RFP process. Toggle to include or exclude dates from the final RFP.
        </p>
      </div>

      <div className="space-y-4">
        {timeline.map((item, index) => (
          <div key={index} className="border rounded-md p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <Switch 
                  id={`timeline-${index}`} 
                  checked={item.enabled}
                  onCheckedChange={(checked) => updateTimelineItem(index, { enabled: checked })}
                />
                <Label 
                  htmlFor={`timeline-${index}`} 
                  className={cn(
                    "text-base cursor-pointer",
                    !item.enabled && "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[220px] pl-3 text-left font-normal",
                      !item.date && "text-muted-foreground",
                      !item.enabled && "opacity-50"
                    )}
                    disabled={!item.enabled}
                  >
                    {item.date ? (
                      format(item.date, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={item.date || undefined}
                    onSelect={(date) => updateTimelineItem(index, { date: date || null })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="pl-10">
              <Input
                placeholder="Description (optional)"
                className={cn(
                  "w-full", 
                  !item.enabled && "opacity-50"
                )}
                value={item.description}
                onChange={(e) => updateTimelineItem(index, { description: e.target.value })}
                disabled={!item.enabled}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-muted/50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Timeline Tips</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Allow vendors sufficient time to prepare high-quality proposals</li>
          <li>Include a question period so vendors can clarify requirements</li>
          <li>Schedule adequate time for evaluation and vendor selection</li>
          <li>Consider industry standard timelines for your procurement type</li>
        </ul>
      </div>
    </div>
  );
};

export default TimelineStep;
