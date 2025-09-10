
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RoleSelector from '../RoleSelector';
import { UserRole } from '../types/userManagement';

interface UserDialogFormFieldsProps {
  name: string;
  email: string;
  role: UserRole;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: UserRole) => void;
}

const UserDialogFormFields: React.FC<UserDialogFormFieldsProps> = ({
  name,
  email,
  role,
  setName,
  setEmail,
  setRole,
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="name">Full Name</Label>
      <Input 
        id="name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
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
        required 
      />
    </div>
    <RoleSelector
      selectedRole={role}
      onRoleChange={(selectedRole) => setRole(selectedRole as UserRole)}
    />
  </div>
);

export default UserDialogFormFields;
