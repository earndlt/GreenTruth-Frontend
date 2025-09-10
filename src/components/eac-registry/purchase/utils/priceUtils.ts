/**
 * Utility functions for price calculations
 */

import { getCommodityUnit } from "@/utils/analytics";

/**
 * Calculate the total price based on quantity and price per unit
 */
export const calculateTotalPrice = (
  quantity: string,
  pricePerUnit: string
): number => {
  return (
    parseInt(quantity) *
    parseFloat(
      pricePerUnit ? (pricePerUnit === "0.00" ? "1" : pricePerUnit) : "0"
    )
  );
};

/**
 * Calculate the price per delivery for forward transactions
 */
export const calculatePricePerDelivery = (
  totalPrice: number,
  deliveryDates: string[],
  transactionType: string
): string => {
  if (transactionType === "forward" && deliveryDates.length > 0) {
    return (totalPrice / deliveryDates.length).toFixed(2);
  }
  return totalPrice.toLocaleString();
};

/**
 * Format price display with proper unit for a specific commodity
 */
export const formatPriceDisplay = (
  price: string,
  commodity: string
): string => {
  const unit = getCommodityUnit(commodity);
  return `$${price} per ${unit}`;
};
