
import React from 'react';
import { useRfpForm } from '../context/RfpFormContext';
import ContactInput from './contacts/ContactInput';
import ContactsTable from './contacts/ContactsTable';
import TemplateActions from './contacts/TemplateActions';

const VendorContactsForm: React.FC = () => {
  const { 
    vendorContacts, 
    addVendorContact, 
    removeVendorContact,
    handleExcelUpload,
    downloadExcelTemplate
  } = useRfpForm();

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Vendor Contacts</h4>
        <TemplateActions
          downloadTemplate={downloadExcelTemplate}
          handleFileUpload={handleExcelUpload}
        />
      </div>
      
      <ContactInput addVendorContact={addVendorContact} />
      
      <ContactsTable 
        contacts={vendorContacts} 
        removeContact={removeVendorContact} 
      />
    </div>
  );
};

export default VendorContactsForm;
