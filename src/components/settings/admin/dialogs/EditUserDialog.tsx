
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, UserRole } from '../types/userManagement';
import { Company } from '@/components/eac-registry/CompanySelector';
import { corporateWallets } from '@/data/corporateWallets';
import UserDialogFormFields from './UserDialogFormFields';
import AssignedEntitiesSelector from './AssignedEntitiesSelector';
import EditUserDialogActions from './EditUserDialogActions';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (user: User) => void;
  onResetPassword?: (user: User) => void;
}

const EditUserDialog = ({
  open,
  onOpenChange,
  user,
  onSave,
  onResetPassword,
}: EditUserDialogProps) => {
  const [name, setName] = React.useState(user?.name ?? '');
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [role, setRole] = React.useState<UserRole>(user?.role ?? 'user');
  const [assignedEntities, setAssignedEntities] = React.useState<string[]>(user?.assignedEntities ?? []);

  React.useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setRole(user?.role ?? 'user');
    setAssignedEntities(user?.assignedEntities ?? []);
  }, [user, open]);

  const companies: Company[] = corporateWallets.map(wallet => ({
    id: wallet.id,
    name: wallet.name,
    walletId: wallet.walletId,
  }));

  const handleEntityChange = (entityId: string) => {
    setAssignedEntities(current =>
      current.includes(entityId)
        ? current.filter(id => id !== entityId)
        : [...current, entityId]
    );
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;
    onSave({
      ...user,
      name,
      email,
      role,
      assignedEntities,
    });
    onOpenChange(false);
  };

  const handleResetPassword = () => {
    if (user && onResetPassword) {
      onResetPassword(user);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="mb-4">
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user's information, assigned entities, and permissions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[50vh] pr-4">
              <div className="space-y-4 pb-2">
                <UserDialogFormFields
                  name={name}
                  email={email}
                  role={role}
                  setName={setName}
                  setEmail={setEmail}
                  setRole={setRole}
                />
                <AssignedEntitiesSelector
                  companies={companies}
                  assignedEntities={assignedEntities}
                  handleEntityChange={handleEntityChange}
                />
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter className="flex-shrink-0 mt-4 pt-4 border-t">
            <EditUserDialogActions
              onCancel={() => onOpenChange(false)}
              onSave={handleSubmit}
              onResetPassword={handleResetPassword}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
