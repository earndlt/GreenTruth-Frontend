
import React from 'react';
import { VendorContact, VendorDistributionOption } from '../../types';

interface VendorSectionProps {
  vendorOptions: VendorDistributionOption[];
  vendorContacts: VendorContact[];
}

const VendorSection = ({ vendorOptions, vendorContacts }: VendorSectionProps) => {
  return (
    <>
      <div>
        <h4 className="text-sm font-medium">Vendor Distribution Options</h4>
        <p className="text-sm text-muted-foreground">
          {vendorOptions.filter(opt => opt.selected).map(opt => opt.name).join(', ') || 'No options selected'}
        </p>
      </div>

      {vendorContacts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium">Vendor Contacts</h4>
          <ul className="list-disc pl-5">
            {vendorContacts.map(contact => (
              <li key={contact.id} className="text-sm text-muted-foreground">
                {contact.name} ({contact.email})
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default VendorSection;
