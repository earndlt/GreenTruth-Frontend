
import React from 'react';
import { ShieldCheck, Users } from 'lucide-react';

const KycVerificationArticle = () => {
  return (
    <div className="space-y-6 pdf-content">
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Entity Verification & KYC Process</h1>
        
        <p className="text-muted-foreground mb-4">
          GreenTruth maintains the highest standards of security and trust in our marketplace by ensuring all participating entities undergo thorough Know Your Customer (KYC) verification through Dun & Bradstreet.
        </p>
      </section>

      <section className="mb-6 pdf-section">
        <h2 className="text-2xl font-semibold mb-3">Verification Process</h2>
        
        <div className="bg-muted/30 p-4 rounded-md mb-4">
          <div className="flex items-center mb-2">
            <ShieldCheck className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-semibold">Dun & Bradstreet Integration</h3>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            <li>Every entity account is verified using Dun & Bradstreet's comprehensive business database</li>
            <li>D-U-N-S Number validation ensures accurate business identification</li>
            <li>Real-time verification of business registration and operating status</li>
            <li>Continuous monitoring for changes in business status or ownership</li>
          </ul>
        </div>
      </section>

      <section className="mb-6 pdf-section">
        <h2 className="text-2xl font-semibold mb-3">Benefits of KYC Verification</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold">For Market Participants</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Confidence in counterparty legitimacy</li>
              <li>Reduced risk of fraudulent transactions</li>
              <li>Streamlined business relationship establishment</li>
              <li>Enhanced trust in marketplace interactions</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ShieldCheck className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-semibold">For Platform Security</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Ensures regulatory compliance</li>
              <li>Prevents unauthorized market access</li>
              <li>Maintains market integrity</li>
              <li>Supports audit trail requirements</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Verification Status</h3>
        <p className="text-sm text-blue-700">
          All active entities on the GreenTruth platform have successfully completed Dun & Bradstreet verification. 
          This verification status is monitored continuously to ensure ongoing compliance and marketplace security.
        </p>
      </section>
    </div>
  );
};

export default KycVerificationArticle;
