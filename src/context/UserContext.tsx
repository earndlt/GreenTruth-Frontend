
import React, { createContext, useContext, ReactNode } from 'react';
import { SubscriptionInfo } from '@/components/settings/billing/reports/types';
import { UserRole, UserSettings, AppUserInfo } from './user/userTypes';
import { useUserState } from './user/useUserState';
import { useUserPermissions } from './user/useUserPermissions';
import { canAccessEntity } from './user/userUtils';

export interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
  isManager: boolean;
  subscription?: SubscriptionInfo;
  setSubscription: (subscription: SubscriptionInfo) => void;
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  hasSodFeature: boolean;
  hasPermission: (permission: string) => boolean;
  assignedEntities: string[];
  canAccessEntity: (entityId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // All user-related state
  const {
    userRole,
    setUserRole,
    subscription,
    setSubscription,
    userSettings,
    updateUserSettings,
    currentUser,
  } = useUserState();

  // Permission helpers
  const {
    hasSodFeature,
    isAdmin,
    isManager,
    hasPermission,
  } = useUserPermissions(userRole, subscription);

  // Assigned entities for current user
  const assignedEntities = currentUser.assignedEntities;

  // Entity access logic moved to utility function
  const canAccessEntityFn = (entityId: string) =>
    canAccessEntity(entityId, isAdmin, assignedEntities);

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        isAdmin,
        isManager,
        subscription,
        setSubscription,
        userSettings,
        updateUserSettings,
        hasSodFeature,
        hasPermission,
        assignedEntities,
        canAccessEntity: canAccessEntityFn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Re-export types from the types file
export * from './user/userTypes';
