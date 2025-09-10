import { useState } from "react";
import { Vendor } from "../types/vendorTypes";
import { generateVendorId } from "../utils/vendorIdGenerator";
import { corporateWallets } from "@/data/corporateWallets";

/**
 * Get vendor data with proper entity-specific vendor IDs
 * @param companyId - The ID of the company/entity to filter vendors for
 */
export const getVendorDataForCompany = (companyId: string): Vendor[] => {
  // Find the entity name from corporateWallets based on company ID
  const entity = corporateWallets.find((wallet) => wallet.id === companyId);
  const entityName = entity?.name || "Unknown Entity";

  return [
    {
      id: generateVendorId("EcoGas Solutions", entityName),
      name: "EcoGas Solutions",
      category: "Natural Gas",
      location: "Texas, USA",
      complianceScore: 95,
      status: "active",
      lastTransaction: "2023-11-15",
      companyId: companyId,
    },
    {
      id: generateVendorId("Green Methanol Inc.", entityName),
      name: "Green Methanol Inc.",
      category: "Methanol",
      location: "Louisiana, USA",
      complianceScore: 88,
      status: "active",
      lastTransaction: "2023-10-30",
      companyId: companyId,
    },
    {
      id: generateVendorId("CleanFuel Partners", entityName),
      name: "CleanFuel Partners",
      category: "Natural Gas",
      location: "Oklahoma, USA",
      complianceScore: 81,
      status: "inactive",
      lastTransaction: "2023-09-22",
      companyId: companyId,
    },
    {
      id: generateVendorId("SynthChem Solutions", entityName),
      name: "SynthChem Solutions",
      category: "Methanol",
      location: "California, USA",
      complianceScore: 75,
      status: "active",
      lastTransaction: "2023-12-01",
      companyId: companyId,
    },
    {
      id: generateVendorId("EcoMethane Solutions", entityName),
      name: "EcoMethane Solutions",
      category: "Methane Capture",
      location: "Denver, Colorado",
      complianceScore: 92,
      status: "active",
      lastTransaction: "2023-12-10",
      companyId: companyId,
    },
  ];
};

// Global vendor data storage - populated by initial requests
const vendorDataCache = new Map<string, Vendor[]>();

export const useVendorDirectory = (companyId: string = "acme-corp") => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  // Get or generate vendor data for this company
  if (!vendorDataCache.has(companyId)) {
    vendorDataCache.set(companyId, getVendorDataForCompany(companyId));
  }

  // Use the cached vendor data for this company
  const vendorData = vendorDataCache.get(companyId) || [];

  // Filter vendors by search term
  const filteredVendors = vendorData.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    selectedVendor,
    setSelectedVendor,
    filteredVendors,
  };
};

// Export a method to get all vendor data (used by components that need all vendors)
export const getAllVendorData = (): Vendor[] => {
  return Array.from(vendorDataCache.values()).flat();
};

// Export the vendor data for direct access in components that need the raw data
export { vendorDataCache as vendorData };
