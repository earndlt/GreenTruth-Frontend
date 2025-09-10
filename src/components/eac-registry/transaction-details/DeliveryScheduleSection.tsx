
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { DeliveryItem } from '../TransactionDetailsModal';

interface DeliveryScheduleSectionProps {
  deliverySchedule: DeliveryItem[];
}

const DeliveryScheduleSection = ({ deliverySchedule }: DeliveryScheduleSectionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Delivery Schedule</h3>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliverySchedule.map((delivery, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{delivery.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {delivery.status === "completed" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4 text-orange-500" />
                          <span>Pending</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{delivery.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryScheduleSection;
