import { LngTerminalData } from './types';

export const plaqueminesTerminalData: LngTerminalData = {
  type: "FeatureCollection",
  name: "Plaquemines LNG Terminal",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-89.886404, 29.600411]
      },
      properties: {
        name: "Plaquemines LNG Terminal",
        type: "LNG Terminal",
        state: "Louisiana",
        county: "Plaquemines Parish",
        description: "Major LNG export facility serving international markets",
        cargoFrequency: "10 cargos per month (one every 3 days)",
        pipeline: "plaquemines",
        terminal: "plaquemines",
        availableCargos: 30, // 3 months worth at 10 per month
        cargoPrice: "$0.15/MMBtu",
        color: "#FF6B35"
      }
    }
  ]
};