import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Landmark, Loader2 } from 'lucide-react';

// Add type definition for Plaid
declare global {
  interface Window {
    Plaid: {
      create: (config: any) => {
        open: () => void;
      };
    };
  }
}

interface PlaidLinkProps {
  linkToken: string | null;
  onSuccess: (publicToken: string, metadata: any) => void;
  onExit: () => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

const PlaidLink: React.FC<PlaidLinkProps> = ({ 
  linkToken, 
  onSuccess, 
  onExit, 
  isLoading,
  isDisabled = false
}) => {
  // Handle Plaid initialization
  const handlePlaidLinkClick = useCallback(() => {
    if (!linkToken || isLoading) return;

    // Initialize Plaid Link
    const plaidHandler = window.Plaid.create({
      token: linkToken,
      onSuccess: (publicToken: string, metadata: any) => {
        onSuccess(publicToken, metadata);
      },
      onExit: (err: any) => {
        onExit();
        if (err) {
          console.error('Plaid Link exit error:', err);
        }
      },
      onLoad: () => {
        // Handle loading
      },
      receivedRedirectUri: window.location.href,
    });

    // Open Plaid Link
    plaidHandler.open();
  }, [linkToken, onSuccess, onExit, isLoading]);

  return (
    <Button
      type="button"
      onClick={handlePlaidLinkClick}
      disabled={!linkToken || isLoading || isDisabled}
      variant="outline"
      className="w-full mt-4"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Landmark className="h-4 w-4 mr-2" />
      )}
      Connect Bank Account Securely
    </Button>
  );
};

export default PlaidLink;
