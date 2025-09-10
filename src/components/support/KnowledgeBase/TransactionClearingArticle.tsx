
import React from 'react';
import { DollarSign, CreditCard, Clock, ShieldCheck } from 'lucide-react';

const TransactionClearingArticle = () => {
  return (
    <div className="space-y-6 pdf-content">
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Transaction Clearing & Payment Processing</h1>
        
        <p className="text-muted-foreground mb-4">
          GreenTruth's transaction clearing system provides a secure, efficient mechanism for processing both spot and forward EAC (Environmental Attribute Certificate) transactions while eliminating counterparty risk for sellers.
        </p>
      </section>
      
      <section className="mb-6 pdf-section">
        <h2 className="text-2xl font-semibold mb-3">Transaction Clearing Overview</h2>
        
        <div className="bg-muted/30 p-4 rounded-md mb-4">
          <p className="mb-3">
            EarnDLT, Inc. (the company behind GreenTruth) acts as the clearing entity for all transactions, ensuring:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Secure payment processing for both buyers and sellers</li>
            <li>Elimination of counterparty risk for sellers</li>
            <li>Rapid settlement within 24-36 hours for all completed transactions</li>
            <li>Verified payment methods from corporate buyers</li>
          </ul>
        </div>
      </section>
      
      <section className="mt-4 mb-6 pdf-section">
        <h2 className="text-2xl font-semibold mb-3">Payment Method Collection</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CreditCard className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-semibold">Payment Methods</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Corporate entities configure payment methods in the Settings section</li>
              <li>ACH/Wire transfers (preferred) - lower processing fees</li>
              <li>Credit cards - subject to standard processing fees</li>
              <li>Multiple payment methods can be configured per entity</li>
              <li>A primary payment method is designated for automatic transactions</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-semibold">Bank Account Verification</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Plaid integration securely verifies bank account ownership</li>
              <li>Real-time account validation eliminates failed transactions</li>
              <li>Bank account information stored securely</li>
              <li>Verified accounts displayed with &quot;Plaid Verified&quot; status</li>
              <li>Manual verification available for non-Plaid supported institutions</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="mt-4 mb-6 pdf-section">
        <h2 className="text-2xl font-semibold mb-3">Transaction Types & Processing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-semibold">Spot Transactions</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>One-time, immediate purchases of available EACs</li>
              <li>Payment processed at time of transaction</li>
              <li>Seller receives payment within 24-36 hours</li>
              <li>EACs transferred to buyer's wallet upon payment confirmation</li>
              <li>Transaction details available in Registry {`>`} Transactions tab</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              <h3 className="font-semibold">Forward Transactions</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Scheduled future deliveries over a specified period</li>
              <li>Initial deposit may be required (configurable by seller)</li>
              <li>Automated payments processed on each delivery date</li>
              <li>Payment failures trigger notifications to both parties</li>
              <li>EACs delivered upon successful payment processing</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="mt-4 mb-6 pdf-section">
        <h2 className="text-2xl font-semibold mb-3">Counterparty Risk Management</h2>
        
        <div className="bg-muted/30 p-4 rounded-md mb-4">
          <p className="mb-3">
            <strong>GreenTruth eliminates counterparty risk for sellers:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Risk Assumption:</strong> EarnDLT, Inc. assumes all counterparty risk, guaranteeing payment to sellers</li>
            <li><strong>Rapid Payment:</strong> Sellers receive payment within 24-36 hours of transaction completion regardless of buyer payment status</li>
            <li><strong>Buyer Verification:</strong> All corporate buyers undergo verification before transaction capability is enabled</li>
            <li><strong>Payment Method Validation:</strong> All payment methods are validated before transactions can be processed</li>
            <li><strong>Forward Contract Protection:</strong> EarnDLT manages payment collection for all scheduled deliveries</li>
          </ul>
        </div>
      </section>
      
      <section className="mt-4 mb-6 pdf-section">
        <h2 className="text-2xl font-semibold mb-3">Payment Processing Workflow</h2>
        
        <div className="space-y-4 mb-4">
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-medium">1. Transaction Initiation</h3>
            <p className="text-sm text-muted-foreground">
              Buyer selects EACs and transaction type (spot or forward), choosing payment method during checkout.
            </p>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-medium">2. Payment Authorization</h3>
            <p className="text-sm text-muted-foreground">
              For ACH: Plaid-verified account debited; For credit cards: Authorization and charge processed.
            </p>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-medium">3. EAC Transfer</h3>
            <p className="text-sm text-muted-foreground">
              Upon payment confirmation, EACs are transferred to buyer&apos;s wallet (immediate for spot, scheduled for forward).
            </p>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-medium">4. Seller Payment</h3>
            <p className="text-sm text-muted-foreground">
              EarnDLT processes payment to seller within 24-36 hours, regardless of buyer payment status.
            </p>
          </div>
          
          <div className="border-l-4 border-primary pl-4 py-2">
            <h3 className="font-medium">5. Transaction Records</h3>
            <p className="text-sm text-muted-foreground">
              Complete transaction history and payment records maintained in the Registry and available for reporting.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Note for Corporate Entities</h3>
        <p className="text-sm text-blue-700">
          To ensure smooth transaction processing, please configure your payment methods in the Transaction Payments section 
          under Settings {`>`} Admin before initiating any EAC purchases. At least one primary payment method must be 
          established for each corporate entity that will be purchasing EACs.
        </p>
      </section>
    </div>
  );
};

export default TransactionClearingArticle;
