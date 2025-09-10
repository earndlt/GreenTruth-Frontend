
import { WalletEntity } from '@/types/wallet';
import { Flame, Building, Truck, Beaker, Snowflake, Leaf } from 'lucide-react';

type DisplayHolding = {
  name: string;
  amount: number;
  unit: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
};

export const calculateWalletTokens = (selectedWallet: WalletEntity) => {
  // Find the Natural Gas holding
  const naturalGasHolding = selectedWallet.holdings.find(item => item.name === "Natural Gas");
  
  // Calculate total Natural Gas tokens by summing all natural gas related values
  // This will include the base natural gas amount from the wallet
  const naturalGasBaseAmount = naturalGasHolding?.amount || 0;
  
  // Calculate derived natural gas values (processing and transportation) based on the base amount
  const naturalGasProcessing = Math.round(naturalGasBaseAmount * 0.7);
  const naturalGasTransportation = Math.round(naturalGasBaseAmount * 0.3);
  
  // Calculate the total Natural Gas MMBtu (sum of all natural gas types)
  const totalNaturalGasMMBtu = naturalGasBaseAmount + naturalGasProcessing + naturalGasTransportation;
  
  // Group holdings by unit for display
  const naturalGasItem = {
    name: "Natural Gas",
    amount: totalNaturalGasMMBtu,
    unit: "MMBtu",
    icon: selectedWallet.holdings[0]?.icon,
    color: selectedWallet.holdings[0]?.color,
    bgColor: selectedWallet.holdings[0]?.bgColor
  };
  
  // Filter out the Natural Gas entry and add our new consolidated entry
  const displayHoldings = [
    naturalGasItem,
    ...selectedWallet.holdings.filter(item => item.name !== "Natural Gas")
  ];
  
  // Calculate the total tokens correctly, including all component values
  // Add the natural gas components (processing, transportation) to the base amounts
  const totalTokens = selectedWallet.holdings.reduce((acc, item) => {
    // For Natural Gas, add the total calculated amount (includes processing and transportation)
    if (item.name === "Natural Gas") {
      return acc + totalNaturalGasMMBtu;
    }
    // For all other tokens, just add their amounts directly
    return acc + item.amount;
  }, 0);
  
  // Calculate total for MMBtu items (for progress bar calculations)
  const totalMMBtuTokens = displayHoldings
    .filter(item => item.unit === "MMBtu")
    .reduce((acc, item) => acc + item.amount, 0);
    
  return {
    displayHoldings,
    totalTokens,
    totalMMBtuTokens,
    totalNaturalGasMMBtu
  };
};
