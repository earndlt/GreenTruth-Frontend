
export const getContractIdLabel = (selectedPipeline: "REX" | "Ruby"): string => {
  return selectedPipeline === "REX" 
    ? "REX Contract ID (K#)" 
    : "Ruby Contract ID (K#)";
};

export const getContractIdPlaceholder = (selectedPipeline: "REX" | "Ruby"): string => {
  return selectedPipeline === "REX" 
    ? "e.g. 961214 or K# 961214" 
    : "e.g. 961362 or K# 961362";
};

export const getEmissionPointLabel = (point: string): string => {
  switch (point) {
    case "production": return "Natural Gas Production";
    case "processing": return "Gas Processing";
    case "transportation": return "Transportation";
    case "gathering_boosting": return "Gathering & Boosting";
    default: return point;
  }
};
