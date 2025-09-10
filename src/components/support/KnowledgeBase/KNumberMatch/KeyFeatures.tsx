import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const KeyFeatures = () => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Key Features</h2>
      <div className="space-y-5">
        <div>
          <h3 className="font-medium text-lg">Pipeline Selection</h3>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Support for both REX and Ruby pipeline contracts</li>
            <li>Pipeline-specific contract validation</li>
            <li>Automatic producer verification for REX pipeline</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-lg">Contract and Receipt Location Identification</h3>
          <p className="mt-1 text-muted-foreground">Essential identification elements required for proper matching:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Contract ID (K#):</strong> The unique identifier for your pipeline contract</li>
            <li><strong>Receipt Location ID (Rcpt LOC):</strong> <span className="text-primary font-medium">Required for REX pipeline</span> contracts to correctly identify the physical location where your gas is received from the pipeline</li>
            <li>Real-time validation of both identifiers to ensure accurate matching</li>
          </ul>
          
          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              For REX pipeline contracts, both the K# identifier AND the Receipt Location ID must be provided to successfully match EACs. Ruby pipeline contracts require only the K# identifier.
            </AlertDescription>
          </Alert>
        </div>
        
        <div>
          <h3 className="font-medium text-lg">Transaction Types</h3>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Spot Orders:</strong> Immediate or short-term contracts for current or past volumes</li>
            <li><strong>Forward Orders:</strong> Future delivery contracts with customizable date ranges</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-lg">Emission Point Selection</h3>
          <p className="mt-1">Match EACs across multiple emission points in the natural gas value chain:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Natural Gas Production</li>
            <li>Gas Processing</li>
            <li>Transportation</li>
            <li>Gathering & Boosting</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-lg">Counterparty Identification</h3>
          <p className="mt-1">Essential for proper book and claim matching within the system:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Identify known counterparties for each emission point</li>
            <li>Auto-population of transportation counterparty based on selected pipeline</li>
            <li>Manual entry available for custom counterparty information</li>
            <li>Verification status indicators for approved counterparties</li>
          </ul>
          
          <Alert className="mt-4 bg-amber-50 border-amber-200">
            <AlertDescription>
              Proper counterparty information significantly improves matching accuracy. For best results, always provide complete counterparty details when available.
            </AlertDescription>
          </Alert>
        </div>

        <div>
          <h3 className="font-medium text-lg">Book and Claim Matching</h3>
          <p className="mt-1">Sophisticated matching algorithms ensure accurate and compliant EAC assignment:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Temporal Matching:</strong> EACs are matched to contracts based on time period validity</li>
            <li><strong>Geolocation Matching:</strong> Physical location-based matching using receipt location and pipeline information</li>
            <li><strong>Volume Verification:</strong> Ensures EAC volumes correspond to contract volumes</li>
            <li><strong>Counterparty Alignment:</strong> Matches based on verified counterparty relationships</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-lg">Advanced Data Elements</h3>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Carbon Neutral certification options</li>
            <li>QET and CET compatibility tracking</li>
            <li>Environmental impact metrics (water usage, land usage, air impact)</li>
            <li>Community impact assessment</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
