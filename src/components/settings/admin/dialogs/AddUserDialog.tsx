import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/context/UserContext';
import RoleSelector from '../RoleSelector';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Company } from '@/components/eac-registry/CompanySelector';
import { corporateWallets } from '@/data/corporateWallets';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (name: string, email: string, role: UserRole, assignedEntities: string[]) => void;
}

const AddUserDialog = ({ open, onOpenChange, onAddUser }: AddUserDialogProps) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('member');
  const [selectedEntities, setSelectedEntities] = React.useState<string[]>([]);

  const companies: Company[] = corporateWallets.map(wallet => ({
    id: wallet.id,
    name: wallet.name,
    walletId: wallet.walletId,
  }));

  const handleEntityChange = (entityId: string) => {
    setSelectedEntities(current =>
      current.includes(entityId)
        ? current.filter(id => id !== entityId)
        : [...current, entityId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(name, email, role as UserRole, selectedEntities);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('member');
    setSelectedEntities([]);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Add a new user to your organization. They will receive an email invitation.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] mt-4 overflow-y-auto pr-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="John Doe" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="john@example.com" 
                  required 
                />
              </div>
              
              <RoleSelector 
                selectedRole={role}
                onRoleChange={(selectedRole) => setRole(selectedRole as UserRole)}
              />

              <div className="space-y-2 mt-2">
                <Label>Assign to Corporate Entities</Label>
                <div className="flex flex-col gap-2 max-h-[180px] overflow-auto">
                  {companies.map(entity => (
                    <label key={entity.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedEntities.includes(entity.id)}
                        onChange={() => handleEntityChange(entity.id)}
                        className="rounded border-input"
                      />
                      <span>{entity.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Invite User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
