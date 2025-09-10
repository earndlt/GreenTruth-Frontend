
import { LlmUsageDataItem, UserUsageDataItem, FeatureUserDataItem } from '../types';

// Mock data with words read and written differentiated
export const featureUsageData: LlmUsageDataItem[] = [
  { featureName: 'Semantic Search', wordsReadUsed: 834567, wordsWrittenUsed: 400000, totalWordsUsed: 1234567, percentage: 41.2 },
  { featureName: 'Procurement', wordsReadUsed: 587654, wordsWrittenUsed: 400000, totalWordsUsed: 987654, percentage: 32.9 },
  { featureName: 'Compliance Monitoring', wordsReadUsed: 256789, wordsWrittenUsed: 200000, totalWordsUsed: 456789, percentage: 15.2 },
  { featureName: 'Reports', wordsReadUsed: 134567, wordsWrittenUsed: 100000, totalWordsUsed: 234567, percentage: 7.8 },
  { featureName: 'Other Features', wordsReadUsed: 67654, wordsWrittenUsed: 20000, totalWordsUsed: 87654, percentage: 2.9 }
];

export const userUsageData: UserUsageDataItem[] = [
  { 
    userName: 'Alex Johnson', 
    email: 'alex@company.com',
    wordsReadUsed: 723456,
    wordsWrittenUsed: 400000,
    totalWordsUsed: 1123456, 
    percentage: 37.4,
    features: [
      { featureName: 'Semantic Search', wordsReadUsed: 367890, wordsWrittenUsed: 200000 },
      { featureName: 'Procurement', wordsReadUsed: 245678, wordsWrittenUsed: 100000 },
      { featureName: 'Compliance Monitoring', wordsReadUsed: 109888, wordsWrittenUsed: 100000 }
    ]
  },
  { 
    userName: 'Samantha Lee', 
    email: 'sam@company.com',
    wordsReadUsed: 576543,
    wordsWrittenUsed: 300000,
    totalWordsUsed: 876543, 
    percentage: 29.2,
    features: [
      { featureName: 'Procurement', wordsReadUsed: 254567, wordsWrittenUsed: 200000 },
      { featureName: 'Semantic Search', wordsReadUsed: 245678, wordsWrittenUsed: 100000 },
      { featureName: 'Reports', wordsReadUsed: 76298, wordsWrittenUsed: 0 }
    ]
  },
  { 
    userName: 'Mike Chen', 
    email: 'mike@company.com',
    wordsReadUsed: 367890,
    wordsWrittenUsed: 200000,
    totalWordsUsed: 567890, 
    percentage: 18.9,
    features: [
      { featureName: 'Compliance Monitoring', wordsReadUsed: 134567, wordsWrittenUsed: 100000 },
      { featureName: 'Other Features', wordsReadUsed: 47654, wordsWrittenUsed: 40000 },
      { featureName: 'Procurement', wordsReadUsed: 185669, wordsWrittenUsed: 60000 }
    ]
  },
  { 
    userName: 'Emma Wilson', 
    email: 'emma@company.com',
    wordsReadUsed: 332198,
    wordsWrittenUsed: 100000,
    totalWordsUsed: 432198, 
    percentage: 14.4,
    features: [
      { featureName: 'Reports', wordsReadUsed: 108269, wordsWrittenUsed: 50000 },
      { featureName: 'Semantic Search', wordsReadUsed: 171084, wordsWrittenUsed: 50000 },
      { featureName: 'Procurement', wordsReadUsed: 52845, wordsWrittenUsed: 0 }
    ]
  }
];

export const featureUserData: FeatureUserDataItem[] = [
  {
    featureName: 'Semantic Search',
    totalWordsRead: 834567,
    totalWordsWritten: 400000,
    totalWords: 1234567,
    users: [
      { userName: 'Alex Johnson', wordsReadUsed: 367890, wordsWrittenUsed: 200000, totalWordsUsed: 567890, percentage: 46.0 },
      { userName: 'Samantha Lee', wordsReadUsed: 245678, wordsWrittenUsed: 100000, totalWordsUsed: 345678, percentage: 28.0 },
      { userName: 'Emma Wilson', wordsReadUsed: 171084, wordsWrittenUsed: 100000, totalWordsUsed: 271084, percentage: 22.0 }
    ]
  },
  {
    featureName: 'Procurement',
    totalWordsRead: 587654,
    totalWordsWritten: 400000,
    totalWords: 987654,
    users: [
      { userName: 'Samantha Lee', wordsReadUsed: 254567, wordsWrittenUsed: 200000, totalWordsUsed: 454567, percentage: 46.0 },
      { userName: 'Alex Johnson', wordsReadUsed: 245678, wordsWrittenUsed: 100000, totalWordsUsed: 345678, percentage: 35.0 },
      { userName: 'Mike Chen', wordsReadUsed: 185669, wordsWrittenUsed: 60000, totalWordsUsed: 245669, percentage: 24.9 },
      { userName: 'Emma Wilson', wordsReadUsed: 52845, wordsWrittenUsed: 0, totalWordsUsed: 52845, percentage: 5.4 }
    ]
  }
];
