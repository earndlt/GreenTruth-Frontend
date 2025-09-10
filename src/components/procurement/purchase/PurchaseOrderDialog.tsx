
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendorName: string;
  onSubmit: () => void;
}

const PurchaseOrderDialog: React.FC<PurchaseOrderDialogProps> = ({
  open,
  onOpenChange,
  vendorName,
  onSubmit
}) => {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('0.05');
  const [numEmissionPoints, setNumEmissionPoints] = useState(1);
  
  const totalPricePerMMBtu = (Number(price) * numEmissionPoints).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would submit the purchase order details
    console.log('Submitting purchase order:', { 
      quantity, 
      pricePerPoint: price,
      numEmissionPoints,
      totalPricePerMMBtu
    });
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Create a purchase order for EACs from {vendorName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (MMBtu)</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emissionPoints">Number of Emission Points</Label>
            <Input
              id="emissionPoints"
              type="number"
              min="1"
              max="4"
              placeholder="Enter number of emission points"
              value={numEmissionPoints}
              onChange={(e) => setNumEmissionPoints(Number(e.target.value))}
              required
            />
            <p className="text-sm text-muted-foreground">Standard points: production, processing, transportation, gathering</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price per MMBtu per emission point ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="Enter price per unit"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium">Total price: ${totalPricePerMMBtu}/MMBtu</p>
            <p className="text-xs text-muted-foreground">
              (${price}/MMBtu x {numEmissionPoints} emission points)
            </p>
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Purchase Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderDialog;
