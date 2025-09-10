
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { VendorContact } from '../../types';
import { createVendorContactsFromFile, createExcelTemplate } from '../fileUtils';

export const useVendorContacts = () => {
  const [vendorContacts, setVendorContacts] = useState<VendorContact[]>([]);
  const { toast } = useToast();

  const addVendorContact = (contact: Omit<VendorContact, 'id'>) => {
    const newContact = {
      ...contact,
      id: uuidv4()
    };
    setVendorContacts([...vendorContacts, newContact]);
  };

  const removeVendorContact = (id: string) => {
    setVendorContacts(vendorContacts.filter(contact => contact.id !== id));
  };

  const handleExcelUpload = async (file: File) => {
    try {
      const updatedContacts = await createVendorContactsFromFile(file, vendorContacts);
      setVendorContacts(updatedContacts);
      
      toast({
        title: "File Uploaded",
        description: `Successfully imported ${updatedContacts.length - vendorContacts.length} contacts.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process the file.",
        variant: "destructive"
      });
    }
  };

  const downloadExcelTemplate = () => {
    const blob = createExcelTemplate();
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vendor_contacts_template.csv';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "Vendor contact template has been downloaded.",
    });
  };

  return {
    vendorContacts,
    addVendorContact,
    removeVendorContact,
    handleExcelUpload,
    downloadExcelTemplate
  };
};
