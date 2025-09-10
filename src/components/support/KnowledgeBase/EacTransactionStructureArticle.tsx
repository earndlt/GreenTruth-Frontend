
import React from 'react';
import { ArrowRight, TrendingUp, Clock, DollarSign, FileText } from 'lucide-react';

const EacTransactionStructureArticle = () => {
  return (
    <div className="space-y-6 pdf-content">
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-4">EAC Transaction Structuring Guide</h1>
        <p className="text-muted-foreground mb-4">
          GreenTruth supports two primary transaction structures for Environmental Attribute Certificates (EACs): spot purchases and forward contracts. This guide explains the key differences, benefits, and considerations for each structure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Spot Transactions</h2>
        <div className="bg-muted/30 p-4 rounded-md mb-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Immediate purchase and settlement</li>
                <li>Fixed price at time of transaction</li>
                <li>Available EACs delivered to buyer wallet within 24 hours</li>
                <li>One-time payment processed at transaction execution</li>
                <li>No long-term commitment required</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Best For</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Immediate compliance needs</li>
            <li>One-time purchases</li>
            <li>Price-sensitive buyers looking to take advantage of market conditions</li>
            <li>Entities with variable or unpredictable EAC requirements</li>
          </ul>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Forward Contracts</h2>
        <div className="bg-muted/30 p-4 rounded-md mb-4">
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Scheduled future deliveries over a specified period</li>
                <li>Fixed price for entire contract duration</li>
                <li>Monthly delivery schedule with automated settlements</li>
                <li>Automated recurring payments on delivery dates</li>
                <li>Long-term supply security</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Best For</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Long-term compliance planning</li>
            <li>Budget certainty and price risk management</li>
            <li>Regular, predictable EAC requirements</li>
            <li>Entities seeking supply security</li>
          </ul>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Payment & Settlement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Payment Methods</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>ACH/Wire transfers (preferred)</li>
              <li>Credit cards (subject to processing fees)</li>
              <li>Automated payments for forward contracts</li>
              <li>Payment required before EAC delivery</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <h3 className="font-medium">Settlement Process</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Spot: Same-day settlement upon payment</li>
              <li>Forward: Monthly settlement on delivery dates</li>
              <li>Automated wallet updates</li>
              <li>Digital transaction confirmations</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Note for First-Time Buyers</h3>
        <p className="text-sm text-blue-700">
          Before initiating your first transaction, ensure your payment methods are configured in Settings {`>`} Transaction Payments. 
          For guidance on selecting the most appropriate transaction structure for your needs, contact our support team.
        </p>
      </div>
    </div>
  );
};

export default EacTransactionStructureArticle;
