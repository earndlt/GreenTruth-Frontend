import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { API_ENDPOINTS } from "@/config/api";

interface PlaidLinkProps {
    setShowAddPaymentDialog: (show: boolean) => void;
    onSuccess: (publicToken: string, metadata: any) => void;
    onExit: () => void;
}

const PlaidLink: React.FC<PlaidLinkProps> = ({
    setShowAddPaymentDialog,
    onSuccess,
    onExit,
}) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch link token from backend
    const fetchLinkToken = async () => {
        if (!user) {
            console.log('No user found, cannot fetch link token');
            return;
        }

        try {
            setIsLoading(true);
            console.log('Fetching link token for user:', user.id);

            const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/plaid/create-link-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    userName: user.name || user.email,
                }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                console.log('Link token received:', data.data.linkToken);
                setLinkToken(data.data.linkToken);
            } else {
                throw new Error(data.message || 'Failed to create link token');
            }
        } catch (error) {
            console.error('Error fetching link token:', error);
            toast({
                title: "Error",
                description: "Failed to initialize bank linking. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize link token on component mount
    useEffect(() => {
        console.log('PlaidLink component mounted, user:', user);
        fetchLinkToken();
    }, [user]);

    // Configure Plaid Link with minimal configuration
    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (publicToken: string, metadata: any) => {
            console.log('Plaid Link success:', { publicToken, metadata });
            onSuccess(publicToken, metadata);
        },
        onExit: (err: any, metadata: any) => {
            console.log('Plaid Link exit:', { err, metadata });
            onExit();
        },
        onEvent: (eventName: string, metadata: any) => {
            console.log('Plaid Link event:', eventName, metadata);
        },
    });

    // Auto-open Plaid when component is ready and should be shown
    useEffect(() => {
        if (ready && linkToken && !isLoading) {
            console.log('Auto-opening Plaid Link...');
            open();
        }
    }, [ready, linkToken, isLoading, open]);

    return null; // This component doesn't render anything visible, it just manages the Plaid modal
};

export default PlaidLink; 