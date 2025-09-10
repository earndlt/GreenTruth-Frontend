import { LngTerminalData } from './types';

export const sabinePassTerminalData: LngTerminalData = {
  type: "FeatureCollection",
  name: "Sabine Pass LNG Facility",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-93.8770901, 29.7438551]
      },
      properties: {
        name: "Sabine Pass LNG Facility",
        type: "LNG Terminal",
        state: "Texas",
        county: "Jefferson County",
        description: "Leading LNG export terminal on the Gulf Coast",
        cargoFrequency: "3 cargos per month (one every 10 days)",
        pipeline: "sabine-pass",
        terminal: "sabine-pass",
        availableCargos: 9, // 3 months worth at 3 per month
        cargoPrice: "$0.15/MMBtu",
        color: "#FF6B35"
      }
    }
  ]
};