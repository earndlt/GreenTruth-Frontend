
export const shouldSync = (lastSync: string | null, frequency: 'daily' | 'weekly' | 'monthly'): boolean => {
  if (!lastSync) return true;
  
  const lastSyncDate = new Date(lastSync);
  const now = new Date();
  
  switch (frequency) {
    case 'daily':
      return now.getDate() !== lastSyncDate.getDate() || 
             now.getMonth() !== lastSyncDate.getMonth() || 
             now.getFullYear() !== lastSyncDate.getFullYear();
    case 'weekly':
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return lastSyncDate < oneWeekAgo;
    case 'monthly':
      return now.getMonth() !== lastSyncDate.getMonth() || 
             now.getFullYear() !== lastSyncDate.getFullYear();
    default:
      return true;
  }
};
