
import React from 'react';
import { TimelineDate } from '../../types';

interface TimelineSectionProps {
  timeline: TimelineDate[];
}

const TimelineSection = ({ timeline }: TimelineSectionProps) => {
  const startDate = timeline.length > 0 && timeline[0].date ? 
    timeline[0].date.toLocaleDateString() : 'Not set';
  const endDate = timeline.length > 0 && timeline[timeline.length - 1].date ? 
    timeline[timeline.length - 1].date.toLocaleDateString() : 'Not set';

  return (
    <div>
      <h4 className="text-sm font-medium">Timeline</h4>
      <p className="text-sm text-muted-foreground">
        Start Date: {startDate}, End Date: {endDate}
      </p>
    </div>
  );
};

export default TimelineSection;
