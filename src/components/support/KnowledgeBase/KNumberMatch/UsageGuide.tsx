
import React from 'react';
import { Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const UsageGuide = () => {
  return (
    <section>
              <h2 className="text-xl font-semibold mb-4">Using the Gas Trace Tool</h2>
      <div className="space-y-5">
        <div>
          <h3 className="font-medium text-lg">Streamlined Interface</h3>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Tabbed Interface:</strong> Separate tabs for search parameters and results</li>
            <li>Immediate switching to results view when matches are found</li>
            <li>Clear transaction initiation options</li>
            <li>Collapsible advanced options to reduce complexity</li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-lg">Step-by-Step Process</h3>
          <ol className="list-decimal pl-5 space-y-3 mt-2">
            <li>
              <strong>Company Selection:</strong>
              <p className="mt-1 text-muted-foreground">Choose a company from the company selector at the top of the interface</p>
            </li>
            
            <li>
              <strong>Pipeline Selection:</strong>
              <p className="mt-1 text-muted-foreground">Select your target pipeline (REX or Ruby)</p>
            </li>
            
            <li>
              <strong>Enter Contract Details:</strong>
              <p className="mt-1 text-muted-foreground">Enter your valid pipeline contract ID (K#)</p>
              <p className="mt-1 text-muted-foreground">For REX pipeline: Enter the Receipt Location ID (Rcpt LOC) associated with your contract</p>
            </li>
            
            <li>
              <strong>Select Transaction Type:</strong>
              <p className="mt-1 text-muted-foreground">Choose between spot or forward transaction types</p>
              <p className="mt-1 text-muted-foreground">For forward transactions: Specify your desired date range</p>
            </li>
            
            <li>
              <strong>Emission Point Selection:</strong>
              <p className="mt-1 text-muted-foreground">Select one or more emission points relevant to your matching needs</p>
            </li>
            
            <li>
              <strong>Counterparty Information:</strong>
              <p className="mt-1 text-muted-foreground">For each selected emission point, indicate if you know the counterparty</p>
              <p className="mt-1 text-muted-foreground">Enter counterparty details if known, or select from approved counterparties</p>
              <p className="mt-1 text-muted-foreground">Note: Transportation counterparty is automatically set to the pipeline operator</p>
            </li>
            
            <li>
              <strong>Additional Data Elements:</strong>
              <p className="mt-1 text-muted-foreground">Select any additional data elements or certifications required</p>
            </li>
            
            <li>
              <strong>Match EACs:</strong>
              <p className="mt-1 text-muted-foreground">Click "Match EACs" to find all matching certificates</p>
            </li>
            
            <li>
              <strong>Review Results:</strong>
              <p className="mt-1 text-muted-foreground">The interface automatically switches to the Results tab</p>
              <p className="mt-1 text-muted-foreground">Review matched EACs details, volumes, and compatibility metrics</p>
            </li>
            
            <li>
              <strong>Initiate Transaction:</strong>
              <p className="mt-1 text-muted-foreground">Use the transaction card to initiate the process</p>
            </li>
            
            <li>
              <strong>Confirm Transaction:</strong>
              <p className="mt-1 text-muted-foreground">Review all details in the confirmation step</p>
              <p className="mt-1 text-muted-foreground">Complete the transaction</p>
            </li>
          </ol>
          
          <Alert className="mt-4 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Following this process ensures proper matching of EACs to your pipeline contracts, maintaining compliance and accuracy in environmental attribute tracking.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  );
};

export default UsageGuide;
