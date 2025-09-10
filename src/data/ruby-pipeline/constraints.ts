
import { PipelineFeature } from "@/components/eac-registry/map/types/pipelineTypes";

// Ruby Pipeline constraint sections
export const rubyConstraintSegments: PipelineFeature[] = [
  // Ruby Pipeline - Roberson Creek Constraint Section
  {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [-111.8342, 41.9875], // Approximate Roberson Creek location
        [-112.8410, 41.7520]  // End of constraint section
      ]
    },
    "properties": {
      "name": "Roberson Creek Constraint",
      "pipeline": "Ruby",
      "segment": "ruby-constraint",
      "capacity": "1.3 Bcf/d",
      "direction": "Westbound",
      "producers": ["Tallgrass Energy"],
      "description": "A section with reduced capacity due to terrain considerations.",
      "availableEACs": 950,
      "eacPrice": "$0.24/MMBtu"
    }
  },
  // Ruby Pipeline - Wieland Flat Constraint Section
  {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [-117.2510, 41.2230], // Approximate Wieland Flat location
        [-118.4520, 41.4120]  // End of constraint section
      ]
    },
    "properties": {
      "name": "Wieland Flat Constraint",
      "pipeline": "Ruby",
      "segment": "ruby-constraint",
      "capacity": "1.4 Bcf/d",
      "direction": "Westbound",
      "producers": ["Tallgrass Energy"],
      "description": "A section with reduced capacity due to environmental considerations.",
      "availableEACs": 1050,
      "eacPrice": "$0.23/MMBtu"
    }
  }
];
