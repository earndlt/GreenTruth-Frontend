import { PipelineFeature } from "@/components/eac-registry/map/types/pipelineTypes";

// Define the pipeline segments for Rockies Express Pipeline
export const rexSegments: PipelineFeature[] = [
  // Zone 1 - Entrega (Meeker Hub to Cheyenne Hub)
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [-107.9137, 40.0378], // Meeker Hub
        [-104.8214, 40.8776], // Cheyenne Hub
      ],
    },
    properties: {
      name: "Rockies Express Pipeline - Zone 1",
      pipeline: "REX",
      segment: "zone1",
      capacity: "800 MMcf/d",
      direction: "Eastbound",
      producers: ["Acme", "WPX Energy"],
      description: "Zone 1 (Entrega): Meeker Hub (CO) → Cheyenne Hub (CO)",
      availableEACs: 1800,
      eacPrice: "$0.20/MMBtu",
      start: "Meeker Hub",
      end: "Cheyenne Hub",
      color: "#FF5733", // Orange
      verified_sources: ["FERC RP15-1213", "Tallgrass Energy Map"],
    },
  },
  // Zone 2 - West (Cheyenne Hub to Audrain County)
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [-104.8214, 40.8776], // Cheyenne Hub
        [-91.9075, 39.2175], // Audrain County
      ],
    },
    properties: {
      name: "Rockies Express Pipeline - Zone 2",
      pipeline: "REX",
      segment: "zone2",
      capacity: "1,600 MMcf/d",
      direction: "Eastbound",
      producers: ["ConocoPhillips", "Devon"],
      description: "Zone 2 (West): Cheyenne Hub (CO) → Audrain County (MO)",
      availableEACs: 2800,
      eacPrice: "$0.22/MMBtu",
      start: "Cheyenne Hub",
      end: "Audrain County",
      color: "#33C3FF", // Blue
      verified_sources: ["FERC RP15-1213", "Tallgrass Energy Map"],
    },
  },
  // Zone 3 - East (Audrain County to Clarington Hub)
  {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [-91.9075, 39.2175], // Audrain County
        [-80.9689, 39.7756], // Clarington Hub
      ],
    },
    properties: {
      name: "Rockies Express Pipeline - Zone 3",
      pipeline: "REX",
      segment: "zone3",
      capacity: "1,400 MMcf/d",
      direction: "Eastbound",
      producers: ["Chesapeake", "Range Resources"],
      description: "Zone 3 (East): Audrain County (MO) → Clarington Hub (OH)",
      availableEACs: 2500,
      eacPrice: "$0.25/MMBtu",
      start: "Audrain County",
      end: "Clarington Hub",
      color: "#9b59b6", // Purple
      verified_sources: ["FERC RP15-1213", "Tallgrass Energy Map"],
    },
  },
];
