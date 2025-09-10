
/**
 * Format a number with commas for thousands
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format a percentage value with one decimal place
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
