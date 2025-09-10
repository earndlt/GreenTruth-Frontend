
import { format } from "date-fns";

/**
 * Formats a date range string from start and end dates
 * 
 * @param startDate The start date
 * @param endDate The end date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const startDateStr = format(startDate, "yyyy-MM-dd");
  const endDateStr = format(endDate, "yyyy-MM-dd");
  return `${startDateStr} to ${endDateStr}`;
};

/**
 * Generates an EAC ID
 * 
 * @param pipeline The pipeline type
 * @param contractId The cleaned contract ID (without K# prefix)
 * @param suffix Additional suffix to make the ID unique
 * @returns Generated EAC ID
 */
export const generateEacId = (
  pipeline: string, 
  contractId: string, 
  suffix: string | number
): string => {
  return `EAC-${pipeline}-${contractId}-${suffix}`;
};

/**
 * Creates a human-readable name for an emission point
 * 
 * @param point The emission point identifier
 * @returns Formatted emission point name
 */
export const formatEmissionPointName = (point: string): string => {
  return point.charAt(0).toUpperCase() + point.slice(1).replace('_', ' ');
};

/**
 * Creates a facility name based on the base name and point
 *
 * @param baseName The base facility name
 * @param pointName The emission point name
 * @returns Formatted facility name
 */
export const formatFacilityName = (
  baseName: string,
  pointName: string
): string => {
  return `${baseName} - ${pointName}`;
};
