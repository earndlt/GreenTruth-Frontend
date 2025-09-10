
import { corporateWallets } from '@/data/corporateWallets';

export const fetchRevenueGenerationData = () => {
  // Simulate quarterly revenue data based on wallet holdings
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  
  // Sum total holdings from all wallets to use as base value
  const totalHoldings = corporateWallets.reduce((sum, wallet) => 
    sum + wallet.holdings.reduce((holdingSum, holding) => holdingSum + holding.amount, 0), 0);
  
  return quarters.map(quarter => {
    // Generate varied but deterministic data based on quarter
    const quarterNum = parseInt(quarter.charAt(1));
    const baseFactor = 1 + (quarterNum * 0.15); // Q1=1.15, Q2=1.30, etc.
    
    const baseRevenue = totalHoldings * 0.025 * baseFactor;
    const baseTransfers = totalHoldings * 0.008 * baseFactor;
    
    return {
      quarter,
      "Base Transactions": Math.round(baseRevenue),
      "Secondary Transfers": Math.round(baseTransfers),
    };
  });
};
