
import { PipelineData } from "@/components/eac-registry/map/types/pipelineTypes";
import { rubyMainSegments } from "./segments";
import { rubyConstraintSegments } from "./constraints";
import { rubyDeliveryPoints } from "./delivery-points";

// Ruby pipeline data with all features combined
export const rubyPipelineData: PipelineData = {
  type: "FeatureCollection",
  features: [
    // Combine all Ruby pipeline features
    ...rubyMainSegments,
    ...rubyConstraintSegments,
    ...rubyDeliveryPoints
  ]
};
