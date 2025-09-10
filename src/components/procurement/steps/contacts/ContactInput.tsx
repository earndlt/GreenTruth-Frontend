
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ContactInputProps {
  addVendorContact: (contact: { name: string; businessName: string; email: string }) => void;
}

const ContactInput: React.FC<ContactInputProps> = ({ addVendorContact }) => {
  const { toast } = useToast();
  const [newContact, setNewContact] = useState({
    name: '',
    businessName: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.businessName || !newContact.email) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all fields for the vendor contact.",
        variant: "destructive"
      });
      return;
    }

    if (!newContact.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    addVendorContact(newContact);
    setNewContact({ name: '', businessName: '', email: '' });
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <Label htmlFor="name">Contact Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={newContact.name} 
          onChange={handleInputChange} 
          placeholder="John Doe" 
        />
      </div>
      <div>
        <Label htmlFor="businessName">Business Name</Label>
        <Input 
          id="businessName" 
          name="businessName" 
          value={newContact.businessName} 
          onChange={handleInputChange} 
          placeholder="Acme Corp" 
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="flex space-x-2">
          <Input 
            id="email" 
            name="email" 
            value={newContact.email} 
            onChange={handleInputChange} 
            placeholder="john@example.com" 
            type="email"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleAddContact}
            className="flex-shrink-0"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactInput;
