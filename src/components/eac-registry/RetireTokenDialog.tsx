
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Flame, Snowflake, Beaker, Leaf, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface RetireTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
}

const RetireTokenDialog = ({ isOpen, onClose, companyName = "" }: RetireTokenDialogProps) => {
  const { toast } = useToast();
  const [tokenType, setTokenType] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [isProxyRetirement, setIsProxyRetirement] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set beneficiary to company name when the dialog opens or company changes
  useEffect(() => {
    if (companyName && !isProxyRetirement) {
      setBeneficiary(companyName);
    }
  }, [companyName, isProxyRetirement]);

  // Handle proxy retirement toggle
  const handleProxyRetirementChange = (checked: boolean) => {
    setIsProxyRetirement(checked);
    if (!checked && companyName) {
      // Reset to company name when turning off proxy retirement
      setBeneficiary(companyName);
    } else if (checked) {
      // Clear the beneficiary field when enabling proxy retirement
      setBeneficiary('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create payload for API call to EarnDLT
    const retirementPayload = {
      tokenType,
      amount: parseFloat(amount),
      purpose,
      beneficiary,
      isProxyRetirement,
      timestamp: new Date().toISOString()
    };
    
    // Simulate API call to retire tokens
    console.log("Sending retirement request to EarnDLT API:", retirementPayload);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Tokens retired successfully",
        description: `${amount} MMBtu of ${tokenType} tokens have been retired for ${beneficiary}.`,
      });
      
      // Reset form and close dialog
      setTokenType('');
      setAmount('');
      setPurpose('');
      setBeneficiary(companyName || '');
      setIsProxyRetirement(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Retire Tokens</DialogTitle>
          <DialogDescription>
            Retire tokens from your wallet to generate retirement certificates for environmental claims.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="token-type">Token Type</Label>
            <Select value={tokenType} onValueChange={setTokenType} required>
              <SelectTrigger id="token-type">
                <SelectValue placeholder="Select token type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Natural Gas Production">
                  <div className="flex items-center">
                    <Flame className="mr-2 h-4 w-4 text-orange-500" />
                    Natural Gas Production
                  </div>
                </SelectItem>
                <SelectItem value="LNG">
                  <div className="flex items-center">
                    <Snowflake className="mr-2 h-4 w-4 text-blue-500" />
                    LNG
                  </div>
                </SelectItem>
                <SelectItem value="Methanol">
                  <div className="flex items-center">
                    <Beaker className="mr-2 h-4 w-4 text-teal-500" />
                    Methanol
                  </div>
                </SelectItem>
                <SelectItem value="Carbon Credits">
                  <div className="flex items-center">
                    <Leaf className="mr-2 h-4 w-4 text-emerald-500" />
                    Carbon Credits
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (MMBtu)</Label>
            <Input 
              id="amount" 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to retire"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Retirement Purpose</Label>
            <Select value={purpose} onValueChange={setPurpose} required>
              <SelectTrigger id="purpose">
                <SelectValue placeholder="Select retirement purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Corporate Carbon Reduction">Corporate Carbon Reduction</SelectItem>
                <SelectItem value="Voluntary Carbon Offset">Voluntary Carbon Offset</SelectItem>
                <SelectItem value="Project Compliance">Project Compliance</SelectItem>
                <SelectItem value="Regulatory Compliance">Regulatory Compliance</SelectItem>
                <SelectItem value="Carbon Neutrality Claim">Carbon Neutrality Claim</SelectItem>
                <SelectItem value="Lifecycle Assessment">Lifecycle Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="proxy-retirement" 
              checked={isProxyRetirement}
              onCheckedChange={handleProxyRetirementChange}
            />
            <Label 
              htmlFor="proxy-retirement" 
              className="text-sm font-medium cursor-pointer"
            >
              Perform proxy retirement for a third-party
            </Label>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="beneficiary">
                {isProxyRetirement ? "Third-Party Beneficiary" : "Beneficiary"}
              </Label>
              {isProxyRetirement && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  <span>Proxy Retirement Enabled</span>
                </div>
              )}
            </div>
            <Input 
              id="beneficiary" 
              value={beneficiary} 
              onChange={(e) => setBeneficiary(e.target.value)}
              placeholder={isProxyRetirement ? "Enter third-party beneficiary name" : "Organization receiving the benefit"}
              disabled={!isProxyRetirement && companyName !== ""}
              required
            />
            {isProxyRetirement && (
              <p className="text-xs text-muted-foreground">
                The named third-party will be registered as the beneficiary of this retirement.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Retire Tokens"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RetireTokenDialog;
