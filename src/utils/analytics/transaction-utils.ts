
// Simulating API data connection with EarnDLT by processing our corporate wallet data
export const fetchTransactionVolumeData = () => {
  // Simulate monthly transaction volume data using the corporate wallet holdings
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map(month => {
    // Generate consistent but varied data based on the month string
    const seed = month.charCodeAt(0) + month.charCodeAt(1);
    const baseVolume = 7500 + (seed * 12);
    
    return {
      month,
      volume: baseVolume + Math.floor(Math.random() * 2000),
      transactions: Math.floor(baseVolume / 500) + Math.floor(Math.random() * 5),
    };
  });
};
