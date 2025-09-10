
import React from 'react';
import { User, Plan } from '../types/userManagement';
import AddUserDialog from '../dialogs/AddUserDialog';
import DeleteUserDialog from '../dialogs/DeleteUserDialog';
import EditUserDialog from '../dialogs/EditUserDialog';
import UpgradePlanDialog from '../dialogs/UpgradePlanDialog';
import { NextPlanInfo } from '../types/userManagement';

interface UserDialogsManagerProps {
  addUserDialogOpen: boolean;
  setAddUserDialogOpen: (open: boolean) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  upgradePlanDialogOpen: boolean;
  setUpgradePlanDialogOpen: (open: boolean) => void;
  userToEdit: User | null;
  setUserToEdit: (user: User | null) => void;
  userToDelete: User | null;
  setUserToDelete: (user: User | null) => void;
  currentPlan: Plan;
  users: User[];
  onAddUser: (name: string, email: string, role: 'admin' | 'user', assignedEntities: string[]) => void;
  onSaveUser: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDeleteUserConfirm: () => void;
  onCancelDeleteUser: () => void;
  onUpgrade: () => void;
  nextPlan: NextPlanInfo;
}

const UserDialogsManager: React.FC<UserDialogsManagerProps> = ({
  addUserDialogOpen,
  setAddUserDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  upgradePlanDialogOpen,
  setUpgradePlanDialogOpen,
  userToEdit,
  setUserToEdit,
  userToDelete,
  setUserToDelete,
  currentPlan,
  users,
  onAddUser,
  onSaveUser,
  onResetPassword,
  onDeleteUserConfirm,
  onCancelDeleteUser,
  onUpgrade,
  nextPlan,
}) => (
  <>
    <AddUserDialog
      open={addUserDialogOpen}
      onOpenChange={setAddUserDialogOpen}
      onAddUser={onAddUser}
    />
    <EditUserDialog
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      user={userToEdit}
      onSave={onSaveUser}
      onResetPassword={onResetPassword}
    />
    <DeleteUserDialog
      open={deleteDialogOpen}
      onOpenChange={setDeleteDialogOpen}
      user={userToDelete}
      onConfirm={onDeleteUserConfirm}
      onCancel={onCancelDeleteUser}
    />
    <UpgradePlanDialog
      open={upgradePlanDialogOpen}
      onOpenChange={setUpgradePlanDialogOpen}
      currentPlan={currentPlan.name}
      onUpgrade={onUpgrade}
      onCancel={() => setUpgradePlanDialogOpen(false)}
      nextPlan={nextPlan}
    />
  </>
);

export default UserDialogsManager;
