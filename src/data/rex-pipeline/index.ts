
import { PipelineData } from "@/components/eac-registry/map/types/pipelineTypes";
import { rexSegments } from "./segments";
import { rexDeliveryPoints } from "./delivery-points";

// Combine segments and delivery points to create the complete REX pipeline data
export const rexPipelineData: PipelineData = {
  type: "FeatureCollection",
  features: [
    ...rexSegments,
    ...rexDeliveryPoints
  ]
};
