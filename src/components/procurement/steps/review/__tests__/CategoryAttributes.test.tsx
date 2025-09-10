
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import CategoryAttributes from '../CategoryAttributes';

describe('CategoryAttributes', () => {
  const mockProps = {
    selectedMrvSubcategories: [{ id: '1', name: 'Test MRV', description: 'Test desc', selected: true }],
    selectedAttributes: [{ id: '1', name: 'Test Attr', description: 'Test desc', selected: true }]
  };

  it('renders MRV subcategories and attributes correctly', () => {
    render(<CategoryAttributes {...mockProps} />);
    
    expect(screen.getByText('MRV Subcategories')).toBeInTheDocument();
    expect(screen.getByText('Test MRV')).toBeInTheDocument();
    expect(screen.getByText('Environmental Attributes')).toBeInTheDocument();
    expect(screen.getByText('Test Attr')).toBeInTheDocument();
  });

  it('handles empty selections', () => {
    render(<CategoryAttributes selectedMrvSubcategories={[]} selectedAttributes={[]} />);
    
    expect(screen.getAllByText('None selected')).toHaveLength(2);
  });
});
