
// All user type definitions in one central place

// User roles for basic RBAC (default system)
export type BasicUserRole = 'admin' | 'member' | 'guest';

// User roles for SoD (Segregation of Duties) system
export type SodUserRole = 'administrator' | 'treasury' | 'risk' | 'trader' | 'professional' | 'manager' | 'analyst';

// Legacy roles for backward compatibility
export type LegacyUserRole = 'user';

// Union type of all possible roles
export type UserRole = BasicUserRole | SodUserRole | LegacyUserRole;

// User settings interface
export interface UserSettings {
  require2FA: boolean;
  twoFactorEnabled: boolean;
}

// User info interface
export interface AppUserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedEntities: string[];
}
