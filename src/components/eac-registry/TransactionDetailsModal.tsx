
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import TransactionSummarySection from './transaction-details/TransactionSummarySection';
import EntityInformationSection from './transaction-details/EntityInformationSection';
import DeliveryScheduleSection from './transaction-details/DeliveryScheduleSection';

export type DeliveryItem = {
  date: string;
  status: 'completed' | 'pending';
  amount: string;
};

export type Transaction = {
  id: string;
  qet: string;
  type: string;
  entities: string;
  amount: string;
  timestamp: string;
  periodStart?: string;
  periodEnd?: string;
  deliverySchedule?: DeliveryItem[];
  deliveryFrequency?: string;
};

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetailsModal = ({ transaction, isOpen, onClose }: TransactionDetailsModalProps) => {
  if (!transaction) return null;

  // Split the entities into from and to
  const [from, to] = transaction.entities.split(' → ');
  
  // Determine if this is a forward-scheduled transaction
  const isForward = transaction.type === "Forward" && transaction.deliverySchedule && transaction.deliverySchedule.length > 0;
  
  // Count completed and pending deliveries
  const completedDeliveries = transaction.deliverySchedule?.filter(d => d.status === 'completed').length || 0;
  const pendingDeliveries = transaction.deliverySchedule?.filter(d => d.status === 'pending').length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            QET: {transaction.qet}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 space-y-4">
            <TransactionSummarySection 
              transaction={transaction}
              isForward={isForward}
              completedDeliveries={completedDeliveries}
              pendingDeliveries={pendingDeliveries}
            />

            <Separator />

            <EntityInformationSection from={from} to={to} />

            {isForward && transaction.deliverySchedule && (
              <>
                <Separator />
                <DeliveryScheduleSection deliverySchedule={transaction.deliverySchedule} />
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsModal;
