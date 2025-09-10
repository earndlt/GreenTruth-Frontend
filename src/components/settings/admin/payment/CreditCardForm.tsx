
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CreditCard } from 'lucide-react';

interface CreditCardFormProps {
  nameOnCard: string;
  setNameOnCard: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  expiryDate: string;
  setExpiryDate: (value: string) => void;
  cvv: string;
  setCvv: (value: string) => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  nameOnCard,
  setNameOnCard,
  cardNumber,
  setCardNumber,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv
}) => {
  return (
    <>
      <div className="flex items-center border rounded-md p-3 bg-gray-50 mb-4">
        <CreditCard className="h-5 w-5 mr-3 text-gray-500" />
        <span className="text-sm text-gray-700">
          Credit card transactions are subject to a 2.9% + $0.30 processing fee.
        </span>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nameOnCard">Name on Card</Label>
          <Input 
            id="nameOnCard" 
            value={nameOnCard} 
            onChange={(e) => setNameOnCard(e.target.value)} 
            placeholder="e.g., John Smith"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input 
            id="cardNumber" 
            value={cardNumber} 
            onChange={(e) => setCardNumber(e.target.value)} 
            placeholder="XXXX XXXX XXXX XXXX"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input 
              id="expiryDate" 
              value={expiryDate} 
              onChange={(e) => setExpiryDate(e.target.value)} 
              placeholder="MM/YY"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input 
              id="cvv" 
              value={cvv} 
              onChange={(e) => setCvv(e.target.value)} 
              placeholder="123"
              type="password"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditCardForm;
