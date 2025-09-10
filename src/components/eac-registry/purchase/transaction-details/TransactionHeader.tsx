
import React from 'react';
import { EacData } from '../types';

interface TransactionHeaderProps {
  eacData: EacData;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({ eacData }) => {
  return (
    <div className="bg-blue-50 p-3 rounded-md mb-4">
      <h3 className="font-medium text-blue-800">Transaction Details</h3>
      <p className="text-sm text-blue-700 mt-1">
        Configure how you want to purchase EACs from {eacData.producer}
      </p>
    </div>
  );
};

export default TransactionHeader;
