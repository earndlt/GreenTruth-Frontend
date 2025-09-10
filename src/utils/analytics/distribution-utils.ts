
import { corporateWallets } from '@/data/corporateWallets';

export const fetchEacDistributionData = () => {
  // Aggregate EAC types across all corporate wallets
  const eacTypes = new Map<string, number>();
  
  corporateWallets.forEach(wallet => {
    wallet.holdings.forEach(holding => {
      const currentTotal = eacTypes.get(holding.name) || 0;
      eacTypes.set(holding.name, currentTotal + holding.amount);
    });
  });
  
  // Convert to array format for pie chart
  return Array.from(eacTypes.entries()).map(([name, value]) => ({
    name,
    value,
  }));
};
