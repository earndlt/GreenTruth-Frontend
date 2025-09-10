
import { TimelineDate } from '../../types';

export const formatTimeline = (timeline: TimelineDate[]): string => {
  if (!timeline || timeline.length === 0) {
    return "No timeline specified";
  }
  
  return timeline.map(item => {
    const dateStr = item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date not set';
    return `${item.label}: ${dateStr}${item.description ? ` - ${item.description}` : ''}`;
  }).join('\n');
};
