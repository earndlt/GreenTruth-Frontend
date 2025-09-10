
import { BusinessProfile } from '../types/draft-types';

export const formatBusinessProfile = (profile: BusinessProfile): string => {
  return `
Company: ${profile.companyName}
Industry: ${profile.industry}
Mission: ${profile.mission}
Sustainability Goals: ${profile.sustainabilityGoals}
`;
};
