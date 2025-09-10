
import React from 'react';
import { ExternalLink } from 'lucide-react';

const VendorIdStandardArticle: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Vendor ID Assignment Standard</h2>
      
      <p>
        GreenTruth assigns a unique Vendor ID to each vendor in your directory using a consistent 
        standard that ensures uniqueness across your organization.
      </p>
      
      <h3 className="text-lg font-medium mt-6">Vendor ID Structure</h3>
      
      <div className="bg-muted p-4 rounded-md my-3 font-mono text-sm">
        <p><strong>Format:</strong> [EntityHash]-[VendorHash]</p>
        <p><strong>Example:</strong> 3EF69181-69B94DBD</p>
      </div>
      
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>EntityHash:</strong> A CRC32 hash derived from your corporate entity name 
          (first part of the ID)
        </li>
        <li>
          <strong>VendorHash:</strong> A CRC32 hash derived from the vendor's name 
          (second part of the ID)
        </li>
      </ul>
      
      <p className="text-sm bg-blue-50 border border-blue-100 p-3 rounded-md">
        This two-part structure ensures that identical vendor names across different corporate entities
        will still have unique IDs in the GreenTruth system, enabling accurate tracking and reporting.
      </p>
      
      <h3 className="text-lg font-medium mt-6">How Vendor IDs Are Generated</h3>
      
      <ol className="list-decimal pl-6 space-y-2">
        <li>The corporate entity name is normalized (spaces trimmed, converted to uppercase)</li>
        <li>The vendor name is normalized (spaces trimmed, converted to uppercase)</li>
        <li>CRC32 hash algorithm is applied to each name</li>
        <li>The hashes are combined in the format [EntityHash]-[VendorHash]</li>
      </ol>
      
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-md mt-4">
        <h4 className="font-medium text-amber-800">Important</h4>
        <p className="text-amber-700 text-sm mt-1">
          Every time the same vendor name is added to the same corporate entity, it will receive the identical 
          vendor ID. This consistency allows for reliable reference across systems.
        </p>
      </div>
      
      <h3 className="text-lg font-medium mt-6">ERP System Integration</h3>
      
      <p>
        When synchronizing your vendor directory with an ERP system, you can choose which vendor ID
        system takes precedence:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="border rounded-md p-4">
          <h4 className="font-medium">GreenTruth ID Takes Precedence</h4>
          <p className="text-sm mt-2">
            Your ERP system will adopt the GreenTruth-generated vendor IDs during synchronization.
            This option provides consistency across all GreenTruth features and reports.
          </p>
        </div>
        
        <div className="border rounded-md p-4">
          <h4 className="font-medium">ERP ID Takes Precedence</h4>
          <p className="text-sm mt-2">
            GreenTruth will use your existing ERP-assigned vendor IDs.
            Choose this if your organization already has an established vendor ID system.
          </p>
        </div>
      </div>
      
      <h3 className="text-lg font-medium mt-6">Configuring Vendor ID Precedence</h3>
      
      <ol className="list-decimal pl-6 space-y-2">
        <li>Navigate to <strong>Integration Hub</strong> from the main menu</li>
        <li>Select <strong>ERP Integration</strong> panel</li>
        <li>Go to the <strong>Configuration</strong> tab</li>
        <li>Find the <strong>ERP Vendor ID takes precedence</strong> toggle</li>
        <li>Enable or disable based on your preference</li>
      </ol>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
        <h4 className="text-blue-700 font-medium">Note</h4>
        <p className="text-blue-700 text-sm mt-1">
          The Integration Hub feature requires a Business subscription or higher, or an Integration Hub add-on
          for Team subscriptions.
        </p>
      </div>
    </div>
  );
};

export default VendorIdStandardArticle;
