
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Vendor, Transaction } from '../types/vendorTypes';
import VendorTransactionDetailsModal from './VendorTransactionDetailsModal';

interface TransactionHistoryProps {
  vendor: Vendor;
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ vendor, transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [hoveredTransactionId, setHoveredTransactionId] = useState<string | null>(null);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction History</CardTitle>
          <CardDescription>Recent transactions with {vendor.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-4 p-3 text-xs font-medium text-muted-foreground bg-muted">
              <div>Transaction</div>
              <div>Date</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            {transactions.map((transaction) => (
              <button
                key={transaction.id}
                className={`w-full text-left grid grid-cols-4 p-3 border-t items-center text-sm transition-colors cursor-pointer
                  ${
                    hoveredTransactionId === transaction.id 
                      ? 'bg-muted/50 border-l-4 border-muted-foreground' 
                      : 'bg-transparent'
                  }
                  hover:bg-muted/50 hover:border-l-4 hover:border-muted-foreground active:bg-muted focus:outline-none`}
                onClick={() => handleRowClick(transaction)}
                onMouseEnter={() => setHoveredTransactionId(transaction.id)}
                onMouseLeave={() => setHoveredTransactionId(null)}
                type="button"
              >
                <div>{transaction.type}</div>
                <div>{transaction.date}</div>
                <div>{transaction.amount}</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'Accepted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <VendorTransactionDetailsModal
        open={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={closeModal}
        vendor={vendor}
      />
    </>
  );
};

export default TransactionHistory;

