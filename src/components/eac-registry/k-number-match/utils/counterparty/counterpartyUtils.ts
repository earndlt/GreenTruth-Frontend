
import { Counterparty } from "../../types";

// Get pipeline counterparty information automatically
export const getPipelineCounterparty = (pipeline: "REX" | "Ruby"): Counterparty => {
  if (pipeline === "REX") {
    return {
      name: "ROCKIES EXPRESS PIPELINE LLC",
      contactName: "REX Operations",
      email: "operations@rexpipeline.com",
      phone: "555-123-4567",
      isApproved: true
    };
  } else {
    return {
      name: "RUBY PIPELINE LLC",
      contactName: "Ruby Operations",
      email: "operations@rubypipeline.com",
      phone: "555-789-0123",
      isApproved: true
    };
  }
};

// Format counterparty information from user input
export const formatCounterparty = (counterpartyInfo: any): Counterparty => {
  return {
    name: counterpartyInfo.counterpartyName || "Unknown",
    contactName: counterpartyInfo.contactName || undefined,
    email: counterpartyInfo.email || undefined,
    phone: counterpartyInfo.phone || undefined,
    isApproved: counterpartyInfo.isApproved || false
  };
};
