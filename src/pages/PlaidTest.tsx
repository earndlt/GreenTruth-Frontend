import React from 'react';
import PlaidScriptTest from '@/components/examples/PlaidScriptTest';
import PlaidDebugTest from '@/components/examples/PlaidDebugTest';

const PlaidTest: React.FC = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Plaid Integration Test</h1>
            
            <PlaidScriptTest />
            <PlaidDebugTest />
            
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Steps:</h3>
                <ol className="text-sm text-yellow-700 space-y-1">
                    <li>1. Check if Plaid script is loaded (above)</li>
                    <li>2. Try fetching a link token (above)</li>
                    <li>3. Check browser console for errors</li>
                    <li>4. Ensure backend is running on localhost:5000</li>
                    <li>5. Verify Plaid credentials are set in backend .env</li>
                </ol>
            </div>
        </div>
    );
};

export default PlaidTest; 