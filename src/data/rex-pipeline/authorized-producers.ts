
import { AuthorizedProducer } from "@/components/eac-registry/map/types/pipelineTypes";

// Define the authorized producers for Rockies Express Pipeline
export const rexAuthorizedProducers: AuthorizedProducer[] = [
  {
    name: "Eco-Energy Natural Gas, LLC",
    contract_number: "960300",
    details: "Authorized for firm transportation rights under a negotiated rate agreement",
    effective_date: "July 1, 2024",
    available_eacs: 750,
    eac_price: "$0.05/MMBtu"
  },
  {
    name: "L-H Battery Company, Incorporated",
    contract_number: "959468",
    details: "Authorized for bidirectional Zone 3 capacity under a TSA",
    effective_date: "July 8, 2024",
    available_eacs: 820,
    eac_price: "$0.05/MMBtu"
  },
  {
    name: "Mieco, Inc.",
    contract_number: "961214",
    details: "Authorized for Decatur Lateral Project transportation",
    effective_date: "February 1, 2025",
    available_eacs: 680,
    eac_price: "$0.05/MMBtu"
  },
  {
    name: "Southwest",
    contract_number: "961215",
    details: "Authorized for Decatur Lateral Project transportation",
    effective_date: "February 1, 2025",
    available_eacs: 540,
    eac_price: "$0.05/MMBtu"
  },
  {
    name: "Twin Eagle",
    contract_number: "961232",
    details: "Authorized for Decatur Lateral Project transportation",
    effective_date: "February 1, 2025",
    available_eacs: 910,
    eac_price: "$0.05/MMBtu"
  },
  {
    name: "Ultra Resources, Inc.",
    contract_number: "N/A",
    details: "Long-term transportation rights established via a precedent agreement since the pipeline's inception",
    effective_date: "Pipeline inception",
    available_eacs: 1200,
    eac_price: "$0.05/MMBtu"
  }
];
