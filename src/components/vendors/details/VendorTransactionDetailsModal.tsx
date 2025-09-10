
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Vendor, Transaction } from '../types/vendorTypes';

interface VendorTransactionDetailsModalProps {
  open: boolean;
  transaction: Transaction | null;
  vendor: Vendor;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-800',
  Accepted: 'bg-blue-100 text-blue-800',
  Rejected: 'bg-red-100 text-red-800',
  Pending: 'bg-amber-100 text-amber-800'
};

const VendorTransactionDetailsModal: React.FC<VendorTransactionDetailsModalProps> = ({
  open,
  transaction,
  vendor,
  onClose,
}) => {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            Vendor: <span className="font-medium">{vendor.name}</span>
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
              <p className="font-mono text-sm">{transaction.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Transaction Type</p>
              <p className="font-medium">{transaction.type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              <p className="font-medium">{transaction.amount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Date</p>
              <p className="font-medium">{transaction.date}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <span className={`px-2 py-1 rounded-full text-xs ${statusColors[transaction.status] || "bg-gray-100 text-gray-800"}`}>
                {transaction.status}
              </span>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default VendorTransactionDetailsModal;

