
# Stripe Integration: Transaction Payments

This document covers **transactional payment flows** (EAC purchases through EarnDLT)—not billing/subscription payments.

---

## Overview

- **Transactional Payments** are for one-time EAC purchases, initiated by users during procurement or registry flows.
- **Stripe** is used for payment clearing; **Plaid** enables ACH and bank account verification.
- This payment flow is completely distinct from subscription billing.

---

## Integration Guide

### 1. Stripe Integration

- *Do not* use the recurring subscription logic for transactional payments.
- Use Stripe’s [PaymentIntent](https://stripe.com/docs/api/payment_intents) or Checkout Sessions API with `mode: "payment"` for each transaction.

### 2. Plaid Integration (Bank ACH Verification)

- Use serverless Edge Function `supabase/functions/plaid-link/index.ts` for bank account verification.
- Store Plaid-verifed payment methods in the `payment_methods` table (see schema example below).

### 3. Payment Workflow

**Steps:**
1. User adds a payment method (card/ACH) via the web UI (`/settings` route).  
2. For ACH, Plaid Link guides the user through bank verification, via Edge Function.
3. Verified methods are stored in Supabase `payment_methods`.
4. On EAC purchase, call backend (Edge Function) to:
    - Create a Stripe PaymentIntent/Checkout Session using the chosen payment method.
    - Pass metadata: user, entity_id, payment_method_id, etc.
5. Upon payment success, record the transaction in Supabase for audit/compliance.

### 4. Database Requirements

**Table: `payment_methods`**
- Stores verified cards and ACH bank accounts per entity; one is marked primary.
- Example schema:

```sql
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_id UUID,
  plaid_account_id TEXT,
  bank_name TEXT,
  last4 TEXT,
  is_primary BOOLEAN DEFAULT false,
  type TEXT,    -- 'card' or 'ach'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
-- Add RLS policies as needed
```

### 5. Frontend Integration

- **Settings UI:**  
  - `/settings > Transaction Payments`  
  - Users manage payment methods with the UI in `src/components/settings/admin/TransactionPayments.tsx`.
- **At transaction:**  
  - The primary or selected payment method is loaded and used via PaymentIntent on the backend.
- **Success:**  
  - User is returned to a confirmation screen and transaction is logged.

### 6. Testing

- Test both credit card and ACH payment flows (Plaid required for ACH).
- Simulate payment failures for correct UI and backend error handling.

---

## Developer References

- Edge functions for Stripe/Plaid:  
  - `supabase/functions/plaid-link/index.ts`
  - (Create your `create-transaction-payment` function for Stripe transaction payments.)
- React UI:  
  - `src/components/settings/admin/TransactionPayments.tsx`
- Database:  
  - Supabase table: `payment_methods`

---

## Notes

- Always use `mode: "payment"` for one-off purchases (not subscriptions).
- Store and refer to your own `payment_methods` table rather than relying on Stripe customer objects for selection.
- Keep business logic clear between billing/subscriptions and transaction payments.

