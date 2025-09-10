import { PipelineFeature } from "@/components/eac-registry/map/types/pipelineTypes";
import { rexAuthorizedProducers } from "./authorized-producers";

// Define the delivery points for Rockies Express Pipeline
export const rexDeliveryPoints: PipelineFeature[] = [
  // Offtake Point - Denver Hub (Antero Resources)
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-104.9903, 39.7392],
    },
    properties: {
      name: "Denver Hub",
      state: "Colorado",
      county: "Denver County",
      type: "Offtake Point",
      pipeline: "REX",
      iconSize: [40, 40],
      description: "Antero Resources Corporation headquarters and trading hub",
      availableEACs: 2000,
      eacPrice: "$0.05/MMBtu",
      connected_systems: [
        "Colorado Interstate Gas",
        "Cheyenne Plains Gas Pipeline",
      ],
      verified_sources: [
        "FERC RP15-1213",
        "FERC RP24-897-000",
        "Tallgrass Energy Map",
      ],
      connected_entities: [
        {
          name: "Antero Resources Corporation",
          id: "ANTERO-DEN-2024",
          type: "producer",
          max_throughput: "500 MMcf/d",
        },
      ],
      authorized_producers: [
        rexAuthorizedProducers[0], // Eco-Energy
        rexAuthorizedProducers[4], // Twin Eagle
        rexAuthorizedProducers[5], // Ultra Resources
      ],
    },
  },
  // Offtake Point - Meeker Hub
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-107.9137, 40.0378],
    },
    properties: {
      name: "Meeker Hub",
      state: "Colorado",
      county: "Rio Blanco County",
      type: "Offtake Point",
      pipeline: "REX",
      iconSize: [40, 40],
      description: "Major gas trading hub in Colorado",
      availableEACs: 1200,
      eacPrice: "$0.05/MMBtu",
      connected_systems: ["White River Hub", "TransColorado Gas"],
      verified_sources: [
        "FERC RP15-1213",
        "FERC RP24-897-000",
        "Tallgrass Energy Map",
      ],
      connected_entities: [
        {
          name: "Acme",
          id: "FERC-QA12-22",
          type: "producer",
        },
        {
          name: "WPX Energy",
          id: null,
          type: "producer",
          max_throughput: "250 MMcf/d",
        },
      ],
      authorized_producers: [
        rexAuthorizedProducers[5], // Ultra Resources
        rexAuthorizedProducers[4], // Twin Eagle
      ],
    },
  },
  // Offtake Point - Wamsutter Hub
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-107.2079, 41.6661],
    },
    properties: {
      name: "Wamsutter Hub",
      state: "Wyoming",
      county: "Sweetwater County",
      type: "Offtake Point",
      pipeline: "REX",
      iconSize: [40, 40],
      description: "Connection point in southwestern Wyoming",
      availableEACs: 950,
      eacPrice: "$0.05/MMBtu",
      connected_systems: ["Colorado Interstate Gas"],
      verified_sources: [
        "FERC RP15-1213",
        "FERC RP24-897-000",
        "Tallgrass Energy Map",
      ],
      connected_entities: [
        {
          name: "BP",
          id: "FERC-BP44-10",
          type: "producer",
        },
        {
          name: "EQT",
          id: "FERC-EQT-WY11",
          type: "producer",
          max_throughput: "200 MMcf/d",
        },
      ],
      authorized_producers: [
        rexAuthorizedProducers[0], // Eco-Energy
        rexAuthorizedProducers[5], // Ultra Resources
      ],
    },
  },
  // Offtake Point - Cheyenne Hub
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-104.8214, 40.8776],
    },
    properties: {
      name: "Cheyenne Hub",
      state: "Colorado",
      county: "Weld County",
      type: "Offtake Point",
      pipeline: "REX",
      iconSize: [40, 40],
      description: "Major interconnect point between Zone 1 and Zone 2",
      availableEACs: 1500,
      eacPrice: "$0.05/MMBtu",
      connected_systems: [
        "Cheyenne Plains Gas Pipeline",
        "Trailblazer Pipeline",
      ],
      verified_sources: [
        "FERC RP15-1213",
        "FERC RP24-806-000",
        "Tallgrass Energy Map",
      ],
      connected_entities: [
        {
          name: "Anadarko Petroleum",
          id: "APC-2023-WELD",
          type: "producer",
        },
        {
          name: "Noble Energy",
          id: "NBL-2023-WELD",
          type: "producer",
          max_throughput: "300 MMcf/d",
        },
      ],
      authorized_producers: [
        rexAuthorizedProducers[0], // Eco-Energy
        rexAuthorizedProducers[4], // Twin Eagle
        rexAuthorizedProducers[5], // Ultra Resources
      ],
    },
  },
  // Offtake Point - Audrain County
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-91.9075, 39.2175],
    },
    properties: {
      name: "Audrain County Interconnect",
      state: "Missouri",
      county: "Audrain County",
      type: "Offtake Point",
      pipeline: "REX",
      iconSize: [40, 40],
      description: "Interconnect point between Zone 2 and Zone 3",
      availableEACs: 1100,
      eacPrice: "$0.05/MMBtu",
      connected_systems: ["Mississippi River Transmission"],
      verified_sources: [
        "FERC RP15-1213",
        "FERC RP24-806-000",
        "Tallgrass Energy Map",
      ],
      connected_entities: [
        {
          name: "Spire Energy",
          id: "SPIRE-MO-2022",
          type: "buyer",
        },
        {
          name: "Ameren",
          id: "AMR-MO-22",
          type: "buyer",
          max_throughput: "180 MMcf/d",
        },
      ],
      authorized_producers: [
        rexAuthorizedProducers[1], // L-H Battery Company
        rexAuthorizedProducers[2], // Mieco, Inc.
        rexAuthorizedProducers[3], // Southwest
      ],
    },
  },
  // Offtake Point - Lebanon Hub
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-84.2025, 39.4353],
    },
    properties: {
      name: "Lebanon Hub",
      state: "Ohio",
      county: "Warren County",
      type: "Offtake Point",
      pipeline: "REX",
      iconSize: [40, 40],
      description: "Major hub in southwestern Ohio",
      availableEACs: 1250,
      eacPrice: "$0.05/MMBtu",
      connected_systems: ["Columbia Gas", "Texas Eastern"],
      verified_sources: [
        "FERC RP15-1213",
        "FERC RP24-897-000",
        "Tallgrass Energy Map",
      ],
      connected_entities: [
        {
          name: "Duke Energy",
          id: "DUKE-OH-23",
          type: "buyer",
        },
        {
          name: "Dominion Energy",
          id: "DOM-OH-22",
          type: "buyer",
          max_throughput: "220 MMcf/d",
        },
      ],
      authorized_producers: [
        rexAuthorizedProducers[1], // L-H Battery Company
        rexAuthorizedProducers[2], // Mieco, Inc.
      ],
    },
  },
  // Offtake Point - Clarington Hub
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [-80.9689, 39.7756],
    },
    properties: {
      name: "Clarington Hub",
      state: "Ohio",
      county: "Monroe County",
      type: "Offtake Point",
      pipeline: "REX",
      iconSize: [40, 40],
      description: "Eastern terminus of the Rockies Express Pipeline",
      availableEACs: 1400,
      eacPrice: "$0.05/MMBtu",
      connected_systems: ["Tennessee Gas Pipeline", "Dominion Transmission"],
      verified_sources: [
        "FERC RP15-1213",
        "FERC RP24-897-000",
        "FERC RP24-806-000",
      ],
      connected_entities: [
        {
          name: "Shell Energy",
          id: "SHELL-OH-22",
          type: "buyer",
        },
        {
          name: "EQT Corporation",
          id: "EQT-OH-23",
          type: "buyer",
          max_throughput: "250 MMcf/d",
        },
      ],
      authorized_producers: [
        rexAuthorizedProducers[0], // Eco-Energy
        rexAuthorizedProducers[1], // L-H Battery Company
        rexAuthorizedProducers[2], // Mieco, Inc.
        rexAuthorizedProducers[3], // Southwest
        rexAuthorizedProducers[4], // Twin Eagle
      ],
    },
  },
];
