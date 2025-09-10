
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import BasicInfo from '../BasicInfo';

describe('BasicInfo', () => {
  const mockProps = {
    title: 'Test RFP',
    selectedCategory: '1'
  };

  it('renders title and category correctly', () => {
    render(<BasicInfo {...mockProps} />);
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Test RFP')).toBeInTheDocument();
    expect(screen.getByText('Product Category')).toBeInTheDocument();
  });

  it('handles null category', () => {
    render(<BasicInfo title="Test RFP" selectedCategory={null} />);
    
    expect(screen.getByText('None selected')).toBeInTheDocument();
  });
});
