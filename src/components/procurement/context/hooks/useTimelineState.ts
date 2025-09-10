
import { useState } from 'react';
import { TimelineDate } from '../../types';

// Create default timeline dates with preset offsets
export const createDefaultTimeline = (): TimelineDate[] => {
  const now = new Date();
  
  return [
    {
      label: 'RFP Release Date',
      date: now,
      description: 'Date when the RFP is published',
      enabled: true
    },
    {
      label: 'Questions Deadline',
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // +2 weeks
      description: 'Deadline for vendors to submit questions',
      enabled: true
    },
    {
      label: 'Proposal Submission Deadline',
      date: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000), // +4 weeks
      description: 'Deadline for vendors to submit proposals',
      enabled: true
    },
    {
      label: 'Evaluation Period',
      date: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000), // +5 weeks
      description: 'Period for evaluating submitted proposals',
      enabled: true
    },
    {
      label: 'Vendor Selection',
      date: new Date(now.getTime() + 49 * 24 * 60 * 60 * 1000), // +7 weeks
      description: 'Date when vendor will be selected',
      enabled: true
    },
    {
      label: 'Project Commencement',
      date: new Date(now.getTime() + 70 * 24 * 60 * 60 * 1000), // +10 weeks
      description: 'Expected start date of the project',
      enabled: true
    }
  ];
};

export const useTimelineState = () => {
  const [timeline, setTimeline] = useState<TimelineDate[]>(createDefaultTimeline());

  const updateTimelineItem = (index: number, updates: Partial<TimelineDate>) => {
    setTimeline(prev => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  return {
    timeline,
    updateTimelineItem
  };
};
