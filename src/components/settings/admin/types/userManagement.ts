
// Add assignedEntities field to User interface for per-entity assignment
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited';
  assignedEntities: string[]; // Array of company/entity IDs this user has access to
}

export interface Plan {
  name: string;
  seatLimit: number;
  usedSeats: number;
}

export interface NextPlanInfo {
  name: string;
  price: string;
  seats: number | string;
}
