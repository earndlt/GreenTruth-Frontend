import { ComplianceReport } from "../types/reportTypes";
import { generateVendorId } from "../utils/vendorIdGenerator";

// Generate demo compliance reports for each vendor
export const generateComplianceReports = (
  vendorId: string
): ComplianceReport[] => {
  // Generate between 1 and 4 reports
  const reportCount = Math.floor(Math.random() * 4) + 1;
  const reports: ComplianceReport[] = [];

  const reportTypes = [
    "Quarterly Compliance Assessment",
    "EAC Delivery Compliance Report",
    "Sustainability Compliance Review",
    "ESG Criteria Evaluation",
  ];

  const eacTypes = [
    "Natural Gas",
    "Methanol",
    "Renewable Natural Gas",
    "Biogas",
  ];

  // Current date for reference
  const now = new Date();

  for (let i = 0; i < reportCount; i++) {
    // Generate a date within the last 6 months
    const reportDate = new Date(now);
    reportDate.setMonth(now.getMonth() - Math.floor(Math.random() * 6));

    // Generate a random overall score between 65 and 98
    const overallScore = Math.floor(Math.random() * 34) + 65;

    // Determine status based on score
    let status: "reviewed" | "pending" | "flagged";
    if (overallScore >= 85) {
      status = "reviewed";
    } else if (overallScore >= 75) {
      status = "pending";
    } else {
      status = "flagged";
    }

    // Select a random EAC type
    const eacType = eacTypes[Math.floor(Math.random() * eacTypes.length)];

    // Generate random EAC quantity between 100 and 10000
    const eacQuantity = Math.floor(Math.random() * 9901) + 100;

    // Generate transaction ID
    const transactionId = `TX-${Math.floor(Math.random() * 100000)
      .toString()
      .padStart(6, "0")}`;

    // Create ESG policy match summary
    const esgScore = Math.floor(Math.random() * 25) + 75;
    const esgImpact =
      esgScore >= 90 ? "positive" : esgScore >= 80 ? "neutral" : "negative";

    // Create procurement policy match summary
    const procurementScore = Math.floor(Math.random() * 25) + 75;
    const procurementImpact =
      procurementScore >= 90
        ? "positive"
        : procurementScore >= 80
        ? "neutral"
        : "negative";

    // Create sustainability policy match summary
    const sustainabilityScore = Math.floor(Math.random() * 25) + 75;
    const sustainabilityImpact =
      sustainabilityScore >= 90
        ? "positive"
        : sustainabilityScore >= 80
        ? "neutral"
        : "negative";

    reports.push({
      id: `report-${i + 1}-${vendorId}`,
      vendorId,
      title: reportTypes[i % reportTypes.length],
      date: reportDate.toISOString().split("T")[0],
      transactionId,
      eacQuantity,
      eacType,
      esgPolicyMatch: {
        score: esgScore,
        impact: esgImpact,
        highlights: [
          `${
            esgImpact === "positive"
              ? "Exceeds"
              : esgImpact === "neutral"
              ? "Meets"
              : "Below"
          } corporate ESG targets for ${eacType}`,
          `Carbon intensity ${
            esgImpact === "positive"
              ? "lower"
              : esgImpact === "neutral"
              ? "equivalent"
              : "higher"
          } than industry average`,
          `Social responsibility practices ${
            esgImpact === "positive"
              ? "exceed"
              : esgImpact === "neutral"
              ? "meet"
              : "fall short of"
          } requirements`,
        ],
      },
      procurementPolicyMatch: {
        score: procurementScore,
        impact: procurementImpact,
        highlights: [
          `${
            procurementImpact === "positive"
              ? "Preferred"
              : procurementImpact === "neutral"
              ? "Acceptable"
              : "Cautioned"
          } supplier for ${eacType}`,
          `Pricing ${
            procurementImpact === "positive"
              ? "below"
              : procurementImpact === "neutral"
              ? "within"
              : "above"
          } approved thresholds`,
          `Delivery terms ${
            procurementImpact === "positive"
              ? "exceed"
              : procurementImpact === "neutral"
              ? "meet"
              : "do not fully meet"
          } organizational standards`,
        ],
      },
      sustainabilityPolicyMatch: {
        score: sustainabilityScore,
        impact: sustainabilityImpact,
        highlights: [
          `${
            sustainabilityImpact === "positive"
              ? "Exceeds"
              : sustainabilityImpact === "neutral"
              ? "Meets"
              : "Below"
          } sustainability metrics for ${eacType}`,
          `Production methods ${
            sustainabilityImpact === "positive"
              ? "exceed"
              : sustainabilityImpact === "neutral"
              ? "comply with"
              : "partially comply with"
          } sustainability criteria`,
          `Environmental impact ${
            sustainabilityImpact === "positive"
              ? "minimal"
              : sustainabilityImpact === "neutral"
              ? "acceptable"
              : "concerning"
          } based on policy standards`,
        ],
      },
      overallScore,
      status,
    });
  }

  // Sort reports by date (most recent first)
  return reports.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Default entity name for demo data
const DEFAULT_ENTITY_NAME = "Acme Corporation";

// Sample reports for specific vendors
export const vendorComplianceReports: Record<string, ComplianceReport[]> = {
  [generateVendorId("EcoGas Solutions", DEFAULT_ENTITY_NAME)]:
    generateComplianceReports(
      generateVendorId("EcoGas Solutions", DEFAULT_ENTITY_NAME)
    ),
  [generateVendorId("Green Methanol Inc.", DEFAULT_ENTITY_NAME)]:
    generateComplianceReports(
      generateVendorId("Green Methanol Inc.", DEFAULT_ENTITY_NAME)
    ),
  [generateVendorId("CleanFuel Partners", DEFAULT_ENTITY_NAME)]:
    generateComplianceReports(
      generateVendorId("CleanFuel Partners", DEFAULT_ENTITY_NAME)
    ),
  [generateVendorId("SynthChem Solutions", DEFAULT_ENTITY_NAME)]:
    generateComplianceReports(
      generateVendorId("SynthChem Solutions", DEFAULT_ENTITY_NAME)
    ),
  [generateVendorId("EcoMethane Solutions", DEFAULT_ENTITY_NAME)]:
    generateComplianceReports(
      generateVendorId("EcoMethane Solutions", DEFAULT_ENTITY_NAME)
    ),
};

// Function to get reports for a specific vendor
export const getVendorComplianceReports = (
  vendorId: string
): ComplianceReport[] => {
  if (vendorComplianceReports[vendorId]) {
    return vendorComplianceReports[vendorId];
  }

  // Generate reports for this vendor if none exist
  const reports = generateComplianceReports(vendorId);
  vendorComplianceReports[vendorId] = reports;
  return reports;
};
