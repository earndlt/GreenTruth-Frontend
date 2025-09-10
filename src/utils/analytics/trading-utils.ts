
export const fetchTradingActivityData = () => {
  // Simulate daily trading activity for the last 14 days
  const result = [];
  const now = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Generate consistent but varied data
    const seed = date.getDate() + date.getMonth();
    const baseActivity = 3000 + (seed * 20);
    const variance = Math.floor(Math.random() * 800) - 400;
    
    result.push({
      date: dayStr,
      activity: baseActivity + variance,
    });
  }
  
  return result;
};
