import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PlaidScriptTest: React.FC = () => {
    const [scriptStatus, setScriptStatus] = useState<string>('Checking...');

    useEffect(() => {
        // Check if Plaid script is loaded
        const checkPlaidScript = () => {
            // Check if window.Plaid is available
            if (typeof window !== 'undefined' && (window as any).Plaid) {
                setScriptStatus('✅ Plaid script loaded successfully');
                console.log('Plaid object available:', (window as any).Plaid);
            } else {
                setScriptStatus('❌ Plaid script not loaded');
                console.log('Plaid object not available');
            }

            // Check if the script tag exists
            const scriptTag = document.querySelector('script[src*="plaid.com"]');
            if (scriptTag) {
                console.log('Plaid script tag found:', scriptTag);
            } else {
                console.log('Plaid script tag not found');
            }
        };

        // Check immediately
        checkPlaidScript();

        // Check again after a short delay to ensure script has time to load
        const timeout = setTimeout(checkPlaidScript, 1000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Plaid Script Test</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm">{scriptStatus}</p>
                <div className="mt-4 text-xs text-gray-600">
                    <p>Check browser console for detailed information.</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default PlaidScriptTest; 