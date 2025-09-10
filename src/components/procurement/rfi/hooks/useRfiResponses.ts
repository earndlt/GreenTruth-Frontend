import { useState } from "react";
import { RfiResponse } from "../types/RfiTypes";

// Sample RFI response data
let sampleResponses: RfiResponse[] = [
  {
    id: "1",
    vendorName: "EcoGas Solutions",
    email: "rfi-abc123@rfi.greentruth.com",
    contactEmail: "contact@ecogassolutions.com",
    subject: "RFI: Information request for Natural Gas",
    receivedDate: "2023-12-05",
    status: "graded",
    llmScore: {
      overall: 87,
      procurement: 85,
      environmental: 92,
      esg: 84,
    },
    userScore: {
      procurement: 80,
      environmental: 85,
      esg: 82,
    },
    category: "Natural Gas",
    companyId: "acme-corp",
  },
  {
    id: "2",
    vendorName: "Green Methanol Inc.",
    email: "rfi-def456@rfi.greentruth.com",
    contactEmail: "info@greenmethanol.com",
    subject: "RFI: Information request for Methanol",
    receivedDate: "2023-12-04",
    status: "new",
    category: "Methanol",
    companyId: "acme-corp",
  },
  {
    id: "3",
    vendorName: "EcoMethane Solutions",
    email: "rfi-ghi789@rfi.greentruth.com",
    contactEmail: "support@ecomethane.org",
    subject: "RFI: Information request for Methane Capture",
    receivedDate: "2023-12-03",
    status: "reviewed",
    llmScore: {
      overall: 92,
      procurement: 90,
      environmental: 95,
      esg: 91,
    },
    category: "Methane Capture",
    companyId: "acme-usa",
  },
];

export const useRfiResponses = (companyId?: string) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const approveResponse = (responseId: string) => {
    sampleResponses = sampleResponses.map((response) =>
      response.id === responseId
        ? { ...response, status: "approved" as const }
        : response
    );
  };

  const filteredResponses = sampleResponses
    .filter((response) => !companyId || response.companyId === companyId)
    .filter((response) => {
      const matchesSearch =
        response.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.category.toLowerCase().includes(searchTerm.toLowerCase());

      if (selectedTab === "all") return matchesSearch;
      if (selectedTab === "new")
        return matchesSearch && response.status === "new";
      if (selectedTab === "reviewed")
        return (
          matchesSearch &&
          (response.status === "reviewed" || response.status === "graded")
        );
      if (selectedTab === "approved")
        return matchesSearch && response.status === "approved";
      return matchesSearch;
    });

  return {
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    filteredResponses,
    approveResponse,
  };
};
