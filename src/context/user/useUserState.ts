import { useState } from "react";
import { SubscriptionInfo } from "@/components/settings/billing/reports/types";
import { AppUserInfo, UserRole, UserSettings } from "../user/userTypes";

export function useUserState() {
  // Default to admin for backward compatibility
  const [userRole, setUserRole] = useState<UserRole>("admin");

  // For demo: business plan with SoD enabled, add-ons can be adjusted as needed
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    plan: "business",
    addons: ["procurement", "integration-hub", "sod"],
  });

  // User settings including 2FA requirements
  const [userSettings, setUserSettings] = useState<UserSettings>({
    require2FA: false,
    twoFactorEnabled: false,
  });

  // Current user: demo info, typically would come from auth/user API
  const [currentUser, setCurrentUser] = useState<AppUserInfo>({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    assignedEntities: ["acme-corp", "acme-usa"],
  });

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings((prev) => ({
      ...prev,
      ...settings,
    }));
  };

  return {
    userRole,
    setUserRole,
    subscription,
    setSubscription,
    userSettings,
    updateUserSettings,
    currentUser,
    setCurrentUser,
  };
}
