
# Stripe Billing / Subscription System

> Covers all billing for subscriptions and add-ons (like SoD).

---

## Overview

- All subscription billing is through Stripe’s recurring billing integration.
- Add-ons (e.g., SoD) are toggled in Stripe and reflected in your `subscription.addons` array for conditional UI.

## Key Resources

- **UI:**  
  - `src/components/settings/BillingTab.tsx`
- **Edge Functions:**  
  - `supabase/functions/create-checkout/index.ts`
  - `supabase/functions/check-subscription/index.ts`
- **Add-Ons Handling:**  
  Expose features in the UI based on `subscription.addons`.

## Further Reading

- For full instructions, including success/cancel URL handling and RLS details, see [Stripe Integration Implementation Guide For Subscriptions](../guides/stripe-implementation-subscriptions.md).
