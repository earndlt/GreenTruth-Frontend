import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { User, Plan } from "./types/userManagement";
import SeatsUsageInfo from "./SeatsUsageInfo";
import UsersTable from "./UsersTable";
import AddUserDialog from "./dialogs/AddUserDialog";
import DeleteUserDialog from "./dialogs/DeleteUserDialog";
import EditUserDialog from "./dialogs/EditUserDialog";
import UpgradePlanDialog from "./dialogs/UpgradePlanDialog";
import { getNextPlan } from "./utils/planUtils";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/context/UserContext";
import UserManagementHeader from "./UserManagement/UserManagementHeader";
import TwoFactorToggle from "./UserManagement/TwoFactorToggle";
import UserDialogsManager from "./UserManagement/UserDialogsManager";

const UserManagement = () => {
  const { toast } = useToast();
  const { userSettings, updateUserSettings } = useUser();

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      assignedEntities: ["acme-corp", "acme-usa"],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      status: "active",
      assignedEntities: ["acme-corp"],
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "user",
      status: "invited",
      assignedEntities: [],
    },
  ]);

  const [plan, setPlan] = useState<Plan>({
    name: "pro",
    seatLimit: 5,
    usedSeats: 3,
  });

  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [upgradePlanDialogOpen, setUpgradePlanDialogOpen] = useState(false);

  const [require2FAForAll, setRequire2FAForAll] = useState(
    userSettings.require2FA
  );

  useEffect(() => {
    setRequire2FAForAll(userSettings.require2FA);
  }, [userSettings.require2FA]);

  const handleAddUser = (
    name: string,
    email: string,
    role: "admin" | "user",
    assignedEntities: string[]
  ) => {
    if (users.length >= plan.seatLimit) {
      setUpgradePlanDialogOpen(true);
      return;
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      role,
      assignedEntities,
      status: "invited",
    };

    setUsers([...users, newUser]);
    toast({
      title: "User invited",
      description: `An invitation has been sent to ${email}.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((user) => user.id === userId);
    if (userToDelete) {
      setUserToDelete(userToDelete);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      toast({
        title: "User removed",
        description: `${userToDelete.name} has been removed from your organization.`,
      });
      setUserToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleUpgradePlan = () => {
    const nextPlan = getNextPlan(plan.name);
    setPlan({
      name: nextPlan.name,
      seatLimit: typeof nextPlan.seats === "number" ? nextPlan.seats : 15,
      usedSeats: users.length,
    });

    setUpgradePlanDialogOpen(false);
    toast({
      title: "Plan upgraded",
      description: `Your plan has been upgraded to ${nextPlan.name}.`,
    });
  };

  const handleRequire2FAToggle = (checked: boolean) => {
    console.log("Admin toggle 2FA requirement:", checked);

    setRequire2FAForAll(checked);
    updateUserSettings({ require2FA: checked });

    toast({
      title: checked ? "2FA required for all users" : "2FA requirement removed",
      description: checked
        ? "All users will now be required to enable two-factor authentication"
        : "Users can now choose whether to enable two-factor authentication",
    });
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setEditDialogOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    toast({
      title: "User updated",
      description: `${updatedUser.name}'s details have been updated.`,
    });
    setUserToEdit(null);
    setEditDialogOpen(false);
  };

  const handleResetPassword = (user: User) => {
    toast({
      title: "Reset password",
      description: `A password reset link has been sent to ${user.email}.`,
    });
  };

  return (
    <Card className="mb-6" id="user-management">
      <UserManagementHeader onAddUser={() => setAddUserDialogOpen(true)} />

      <CardContent>
        <TwoFactorToggle
          checked={require2FAForAll}
          onToggle={handleRequire2FAToggle}
        />

        <SeatsUsageInfo
          usedSeats={users.length}
          seatLimit={plan.seatLimit}
          onUpgradeClick={() => setUpgradePlanDialogOpen(true)}
        />
        <UsersTable
          users={users}
          onDeleteUser={handleDeleteUser}
          onEditUser={handleEditUser}
        />

        <UserDialogsManager
          addUserDialogOpen={addUserDialogOpen}
          setAddUserDialogOpen={setAddUserDialogOpen}
          editDialogOpen={editDialogOpen}
          setEditDialogOpen={setEditDialogOpen}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          upgradePlanDialogOpen={upgradePlanDialogOpen}
          setUpgradePlanDialogOpen={setUpgradePlanDialogOpen}
          userToEdit={userToEdit}
          setUserToEdit={setUserToEdit}
          userToDelete={userToDelete}
          setUserToDelete={setUserToDelete}
          currentPlan={plan}
          users={users}
          onAddUser={handleAddUser}
          onSaveUser={handleSaveUser}
          onResetPassword={handleResetPassword}
          onDeleteUserConfirm={confirmDeleteUser}
          onCancelDeleteUser={() => setDeleteDialogOpen(false)}
          onUpgrade={handleUpgradePlan}
          nextPlan={getNextPlan(plan.name)}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
