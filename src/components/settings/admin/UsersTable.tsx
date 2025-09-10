
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, Mail, Trash2, Shield, User as UserIcon, FileText, Users } from 'lucide-react';
import { User } from './types/userManagement';
import { useUser } from '@/context/UserContext';
import { corporateWallets } from '@/data/corporateWallets';

interface UsersTableProps {
  users: User[];
  onDeleteUser: (userId: string) => void;
  onEditUser: (user: User) => void;
}

const UsersTable = ({
  users,
  onDeleteUser,
  onEditUser,
}: UsersTableProps) => {
  const { hasSodFeature } = useUser();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'administrator':
        return <Shield className="h-4 w-4 text-primary mr-1.5" />;
      case 'manager':
        return <Shield className="h-4 w-4 text-blue-700 mr-1.5" />;
      case 'treasury':
      case 'analyst':
        return <FileText className="h-4 w-4 text-muted-foreground mr-1.5" />;
      case 'trader':
        return <Users className="h-4 w-4 text-purple-600 mr-1.5" />;
      case 'risk':
        return <Shield className="h-4 w-4 text-orange-600 mr-1.5" />;
      default:
        return <UserIcon className="h-4 w-4 text-muted-foreground mr-1.5" />;
    }
  };

  const formatRoleName = (role: string): string => {
    if (role === 'admin') return 'Administrator';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Map for ID to entity name
  const entityIdToName: Record<string, string> = {};
  corporateWallets.forEach((entity) => {
    entityIdToName[entity.id] = entity.name;
  });

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Assigned Entities</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={(evt) => {
                // Don't open on delete button click!
                if ((evt.target as HTMLElement).closest('button')) return;
                onEditUser(user);
              }}
            >
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex items-center capitalize">
                  {getRoleIcon(user.role)}
                  {formatRoleName(user.role)}
                  {hasSodFeature && !['admin', 'user', 'guest', 'member'].includes(user.role) && (
                    <span className="ml-1.5 text-xs bg-blue-100 text-blue-800 px-1 rounded">SoD</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {user.assignedEntities && user.assignedEntities.length > 0
                  ? user.assignedEntities.map((id) => entityIdToName[id] || id).join(', ')
                  : <span className="text-xs text-muted-foreground italic">None assigned</span>
                }
              </TableCell>
              <TableCell>
                {user.status === 'active' ? (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                    <Check className="mr-1 h-3 w-3" /> Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                    <Mail className="mr-1 h-3 w-3" /> Invited
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteUser(user.id)}
                  className="text-destructive hover:text-destructive/90"
                  tabIndex={0}
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
