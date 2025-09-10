
// Get the standard unit of measure for a specific commodity
export const getCommodityUnit = (commodity: string): string => {
  switch (commodity.toLowerCase()) {
    case "methanol":
      return "kg";
    case "natural gas":
    case "lng":
    case "thermal credits":
    default:
      return "MMBtu";
  }
};

// Format price with appropriate unit of measure
export const formatPriceWithUnit = (price: string, commodity: string): string => {
  const unit = getCommodityUnit(commodity);
  return `$${price}/${unit}`;
};

// Convert quantity display based on commodity type
export const formatQuantityWithUnit = (quantity: number | string, commodity: string): string => {
  const unit = getCommodityUnit(commodity);
  const numQuantity = typeof quantity === 'string' ? parseInt(quantity) : quantity;
  return `${numQuantity.toLocaleString()} ${unit}`;
};
