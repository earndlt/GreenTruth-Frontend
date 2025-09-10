
import { corporateWallets } from '@/data/corporateWallets';

export const getWalletTotalsData = () => {
  // Calculate total holdings by type across all wallets
  const totals = {
    totalEacs: 0,
    naturalGas: 0,
    lng: 0,
    methanol: 0,
    thermalCredits: 0,
  };
  
  corporateWallets.forEach(wallet => {
    wallet.holdings.forEach(holding => {
      if (holding.name === "Natural Gas") {
        totals.naturalGas += holding.amount;
      } else if (holding.name === "LNG") {
        totals.lng += holding.amount;
      } else if (holding.name === "Methanol") {
        totals.methanol += holding.amount;
      } else if (holding.name === "Thermal Credits") {
        totals.thermalCredits += holding.amount;
      }
      
      if (holding.unit === "MMBtu") {
        totals.totalEacs += holding.amount;
      }
    });
  });
  
  return totals;
};

export const getAvailableWallets = () => {
  return corporateWallets.map(wallet => ({
    id: wallet.id,
    name: wallet.name
  }));
};
