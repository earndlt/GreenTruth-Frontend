
import { NextPlanInfo } from '../types/userManagement';

// Get the next plan based on current plan
export const getNextPlan = (currentPlan: string): NextPlanInfo => {
  switch (currentPlan) {
    case 'basic':
      return { name: 'pro', price: '$175/month', seats: 1 };
    case 'pro':
      return { name: 'team', price: '$750/month', seats: 5 };
    case 'team':
      return { name: 'business', price: '$1,800/month', seats: 15 };
    case 'business':
      return { name: 'enterprise', price: 'Custom', seats: '15+' };
    default:
      return { name: 'pro', price: '$175/month', seats: 1 };
  }
};
