
import React from 'react';

const AiCapabilities = () => {
  return (
    <section className="border-t pt-4 mb-6 pdf-section">
      <h3 className="text-xl font-medium mb-3">AI Capabilities</h3>
      <div className="bg-muted/30 p-4 rounded-md mb-4">
        <p className="text-sm mb-3">
          GreenTruth leverages advanced AI throughout the platform to enhance user productivity and data insights:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Vendor matching algorithms for procurement</li>
          <li>Predictive analytics for market trends</li>
          <li>Natural language processing for document analysis</li>
          <li>AI Agent for conversational platform interaction</li>
          <li>RFI/RFP response evaluation</li>
          <li>Risk assessment and recommendations</li>
        </ul>
      </div>
    </section>
  );
};

export default AiCapabilities;
