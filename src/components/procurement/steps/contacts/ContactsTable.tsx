
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { VendorContact } from '../../types';

interface ContactsTableProps {
  contacts: VendorContact[];
  removeContact: (id: string) => void;
  readOnly?: boolean;
}

const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, removeContact, readOnly = false }) => {
  if (contacts.length === 0) {
    return null;
  }

  return (
    <>
      <Separator className="my-4" />
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Added Contacts</h4>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-2 text-left">Contact Name</th>
                <th className="p-2 text-left">Business</th>
                <th className="p-2 text-left">Email</th>
                {!readOnly && <th className="p-2 text-center w-12">Action</th>}
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-t">
                  <td className="p-2">{contact.name}</td>
                  <td className="p-2">{contact.businessName}</td>
                  <td className="p-2">{contact.email}</td>
                  {!readOnly && (
                    <td className="p-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => removeContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ContactsTable;
