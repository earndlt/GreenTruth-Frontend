
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import TimelineSection from '../TimelineSection';

describe('TimelineSection', () => {
  const mockTimeline = [
    { label: 'Start', date: new Date('2025-01-01'), description: 'Start date', enabled: true },
    { label: 'End', date: new Date('2025-12-31'), description: 'End date', enabled: true }
  ];

  it('renders timeline dates correctly', () => {
    render(<TimelineSection timeline={mockTimeline} />);
    
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText(/Start Date: 1\/1\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/End Date: 12\/31\/2025/)).toBeInTheDocument();
  });

  it('handles empty timeline', () => {
    render(<TimelineSection timeline={[]} />);
    
    expect(screen.getByText('Start Date: Not set, End Date: Not set')).toBeInTheDocument();
  });
});
