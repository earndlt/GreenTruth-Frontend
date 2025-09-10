
import { PipelineFeature } from "@/components/eac-registry/map/types/pipelineTypes";

// Main Ruby Pipeline route
export const rubyMainSegments: PipelineFeature[] = [
  {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [-110.7986, 42.5572], // Opal Hub, WY
        [-114.0387, 41.5208], // Curlew Junction, UT
        [-115.7617, 40.8326], // Elko, NV
        [-119.2871, 41.6684], // NW Nevada
        [-121.4147, 42.0165]  // Malin, OR
      ]
    },
    "properties": {
      "name": "Ruby Pipeline Mainline",
      "pipeline": "Ruby",
      "segment": "ruby-mainline",
      "capacity": "1.5 Bcf/d",
      "direction": "Westbound",
      "producers": ["Tallgrass Energy", "Pembina (historical)"],
      "description": "The Ruby Pipeline transports natural gas from the Rocky Mountain region to markets in the western United States.",
      "availableEACs": 2800,
      "eacPrice": "$0.22/MMBtu"
    }
  }
];
