
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import ReviewHeader from '../ReviewHeader';

describe('ReviewHeader', () => {
  it('renders the header text correctly', () => {
    render(<ReviewHeader />);
    
    expect(screen.getByText('Review Your RFP')).toBeInTheDocument();
    expect(screen.getByText('Please review all details of your RFP before finalizing')).toBeInTheDocument();
  });
});
