
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import CustomAttributesSection from '../CustomAttributesSection';

describe('CustomAttributesSection', () => {
  it('renders string custom attributes', () => {
    const customAttrs = 'Test custom attribute';
    render(<CustomAttributesSection customAttributes={customAttrs} />);
    
    expect(screen.getByText('Custom Attributes')).toBeInTheDocument();
    expect(screen.getByText(customAttrs)).toBeInTheDocument();
  });

  it('renders array custom attributes', () => {
    const customAttrs = [
      { name: 'Attr1', value: 'Value1' },
      { name: 'Attr2', value: 'Value2' }
    ];
    render(<CustomAttributesSection customAttributes={customAttrs} />);
    
    expect(screen.getByText('Attr1: Value1')).toBeInTheDocument();
    expect(screen.getByText('Attr2: Value2')).toBeInTheDocument();
  });
});
