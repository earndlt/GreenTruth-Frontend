
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import VendorSection from '../VendorSection';

describe('VendorSection', () => {
  const mockProps = {
    vendorOptions: [
      { id: '1', name: 'Option 1', description: 'Desc 1', selected: true }
    ],
    vendorContacts: [
      { id: '1', name: 'John Doe', email: 'john@example.com', businessName: 'Test Corp' }
    ]
  };

  it('renders vendor options and contacts correctly', () => {
    render(<VendorSection {...mockProps} />);
    
    expect(screen.getByText('Vendor Distribution Options')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Vendor Contacts')).toBeInTheDocument();
    expect(screen.getByText('John Doe (john@example.com)')).toBeInTheDocument();
  });

  it('handles empty vendor data', () => {
    render(<VendorSection vendorOptions={[]} vendorContacts={[]} />);
    
    expect(screen.getByText('No options selected')).toBeInTheDocument();
  });
});
