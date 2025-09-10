
import { UserRole } from '../user/userTypes';
import { SubscriptionInfo } from '@/components/settings/billing/reports/types';

export function useUserPermissions(
  userRole: UserRole,
  subscription?: SubscriptionInfo
) {
  // Check if user has SoD feature based on subscription
  const hasSodFeature = subscription?.addons?.includes('sod') || false;

  // Determine admin status
  const isAdmin = userRole === 'admin' || userRole === 'administrator';

  // Manager status (SoD)
  const isManager = userRole === 'manager';

  // Permission logic separated out
  const hasPermission = (permission: string): boolean => {
    // Admin/administrator has all permissions
    if (isAdmin) return true;

    // If SoD is enabled, use SoD permissions model
    if (hasSodFeature) {
      switch (userRole) {
        case 'manager':
          return [
            'approve_transaction', 
            'set_payment_status', 
            'approve_retirement', 
            'approve_transfer',
            'approve_batch'
          ].includes(permission);

        case 'treasury':
          return [
            'view_transactions',
            'initiate_transaction',
            'view_wallets',
            'initiate_retirement',
            'initiate_transfer'
          ].includes(permission);

        case 'risk':
          return [
            'view_transactions',
            'administer_vendors',
            'view_wallets'
          ].includes(permission);

        case 'trader':
          return [
            'view_transactions',
            'administer_vendors',
            'initiate_transaction',
            'view_wallets',
            'initiate_retirement',
            'initiate_transfer'
          ].includes(permission);

        case 'professional':
          return [
            'view_transactions',
            'administer_vendors',
            'initiate_transaction',
            'view_wallets'
          ].includes(permission);

        case 'analyst':
          return [
            'view_transactions',
            'view_wallets',
            'view_profiles'
          ].includes(permission);

        default:
          return false;
      }
    }

    // Basic RBAC permissions
    switch (userRole) {
      case 'member':
        return [
          'buy_tokens',
          'sell_tokens',
          'retire_tokens',
          'transfer_tokens',
          'approve_token_actions',
          'view_transactions',
          'view_wallets',
          'view_profiles'
        ].includes(permission);

      case 'guest':
        return [
          'view_transactions',
          'view_wallets',
          'view_profiles'
        ].includes(permission);

      default:
        return false;
    }
  };

  return {
    hasSodFeature,
    isAdmin,
    isManager,
    hasPermission,
  };
}
