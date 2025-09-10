
// Valid receipt location IDs and names for REX pipeline
export interface ReceiptLocation {
  id: string;
  name: string;
  zone: string;
}

export const validReceiptLocations: ReceiptLocation[] = [
  // Zone 1 Receipt Points (Wyoming/Colorado Region)
  { id: "42234", name: "WHITE RI/REX MEEKER RIO BLANCO", zone: "Zone 1" },
  { id: "42235", name: "REX/TRANSCOL LOVE RANCH RIO BLANCO", zone: "Zone 1" },
  { id: "42717R", name: "TPC/REX LONE TREE WELD REC", zone: "Zone 1" },
  { id: "42722", name: "WIC/REX SITTING BULL WELD #1", zone: "Zone 1" },
  { id: "42760", name: "WAMSUTT/REX ECHO SPRINGS SWEETWATER", zone: "Zone 1" },
  { id: "43036", name: "LOST CRK/REX SWEETWATER", zone: "Zone 1" },
  { id: "43462", name: "WFS/REX OPAL (OT #25) LINCOLN", zone: "Zone 1" },
  { id: "43492", name: "REX/REX CHEYENNE HUB POOL WELD", zone: "Zone 1" },
  { id: "43493", name: "REX/REX MEEKER HUB POOL RIO BLANCO", zone: "Zone 1" },
  { id: "43494", name: "WAMSUTTER HUB POOL", zone: "Zone 1" },
  { id: "43495", name: "OPAL HUB POOL", zone: "Zone 1" },
  { id: "60345P", name: "CHEYENNE CONNECTOR/REX WELD", zone: "Zone 1" },
  { id: "60348", name: "WIC/REX SITTING BULL WELD #2", zone: "Zone 1" },
  { id: "60364", name: "REX/REX CHEYENNE COMPRESSION POOL", zone: "Zone 1" },
  { id: "44619P", name: "REX/TIGT HAPPY HOLLOW WELD", zone: "Zone 1" },
  { id: "46748", name: "RYCKMAN UINTA W/D", zone: "Zone 1" },
  { id: "43933", name: "COL GULF CARTER CRK", zone: "Zone 1" },
  { id: "43939", name: "QET CLEAR CREEK REC", zone: "Zone 1" },
  { id: "43947", name: "KERN ROBERSON CRK REC", zone: "Zone 1" },
  { id: "43463", name: "ENTERPRISE PIONEER", zone: "Zone 1" },
  { id: "43945", name: "QPC EAKIN REC", zone: "Zone 1" },
  { id: "43943", name: "QGM BLACKS FORK", zone: "Zone 1" },
  { id: "43935", name: "MGR GRANGER", zone: "Zone 1" },
  { id: "44171", name: "CROSSOVER 16 HIB POOL POINT", zone: "Zone 1" },
  { id: "44170", name: "KANDA HUB POOL POINT", zone: "Zone 1" },
  { id: "43936", name: "QPC KANDA COLEMAN", zone: "Zone 1" },
  { id: "43941", name: "WIC KANDA REC", zone: "Zone 1" },
  { id: "46137", name: "WIC THREE MILE", zone: "Zone 1" },
  { id: "42804", name: "OVERTHRUST WAMSUTTER", zone: "Zone 1" },
  { id: "42228", name: "CIG FREWEN LAKE", zone: "Zone 1" },
  { id: "42230", name: "WIC BITTER CREEK", zone: "Zone 1" },
  { id: "42656", name: "HRM GREAT DIVIDE", zone: "Zone 1" },
  { id: "42718", name: "CHEY CRAZY BEAR", zone: "Zone 1" },
  
  // Zone 2 Receipt Points (Nebraska through Missouri)
  { id: "60795", name: "EAST CHEYENNE REX LOGAN", zone: "Zone 2" },
  { id: "60502", name: "ZONE 2 DELIVERED POOL POINT", zone: "Zone 2" },
  
  // Zone 3 Receipt Points (Illinois through Ohio)
  { id: "44936", name: "MO GAS PIKE", zone: "Zone 3" },
  { id: "60494", name: "TWIN BRIDGES/REX RNG SUPPLY HENDRICKS", zone: "Zone 3" },
  { id: "44424", name: "DOMINION/REX CLAR MONROE", zone: "Zone 3" },
  { id: "44490", name: "E OH GAS/REX CLAR MONROE", zone: "Zone 3" },
  { id: "44962", name: "LEBANON HUB POOL", zone: "Zone 3" },
  { id: "45222", name: "CLARINGTON HUB POOL", zone: "Zone 3" },
  { id: "56116", name: "MARKWEST/REX SENECA NOBLE", zone: "Zone 3" },
  { id: "60059", name: "EUREKA MIDSTREAM/REX CAMERON MONROE", zone: "Zone 3" },
  { id: "60060", name: "OHIO RIVER SYSTEM/REX BEARWALLOW MON", zone: "Zone 3" },
  { id: "60062", name: "EQT OVC/REX ISALY MONROE", zone: "Zone 3" },
  { id: "60065", name: "RICE/REX GUNSLINGER MONROE", zone: "Zone 3" },
  { id: "60167", name: "ROVER/REX NOBLE", zone: "Zone 3" },
  { id: "60503", name: "ZONE 3 DELIVERED POINT POOL", zone: "Zone 3" },
  { id: "60158", name: "SENECA LATERAL REX MAINLINE", zone: "Zone 3" },
];

// Utility function to check if a receipt location ID is valid
export const isValidReceiptLocationId = (id: string): boolean => {
  return validReceiptLocations.some(location => location.id === id);
};

// Utility function to get location name by ID
export const getReceiptLocationNameById = (id: string): string | undefined => {
  const location = validReceiptLocations.find(loc => loc.id === id);
  return location?.name;
};

// Group receipt locations by zone for easier selection
export const receiptLocationsByZone = validReceiptLocations.reduce<Record<string, ReceiptLocation[]>>(
  (acc, location) => {
    if (!acc[location.zone]) {
      acc[location.zone] = [];
    }
    acc[location.zone].push(location);
    return acc;
  }, 
  {}
);
