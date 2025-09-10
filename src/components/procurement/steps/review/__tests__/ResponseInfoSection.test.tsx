
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import ResponseInfoSection from '../ResponseInfoSection';
import { useToast } from '@/hooks/use-toast';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('ResponseInfoSection', () => {
  const mockEmail = 'response@example.com';

  beforeEach(() => {
    // Reset the mock clipboard API before each test
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn()
      }
    });
  });

  it('renders response email correctly', () => {
    render(<ResponseInfoSection responseEmail={mockEmail} />);
    
    expect(screen.getByText('Response Information')).toBeInTheDocument();
    expect(screen.getByText(mockEmail)).toBeInTheDocument();
  });

  it('copies email to clipboard when copy button is clicked', async () => {
    render(<ResponseInfoSection responseEmail={mockEmail} />);
    
    const copyButton = screen.getByText('Copy');
    await fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockEmail);
  });
});
