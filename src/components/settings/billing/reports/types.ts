
export interface LlmUsageDataItem {
  featureName: string;
  wordsReadUsed: number;
  wordsWrittenUsed: number;
  totalWordsUsed: number;
  percentage: number;
}

export interface UserUsageDataItem {
  userName: string;
  email: string;
  wordsReadUsed: number;
  wordsWrittenUsed: number;
  totalWordsUsed: number;
  percentage: number;
  features: {
    featureName: string;
    wordsReadUsed: number;
    wordsWrittenUsed: number;
  }[];
}

export interface FeatureUserDataItem {
  featureName: string;
  users: {
    userName: string;
    wordsReadUsed: number;
    wordsWrittenUsed: number;
    totalWordsUsed: number;
    percentage: number;
  }[];
  totalWordsRead: number;
  totalWordsWritten: number;
  totalWords: number;
}

export interface LlmUsageReportProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export interface SubscriptionInfo {
  plan: string;
  addons: string[];
  expires?: Date;
}
