
import { UserRole } from '../UserContext';

// Utilities related to assigned entities and access
export const canAccessEntity = (
  entityId: string,
  isAdmin: boolean,
  assignedEntities: string[]
) => {
  return isAdmin || assignedEntities.includes(entityId);
};
