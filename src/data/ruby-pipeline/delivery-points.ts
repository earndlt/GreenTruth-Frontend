import { PipelineFeature } from "@/components/eac-registry/map/types/pipelineTypes";

// Ruby Pipeline delivery and interconnection points
export const rubyDeliveryPoints: PipelineFeature[] = [
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-110.7986, 42.5572]
    },
    "properties": {
      "name": "Opal Hub",
      "state": "Wyoming",
      "county": "Lincoln County",
      "type": "Delivery Point",
      "iconSize": [40, 40],
      "description": "Major gas hub in southwestern Wyoming, eastern origination point of Ruby Pipeline",
      "availableEACs": 1500,
      "eacPrice": "$0.05/MMBtu",
      "connected_systems": ["Williams Northwest Pipeline", "Kern River"],
      "pipeline": "Ruby",
      "verified_sources": [
        "FERC Docket CP10-22",
        "PHMSA Operator ID: 39842"
      ],
      "connected_entities": [
        {
          "name": "Kinder Morgan",
          "id": "KM-2023-RUBY",
          "type": "producer",
          "ferc_docket": "CP10-22-000"
        },
        {
          "name": "QEP Resources",
          "id": "WY-7890",
          "type": "producer",
          "max_throughput": "250 MMcf/d",
          "ferc_docket": "CP10-22-001"
        },
        {
          "name": "Williams Companies",
          "id": "WILL-4567",
          "type": "transporter",
          "max_throughput": "180 MMcf/d",
          "ferc_docket": "CP08-78-000"
        },
        {
          "name": "Kern River Gas Transmission",
          "id": "KRGT-1234",
          "type": "transporter",
          "max_throughput": "315 MMcf/d",
          "ferc_docket": "CP07-442-000"
        },
        {
          "name": "Wyoming Interstate Company",
          "id": "WIC-5678",
          "type": "transporter",
          "ferc_docket": "CP05-54-000"
        }
      ]
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-114.0387, 41.5208]
    },
    "properties": {
      "name": "Curlew Junction",
      "state": "Utah",
      "county": "Box Elder County",
      "type": "Compressor Station",
      "iconSize": [40, 40],
      "description": "Compressor station for maintaining pipeline pressure",
      "availableEACs": 920,
      "eacPrice": "$0.05/MMBtu",
      "pipeline": "Ruby"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-115.7617, 40.8326]
    },
    "properties": {
      "name": "Elko Station",
      "state": "Nevada",
      "county": "Elko County",
      "type": "Compressor Station",
      "iconSize": [40, 40],
      "description": "Compressor station serving northeastern Nevada",
      "availableEACs": 780,
      "eacPrice": "$0.05/MMBtu",
      "pipeline": "Ruby"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-119.2871, 41.6684]
    },
    "properties": {
      "name": "Northwest Nevada Station",
      "state": "Nevada",
      "county": "Humboldt County",
      "type": "Compressor Station",
      "iconSize": [40, 40],
      "description": "Compressor station in northwestern Nevada",
      "availableEACs": 850,
      "eacPrice": "$0.05/MMBtu",
      "pipeline": "Ruby"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-121.4147, 42.0165]
    },
    "properties": {
      "name": "Malin Interconnect",
      "state": "Oregon",
      "county": "Klamath County",
      "type": "Delivery Point",
      "iconSize": [40, 40],
      "description": "Western terminus of Ruby Pipeline with interconnections to PG&E and GTN",
      "availableEACs": 1650,
      "eacPrice": "$0.05/MMBtu",
      "connected_systems": ["Gas Transmission Northwest", "Pacific Gas & Electric"],
      "pipeline": "Ruby",
      "verified_sources": [
        "FERC Docket CP10-22",
        "Oregon PUC Filing OR-4567"
      ],
      "connected_entities": [
        {
          "name": "PG&E",
          "id": "CA15-0022",
          "type": "buyer",
          "ferc_docket": "CP10-22-003"
        },
        {
          "name": "Northwest Natural",
          "id": "OR-4567",
          "type": "buyer",
          "max_throughput": "150 MMcf/d",
          "ferc_docket": "RP14-1034-000"
        },
        {
          "name": "Gas Transmission Northwest",
          "id": "GTN-7834",
          "type": "transporter",
          "max_throughput": "220 MMcf/d",
          "ferc_docket": "CP11-128-000"
        },
        {
          "name": "Cascade Natural Gas",
          "id": "CNG-4321",
          "type": "distributor",
          "max_throughput": "75 MMcf/d",
          "ferc_docket": "RP13-545-000"
        },
        {
          "name": "Avista Utilities",
          "id": "AV-9876",
          "type": "buyer",
          "max_throughput": "95 MMcf/d",
          "ferc_docket": "RP15-892-000"
        },
        {
          "name": "Puget Sound Energy",
          "id": "PSE-6543",
          "type": "buyer",
          "ferc_docket": "RP12-778-000"
        }
      ]
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-117.0667, 44.3167]
    },
    "properties": {
      "name": "Turquoise Flats",
      "state": "Oregon",
      "county": "Lake County",
      "type": "Delivery Point",
      "iconSize": [40, 40],
      "description": "Bi-directional interconnection point with Gas Transmission Northwest",
      "availableEACs": 1100,
      "eacPrice": "$0.05/MMBtu",
      "connected_to": "Gas Transmission Northwest",
      "max_flow": "300 MMcf/d",
      "pipeline": "Ruby",
      "verified_sources": [
        "FERC CP10-22 Environmental Impact Statement"
      ]
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-120.5482, 42.7851]
    },
    "properties": {
      "name": "Onyx Hill",
      "state": "Oregon",
      "county": "Klamath County",
      "type": "Delivery Point",
      "iconSize": [40, 40],
      "description": "Interconnection point with Pacific Gas & Electric",
      "availableEACs": 980,
      "eacPrice": "$0.05/MMBtu",
      "connected_to": "Pacific Gas & Electric",
      "pipeline": "Ruby"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-116.2384, 41.9732]
    },
    "properties": {
      "name": "Sapphire Mountain",
      "state": "Nevada",
      "county": "Elko County",
      "type": "Delivery Point",
      "iconSize": [40, 40],
      "description": "Interconnection point with Tuscarora Gas Transmission",
      "availableEACs": 820,
      "eacPrice": "$0.05/MMBtu",
      "connected_to": "Tuscarora Gas Transmission",
      "pipeline": "Ruby"
    }
  },
  {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-112.5231, 41.8947]
    },
    "properties": {
      "name": "Opal Valley",
      "state": "Utah",
      "county": "Box Elder County",
      "type": "Delivery Point",
      "iconSize": [40, 40],
      "description": "Interconnection point with Paiute Pipeline",
      "availableEACs": 750,
      "eacPrice": "$0.05/MMBtu",
      "connected_to": "Paiute Pipeline",
      "pipeline": "Ruby"
    }
  }
];
