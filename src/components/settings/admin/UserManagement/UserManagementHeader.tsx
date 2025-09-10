
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users } from 'lucide-react';

interface UserManagementHeaderProps {
  onAddUser: () => void;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ onAddUser }) => (
  <CardHeader className="flex flex-row items-center justify-between">
    <div className="flex items-center gap-2">
      <Users className="h-5 w-5 text-muted-foreground" />
      <CardTitle>User Management</CardTitle>
    </div>
    <Button size="sm" onClick={onAddUser}>
      <Plus className="mr-2 h-4 w-4" />
      Add User
    </Button>
  </CardHeader>
);

export default UserManagementHeader;
