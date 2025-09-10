
import React from 'react';

const AdditionalInfo = () => {
  return (
    <>
      <section>
        <h2 className="text-xl font-semibold mb-4">EAC Details Display</h2>
        <p>For each matched EAC, you'll see comprehensive information including:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Unique EAC identifier</li>
          <li>Contract details (Contract ID, Upstream/Downstream contracts)</li>
          <li>Volume in MMBtu</li>
          <li>Source facility information</li>
          <li>Emission factors and points</li>
          <li>Time range validity</li>
          <li>Special designations (e.g., Carbon Offset status)</li>
          <li>Counterparty verification status</li>
          <li>Temporal and geolocation match quality indicators</li>
        </ul>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Transaction Process</h2>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>View total volume and EAC count before initiating transaction</li>
          <li>Set up payment method in company settings if needed</li>
          <li>Review all details including company information and counterparties</li>
          <li>Confirm transaction to complete the process</li>
        </ul>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Always verify the selected pipeline matches your contract</strong></li>
          <li><strong>For REX pipeline, ensure you have the correct Receipt Location ID</strong></li>
          <li>Provide complete counterparty information whenever possible</li>
          <li>Review all matched EACs carefully before proceeding</li>
          <li>Confirm volume requirements match your needs</li>
          <li>Check emission points align with reporting requirements</li>
          <li>Ensure payment methods are set up before initiating transactions</li>
          <li>Use the tabbed interface to easily navigate between search parameters and results</li>
        </ul>
      </section>
    </>
  );
};

export default AdditionalInfo;
