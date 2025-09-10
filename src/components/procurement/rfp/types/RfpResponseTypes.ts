
export interface LlmScore {
  overall: number;
  procurement: number;
  environmental: number;
  esg: number;
}

export interface UserScore {
  procurement: number;
  environmental: number;
  esg: number;
}

export interface RfpResponse {
  id: string;
  vendorName: string;
  rfpTitle: string;
  submittedDate: string;
  status: string;
  score: number | null;
  email: string;
  receivedDate: string;
  // Additional properties needed by components
  contactEmail?: string;
  llmScore?: LlmScore;
  userScore?: UserScore;
  category?: string;
  subject?: string;
  responseContent?: string;
}
