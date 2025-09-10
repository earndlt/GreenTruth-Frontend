
export interface RfiResponse {
  id: string;
  vendorName: string;
  email: string;
  contactEmail?: string;
  subject: string;
  receivedDate: string;
  status: 'new' | 'reviewed' | 'graded' | 'approved' | 'rejected';
  content?: string;
  category: string;
  companyId?: string;
  llmScore?: {
    overall: number;
    procurement: number;
    environmental: number;
    esg: number;
  };
  userScore?: UserScore;
}

export interface UserScore {
  procurement: number;
  environmental: number;
  esg: number;
}
