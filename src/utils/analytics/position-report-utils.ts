
import { corporateWallets } from '@/data/corporateWallets';
import { getCommodityUnit } from './commodity-utils';

// Position Report Data interface
export interface PositionData {
  commodity: string;
  month: string;
  holdings: number;
  buyCommitments: number;
  sellCommitments: number;
  netPosition: number;
  riskStatus: 'High Risk' | 'Medium Risk' | 'Low Risk';
  unit: string;
  // Transaction details for buy and sell commitments
  buyTransactions: TransactionDetail[];
  sellTransactions: TransactionDetail[];
}

// Interface for transaction details
export interface TransactionDetail {
  id: string;
  date: string;
  counterparty: string;
  amount: number;
  price: number;
  totalValue: number;
}

export const fetchPositionReportData = (
  walletIds: string[] = [], 
  startDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 1)),
  endDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 2))
): PositionData[] => {
  // If no wallets selected, use all wallets
  const selectedWallets = walletIds.length > 0 
    ? corporateWallets.filter(wallet => walletIds.includes(wallet.id))
    : corporateWallets;
    
  // Generate simulated position data from EarnDLT for the selected wallets
  const commodityTypes = ["Natural Gas", "LNG", "Methanol", "Thermal Credits"];
  const positionData: PositionData[] = [];
  
  // Create months array based on date range
  const months = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // Generate position data for each commodity type and month
  commodityTypes.forEach(commodity => {
    // Get the standard unit for this commodity
    const unit = getCommodityUnit(commodity);
    
    const holdingBase = selectedWallets.reduce((sum, wallet) => {
      const holding = wallet.holdings.find(h => h.name === commodity);
      return sum + (holding ? holding.amount : 0);
    }, 0);
    
    months.forEach(month => {
      // Generate buy commitments (increase over time)
      const monthIndex = month.getMonth() + month.getFullYear() * 12;
      const seed = commodity.length + monthIndex;
      const buyCommitment = Math.round(holdingBase * (0.2 + (monthIndex * 0.05)) + (seed * 10));
      
      // Generate sell commitments (decrease over time but not below 0)
      const sellCommitment = Math.round(Math.max(0, holdingBase * (0.15 + (monthIndex * 0.03)) + (seed * 8)));
      
      // Calculate net position
      const netPosition = holdingBase + buyCommitment - sellCommitment;
      
      // Calculate risk status based on net position
      let riskStatus: 'High Risk' | 'Medium Risk' | 'Low Risk';
      if (netPosition <= 0) {
        riskStatus = "High Risk";
      } else if (netPosition < holdingBase * 0.2) {
        riskStatus = "Medium Risk";
      } else {
        riskStatus = "Low Risk";
      }
      
      // Generate mock transaction details for buy commitments
      const buyTransactions = generateMockTransactions(
        buyCommitment, 
        month, 
        commodity, 
        'buy', 
        unit
      );
      
      // Generate mock transaction details for sell commitments
      const sellTransactions = generateMockTransactions(
        sellCommitment, 
        month, 
        commodity, 
        'sell', 
        unit
      );
      
      positionData.push({
        commodity,
        month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        holdings: holdingBase,
        buyCommitments: buyCommitment,
        sellCommitments: sellCommitment,
        netPosition,
        riskStatus,
        unit,
        buyTransactions,
        sellTransactions
      });
    });
  });
  
  return positionData;
};

// Generate mock transaction details
const generateMockTransactions = (
  totalAmount: number, 
  month: Date, 
  commodity: string,
  type: 'buy' | 'sell',
  unit: string
): TransactionDetail[] => {
  const transactions: TransactionDetail[] = [];
  
  // Skip if amount is 0
  if (totalAmount === 0) return transactions;
  
  // Create between 1-5 transactions that sum up to the total amount
  const numTransactions = Math.max(1, Math.floor(Math.random() * 5) + 1);
  let remainingAmount = totalAmount;
  
  const counterparties = [
    'Acme Energy', 'Global Gas Corp', 'Texas Methanol', 
    'Pacific Resources', 'Mountain Fuels', 'Atlantic Energy Partners'
  ];
  
  // Base price per unit based on commodity
  const basePricePerUnit = {
    'Natural Gas': 3.5, // $ per MMBtu
    'LNG': 7.2,         // $ per MMBtu
    'Methanol': 1.2,    // $ per kg
    'Thermal Credits': 15.0, // $ per MMBtu
  }[commodity] || 5.0;
  
  for (let i = 0; i < numTransactions; i++) {
    const isLast = i === numTransactions - 1;
    
    // For the last transaction, use the remaining amount, otherwise generate a portion
    const amount = isLast 
      ? remainingAmount 
      : Math.floor(remainingAmount * (0.1 + Math.random() * 0.5));
    
    remainingAmount -= amount;
    
    // Generate transaction date within the month
    const transactionDate = new Date(month);
    transactionDate.setDate(1 + Math.floor(Math.random() * 28)); // Random day in month
    
    // Adjust price based on transaction type (buy vs sell)
    const priceMultiplier = type === 'buy' ? 1.0 : 1.05; // Sell at slight premium
    const price = basePricePerUnit * priceMultiplier * (0.9 + Math.random() * 0.2); // Add some variance
    
    transactions.push({
      id: `${type.charAt(0)}-${commodity.substring(0, 3)}-${Date.now()}-${i}`,
      date: transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      counterparty: counterparties[Math.floor(Math.random() * counterparties.length)],
      amount,
      price: parseFloat(price.toFixed(2)),
      totalValue: parseFloat((amount * price).toFixed(2))
    });
    
    // Break if we've used all the amount
    if (remainingAmount <= 0) break;
  }
  
  return transactions;
};

// Function to convert position data to Excel-compatible format
export const preparePositionReportForExport = (positionData: PositionData[]) => {
  return positionData.map(item => ({
    Commodity: item.commodity,
    Month: item.month,
    [`Current Holdings (${item.unit})`]: item.holdings,
    [`Buy Commitments (${item.unit})`]: item.buyCommitments,
    [`Sell Commitments (${item.unit})`]: item.sellCommitments,
    [`Net Position (${item.unit})`]: item.netPosition,
    'Risk Status': item.riskStatus
  }));
};

// Export transaction details for a specific commitment
export const prepareTransactionDetailsForExport = (transactions: TransactionDetail[], commodity: string, month: string, type: 'Buy' | 'Sell', unit: string) => {
  return transactions.map(tx => ({
    Date: tx.date,
    Counterparty: tx.counterparty,
    [`Amount (${unit})`]: tx.amount,
    [`Price ($ per ${unit})`]: tx.price,
    [`Total Value ($)`]: tx.totalValue
  }));
};
