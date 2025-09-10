import React, { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PlaidDebugTest: React.FC = () => {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string[]>([]);

    const addDebugInfo = (info: string) => {
        setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${info}`]);
    };

    const fetchLinkToken = async () => {
        try {
            setIsLoading(true);
            addDebugInfo('Fetching link token...');

            const response = await fetch('http://localhost:5000/api/plaid/create-link-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 'test-user-123',
                    userName: 'Test User',
                }),
            });

            addDebugInfo(`Response status: ${response.status}`);
            const data = await response.json();
            addDebugInfo(`Response data: ${JSON.stringify(data)}`);

            if (data.success) {
                addDebugInfo(`Link token received: ${data.data.linkToken.substring(0, 20)}...`);
                setLinkToken(data.data.linkToken);
            } else {
                addDebugInfo(`Error: ${data.message}`);
            }
        } catch (error) {
            addDebugInfo(`Fetch error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (publicToken, metadata) => {
            addDebugInfo(`Success: ${publicToken}`);
        },
        onExit: (err, metadata) => {
            addDebugInfo(`Exit: ${err ? (typeof err === 'object' && err !== null && 'error_message' in err ? (err as any).error_message : JSON.stringify(err)) : 'No error'}`);
        },
        onEvent: (eventName, metadata) => {
            addDebugInfo(`Event: ${eventName}`);
        },
    });

    const handleOpenPlaid = () => {
        addDebugInfo(`Opening Plaid - ready: ${ready}, token: ${!!linkToken}`);
        if (ready && linkToken) {
            open();
        } else {
            addDebugInfo('Plaid not ready, fetching token...');
            fetchLinkToken();
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Plaid Debug Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Button onClick={fetchLinkToken} disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Fetch Link Token'}
                    </Button>
                    <Button onClick={handleOpenPlaid} disabled={!linkToken || !ready}>
                        Open Plaid Link
                    </Button>
                </div>

                <div className="text-sm">
                    <p>Link Token: {linkToken ? 'Present' : 'Not set'}</p>
                    <p>Ready: {ready ? 'Yes' : 'No'}</p>
                    <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
                </div>

                <div className="border rounded p-2 h-64 overflow-y-auto bg-gray-50">
                    <h4 className="font-semibold mb-2">Debug Log:</h4>
                    {debugInfo.map((info, index) => (
                        <div key={index} className="text-xs font-mono">
                            {info}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default PlaidDebugTest; 