
# EarnDLT Integration Guide

This document provides a comprehensive guide for integrating GreenTruth with the EarnDLT protocol for blockchain-based EAC (Environmental Attribute Certificate) management.

---

## Overview

EarnDLT is a specialized blockchain protocol designed for environmental attribute certificate (EAC) tracking, trading, and retirement. GreenTruth integrates deeply with EarnDLT to provide a seamless user experience for EAC transactions while maintaining compliance and audit capabilities.

---

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  GreenTruth     │      │  Edge Functions │      │  EarnDLT        │
│  Frontend       │─────▶│  Serverless API │─────▶│  Blockchain     │
│                 │      │                 │      │  Network        │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                         │                        │
        │                         │                        │
        ▼                         ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  User/Entity    │      │  Transaction    │      │  Wallet         │
│  Management     │      │  Processing     │      │  Management     │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                 │
                                 │
                                 ▼
                         ┌─────────────────┐
                         │  Payment        │
                         │  Processing     │
                         │  (Stripe/Plaid) │
                         └─────────────────┘
```

---

## Authentication

GreenTruth uses a delegated authentication model with EarnDLT:

1. **User Authentication**: Users authenticate with GreenTruth using Supabase Auth
2. **API Key**: GreenTruth communicates with EarnDLT using a server-side API key 
3. **Wallet Authentication**: Corporate entities have their wallets managed by GreenTruth

### Server-Side Authentication

Store your EarnDLT API key in Supabase secrets:

```bash
supabase secrets set EARNDLT_API_KEY=your_earndlt_api_key_here
supabase secrets set EARNDLT_API_URL=https://api.earndlt.com/v1
```

### Edge Function Authentication

```typescript
// supabase/functions/_shared/earnDLTClient.ts
export class EarnDLTClient {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.apiKey = Deno.env.get('EARNDLT_API_KEY') || '';
    this.baseUrl = Deno.env.get('EARNDLT_API_URL') || 'https://api.earndlt.com/v1';
    
    if (!this.apiKey) {
      throw new Error('EarnDLT API key not configured');
    }
  }
  
  async request(endpoint: string, method = 'GET', data?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'X-API-Version': '2023-10-01'
    };
    
    const options: RequestInit = {
      method,
      headers
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EarnDLT API error (${response.status}): ${errorText}`);
    }
    
    return response.json();
  }
  
  // Specific API methods
  async getWalletBalance(walletId: string) {
    return this.request(`/wallets/${walletId}/balance`);
  }
  
  async createTransaction(transactionData: any) {
    return this.request('/transactions', 'POST', transactionData);
  }
  
  async getTransactionStatus(transactionId: string) {
    return this.request(`/transactions/${transactionId}`);
  }
  
  // Additional methods as needed
}
```

---

## Wallet Management

GreenTruth manages multi-signature wallets for corporate entities through EarnDLT.

### Entity Wallet Structure

Each corporate entity has a primary wallet and may have additional division-specific wallets:

```
Corporate Entity
├── Primary Wallet (Multi-sig)
│   ├── EAC Holdings
│   └── Transaction History
└── Division Wallets
    ├── Division A Wallet
    │   ├── EAC Holdings
    │   └── Transaction History
    └── Division B Wallet
        ├── EAC Holdings
        └── Transaction History
```

### Wallet Creation

```typescript
// src/lib/walletManagement.ts
import { EarnDLTClient } from './earnDLTClient';

export async function createCorporateWallet(entity, administrators) {
  const earnDLT = new EarnDLTClient();
  
  // Create multi-sig wallet configuration
  const walletConfig = {
    name: `${entity.name} Primary Wallet`,
    type: 'multi_sig',
    entity_id: entity.id,
    signers: administrators.map(admin => ({
      name: admin.name,
      email: admin.email,
      role: admin.role
    })),
    threshold: Math.ceil(administrators.length / 2), // Majority required to sign
    metadata: {
      entity_name: entity.name,
      entity_id: entity.id,
      created_at: new Date().toISOString()
    }
  };
  
  // Create wallet in EarnDLT
  const response = await earnDLT.request('/wallets', 'POST', walletConfig);
  
  return {
    id: response.wallet_id,
    address: response.wallet_address,
    entityId: entity.id,
    name: walletConfig.name,
    type: 'primary',
    signers: response.signers,
    threshold: response.threshold,
    createdAt: response.created_at
  };
}
```

### Wallet Balance Retrieval

```typescript
// supabase/functions/get-wallet-balance/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { EarnDLTClient } from '../_shared/earnDLTClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request
    const { walletId } = await req.json();
    
    if (!walletId) {
      return new Response(
        JSON.stringify({ error: 'Wallet ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Initialize EarnDLT client
    const earnDLT = new EarnDLTClient();
    
    // Get wallet balance
    const balance = await earnDLT.getWalletBalance(walletId);
    
    return new Response(
      JSON.stringify({
        walletId,
        balance: balance.eac_balance,
        tokens: balance.tokens,
        lastUpdated: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

---

## Transaction Management

GreenTruth supports several transaction types through EarnDLT.

### Transaction Types

1. **Purchase**: Acquiring new EACs from the marketplace
2. **Transfer**: Moving EACs between wallets (internal or external)
3. **Retirement**: Permanently retiring EACs for compliance or voluntary purposes
4. **Forward Contract**: Future-dated EAC procurement agreements

### Purchase Transaction Flow

```typescript
// supabase/functions/create-eac-purchase/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.19.0';
import { EarnDLTClient } from '../_shared/earnDLTClient.ts';
import { createStripePaymentIntent } from '../_shared/stripeClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize clients
    const earnDLT = new EarnDLTClient();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    // Parse request
    const {
      eacId,
      quantity,
      price,
      walletId,
      entityId,
      userId,
      paymentMethodId,
      metadata = {}
    } = await req.json();
    
    // Validate inputs
    if (!eacId || !quantity || !price || !walletId || !entityId || !userId || !paymentMethodId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get user information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get payment method
    const { data: paymentMethod, error: paymentError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', paymentMethodId)
      .single();
    
    if (paymentError || !paymentMethod) {
      return new Response(
        JSON.stringify({ error: 'Invalid payment method' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Calculate total amount
    const totalAmount = quantity * price;
    
    // Create EarnDLT transaction (pending payment)
    const eacTransaction = await earnDLT.createTransaction({
      type: 'purchase',
      eac_id: eacId,
      quantity,
      price_per_unit: price,
      total_amount: totalAmount,
      wallet_id: walletId,
      status: 'pending_payment',
      metadata: {
        entity_id: entityId,
        user_id: userId,
        ...metadata
      }
    });
    
    // Create payment intent with Stripe
    const paymentIntent = await createStripePaymentIntent({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethod.stripe_payment_method_id,
      description: `EAC Purchase: ${quantity} units of ${eacId}`,
      metadata: {
        eac_transaction_id: eacTransaction.id,
        wallet_id: walletId,
        entity_id: entityId,
        user_id: userId
      }
    });
    
    // Record transaction in Supabase
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        external_id: eacTransaction.id,
        type: 'purchase',
        status: 'pending_payment',
        amount: quantity,
        price: price,
        total: totalAmount,
        eac_id: eacId,
        wallet_id: walletId,
        entity_id: entityId,
        user_id: userId,
        payment_intent_id: paymentIntent.id,
        payment_method_id: paymentMethodId,
        metadata: {
          stripe_payment_intent: paymentIntent.id,
          earnDLT_transaction: eacTransaction.id,
          ...metadata
        }
      })
      .select()
      .single();
    
    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Continue anyway as the EarnDLT transaction is created
    }
    
    return new Response(
      JSON.stringify({
        transaction_id: transaction?.id || eacTransaction.id,
        earnDLT_transaction_id: eacTransaction.id,
        payment_intent_id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: 'pending_payment',
        next_steps: 'Confirm payment using the client_secret'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating EAC purchase:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

### Retirement Transaction Flow

```typescript
// supabase/functions/retire-eac/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.19.0';
import { EarnDLTClient } from '../_shared/earnDLTClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize clients
    const earnDLT = new EarnDLTClient();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    // Parse request
    const {
      eacId,
      quantity,
      walletId,
      entityId,
      userId,
      retirementReason,
      retirementBeneficiary,
      metadata = {}
    } = await req.json();
    
    // Validate inputs
    if (!eacId || !quantity || !walletId || !entityId || !userId || !retirementReason) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Check if user has permission to retire tokens
    const { data: user, error: userError } = await supabase
      .auth.getUser(req.headers.get('Authorization')?.split(' ')[1] || '');
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Check if wallet has sufficient tokens
    const walletBalance = await earnDLT.getWalletBalance(walletId);
    const eacBalance = walletBalance.tokens.find(t => t.id === eacId)?.amount || 0;
    
    if (eacBalance < quantity) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient tokens in wallet',
          available: eacBalance,
          requested: quantity
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Create retirement transaction in EarnDLT
    const retirementTransaction = await earnDLT.createTransaction({
      type: 'retirement',
      eac_id: eacId,
      quantity,
      wallet_id: walletId,
      retirement_reason: retirementReason,
      beneficiary: retirementBeneficiary || entityId,
      metadata: {
        entity_id: entityId,
        user_id: userId,
        retirement_reason: retirementReason,
        beneficiary: retirementBeneficiary,
        ...metadata
      }
    });
    
    // Create retirement certificate
    const certificate = await earnDLT.request(
      `/retirements/${retirementTransaction.id}/certificate`,
      'POST',
      {
        format: 'pdf',
        notify: true,
        recipient_email: user.user.email
      }
    );
    
    // Record transaction in Supabase
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        external_id: retirementTransaction.id,
        type: 'retirement',
        status: 'completed',
        amount: quantity,
        eac_id: eacId,
        wallet_id: walletId,
        entity_id: entityId,
        user_id: userId,
        metadata: {
          retirement_reason: retirementReason,
          beneficiary: retirementBeneficiary,
          certificate_id: certificate.id,
          ...metadata
        }
      })
      .select()
      .single();
    
    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
    }
    
    // Record certificate in Supabase
    const { data: certRecord, error: certError } = await supabase
      .from('retirement_certificates')
      .insert({
        transaction_id: transaction?.id,
        external_transaction_id: retirementTransaction.id,
        certificate_id: certificate.id,
        certificate_url: certificate.url,
        amount: quantity,
        eac_id: eacId,
        entity_id: entityId,
        user_id: userId,
        retirement_reason: retirementReason,
        beneficiary: retirementBeneficiary
      });
    
    if (certError) {
      console.error('Error recording certificate:', certError);
    }
    
    return new Response(
      JSON.stringify({
        transaction_id: transaction?.id || retirementTransaction.id,
        earnDLT_transaction_id: retirementTransaction.id,
        certificate_id: certificate.id,
        certificate_url: certificate.url,
        status: 'completed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error retiring EACs:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

### Transaction Monitoring

```typescript
// supabase/functions/get-transaction-status/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.19.0';
import { EarnDLTClient } from '../_shared/earnDLTClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize clients
    const earnDLT = new EarnDLTClient();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    // Parse request
    const { transactionId } = await req.json();
    
    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get transaction from Supabase
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
    
    if (transactionError || !transaction) {
      return new Response(
        JSON.stringify({ error: 'Transaction not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Get external transaction from EarnDLT
    const earnDLTTransaction = await earnDLT.getTransactionStatus(transaction.external_id);
    
    // Update transaction status if changed
    if (earnDLTTransaction.status !== transaction.status) {
      await supabase
        .from('transactions')
        .update({
          status: earnDLTTransaction.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);
    }
    
    return new Response(
      JSON.stringify({
        id: transaction.id,
        external_id: transaction.external_id,
        type: transaction.type,
        status: earnDLTTransaction.status,
        amount: transaction.amount,
        eac_id: transaction.eac_id,
        wallet_id: transaction.wallet_id,
        entity_id: transaction.entity_id,
        created_at: transaction.created_at,
        updated_at: new Date().toISOString(),
        earnDLT_details: {
          status: earnDLTTransaction.status,
          blockchain_tx: earnDLTTransaction.blockchain_tx,
          confirmations: earnDLTTransaction.confirmations,
          updated_at: earnDLTTransaction.updated_at
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting transaction status:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

---

## Token Management

GreenTruth interfaces with EarnDLT for token (EAC) discovery, validation, and management.

### Token Types

EarnDLT supports multiple EAC types, including:

1. **RNG (Renewable Natural Gas)**: Biomethane credits
2. **REC (Renewable Energy Certificates)**: For renewable electricity
3. **Carbon Credits**: Various carbon offset standards
4. **LCFS (Low Carbon Fuel Standard)**: California and other jurisdictions
5. **Custom/Project-specific EACs**: Based on specific methodologies

### Token Discovery

```typescript
// supabase/functions/discover-available-eacs/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { EarnDLTClient } from '../_shared/earnDLTClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize EarnDLT client
    const earnDLT = new EarnDLTClient();
    
    // Parse request
    const {
      type,
      region,
      vintage,
      standard,
      limit = 20,
      offset = 0,
      sort = 'price_asc'
    } = await req.json();
    
    // Build filter query
    const filters = {};
    if (type) filters.type = type;
    if (region) filters.region = region;
    if (vintage) filters.vintage = vintage;
    if (standard) filters.standard = standard;
    
    // Query available EACs
    const availableEACs = await earnDLT.request('/marketplace/eacs', 'GET', {
      filters,
      limit,
      offset,
      sort
    });
    
    return new Response(
      JSON.stringify({
        eacs: availableEACs.items,
        total: availableEACs.total,
        limit,
        offset,
        has_more: availableEACs.has_more
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error discovering EACs:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

### Token Validation

```typescript
// supabase/functions/validate-eac/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { EarnDLTClient } from '../_shared/earnDLTClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize EarnDLT client
    const earnDLT = new EarnDLTClient();
    
    // Parse request
    const { eacId, certificateId } = await req.json();
    
    if (!eacId && !certificateId) {
      return new Response(
        JSON.stringify({ error: 'Either EAC ID or Certificate ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    let validationResult;
    
    if (eacId) {
      // Validate EAC by ID
      validationResult = await earnDLT.request(`/eacs/${eacId}/validate`, 'GET');
    } else {
      // Validate retirement certificate
      validationResult = await earnDLT.request(`/certificates/${certificateId}/validate`, 'GET');
    }
    
    return new Response(
      JSON.stringify({
        valid: validationResult.valid,
        details: validationResult.details,
        blockchain_proof: validationResult.blockchain_proof
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error validating EAC:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

---

## Reporting and Analytics

GreenTruth provides extensive reporting capabilities for EAC activities.

### Transaction History

```typescript
// supabase/functions/get-transaction-history/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.19.0';
import { EarnDLTClient } from '../_shared/earnDLTClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize clients
    const earnDLT = new EarnDLTClient();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    // Parse request
    const {
      walletId,
      entityId,
      startDate,
      endDate,
      type,
      status,
      limit = 20,
      offset = 0
    } = await req.json();
    
    // Build query
    let query = supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .offset(offset);
    
    if (walletId) {
      query = query.eq('wallet_id', walletId);
    }
    
    if (entityId) {
      query = query.eq('entity_id', entityId);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    // Execute query
    const { data: transactions, error, count } = await query.select('*', { count: 'exact' });
    
    if (error) {
      throw error;
    }
    
    // Enrich with latest status from EarnDLT
    const enrichedTransactions = await Promise.all(
      transactions.map(async (tx) => {
        try {
          const earnDLTTx = await earnDLT.getTransactionStatus(tx.external_id);
          
          // Update status if changed
          if (earnDLTTx.status !== tx.status) {
            await supabase
              .from('transactions')
              .update({
                status: earnDLTTx.status,
                updated_at: new Date().toISOString()
              })
              .eq('id', tx.id);
              
            tx.status = earnDLTTx.status;
          }
          
          return {
            ...tx,
            earnDLT_details: {
              status: earnDLTTx.status,
              blockchain_tx: earnDLTTx.blockchain_tx,
              confirmations: earnDLTTx.confirmations,
              updated_at: earnDLTTx.updated_at
            }
          };
        } catch (txError) {
          console.error(`Error enriching transaction ${tx.id}:`, txError);
          return tx;
        }
      })
    );
    
    return new Response(
      JSON.stringify({
        transactions: enrichedTransactions,
        total: count,
        limit,
        offset,
        has_more: count > (offset + limit)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting transaction history:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

### EAC Holdings Report

```typescript
// supabase/functions/generate-holdings-report/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { EarnDLTClient } from '../_shared/earnDLTClient.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.19.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize clients
    const earnDLT = new EarnDLTClient();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    // Parse request
    const {
      entityId,
      format = 'json',
      includeDetails = true
    } = await req.json();
    
    if (!entityId) {
      return new Response(
        JSON.stringify({ error: 'Entity ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get entity's wallets
    const { data: wallets, error: walletsError } = await supabase
      .from('wallets')
      .select('*')
      .eq('entity_id', entityId);
    
    if (walletsError) {
      throw walletsError;
    }
    
    // Get balances for all wallets
    const walletsWithBalances = await Promise.all(
      wallets.map(async (wallet) => {
        const balance = await earnDLT.getWalletBalance(wallet.external_id);
        
        return {
          id: wallet.id,
          external_id: wallet.external_id,
          name: wallet.name,
          type: wallet.type,
          tokens: balance.tokens,
          total_eacs: balance.eac_balance,
          last_updated: new Date().toISOString()
        };
      })
    );
    
    // Calculate totals by token type
    const tokenTotals = {};
    
    walletsWithBalances.forEach(wallet => {
      wallet.tokens.forEach(token => {
        if (!tokenTotals[token.id]) {
          tokenTotals[token.id] = {
            id: token.id,
            name: token.name,
            type: token.type,
            standard: token.standard,
            vintage: token.vintage,
            total_amount: 0,
            wallets: []
          };
        }
        
        tokenTotals[token.id].total_amount += token.amount;
        tokenTotals[token.id].wallets.push({
          id: wallet.id,
          name: wallet.name,
          amount: token.amount
        });
      });
    });
    
    // Generate report
    const report = {
      entity_id: entityId,
      generated_at: new Date().toISOString(),
      wallets: walletsWithBalances,
      token_totals: Object.values(tokenTotals),
      total_wallets: wallets.length,
      total_token_types: Object.keys(tokenTotals).length,
      total_eac_balance: walletsWithBalances.reduce((sum, w) => sum + w.total_eacs, 0)
    };
    
    // Generate additional details if requested
    if (includeDetails) {
      // Get entity details
      const { data: entity, error: entityError } = await supabase
        .from('entities')
        .select('*')
        .eq('id', entityId)
        .single();
        
      if (!entityError && entity) {
        report.entity = entity;
      }
      
      // Get token details
      report.token_details = await Promise.all(
        Object.keys(tokenTotals).map(async (tokenId) => {
          try {
            const tokenDetails = await earnDLT.request(`/eacs/${tokenId}`);
            return tokenDetails;
          } catch (tokenError) {
            console.error(`Error getting details for token ${tokenId}:`, tokenError);
            return { id: tokenId, error: 'Details unavailable' };
          }
        })
      );
    }
    
    // Return report in requested format
    if (format === 'csv') {
      // Generate CSV (implementation omitted for brevity)
      const csv = 'CSV implementation omitted';
      
      return new Response(
        csv,
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="eac-holdings-${entityId}-${new Date().toISOString().split('T')[0]}.csv"`
          } 
        }
      );
    } else {
      // Return JSON
      return new Response(
        JSON.stringify(report),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error generating holdings report:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

---

## Compliance Integration

GreenTruth's EarnDLT integration includes compliance verification capabilities.

### Compliance Verification

```typescript
// supabase/functions/verify-compliance/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { EarnDLTClient } from '../_shared/earnDLTClient.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.19.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Initialize clients
    const earnDLT = new EarnDLTClient();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    // Parse request
    const {
      entityId,
      complianceProgram,
      reportingPeriod
    } = await req.json();
    
    if (!entityId || !complianceProgram || !reportingPeriod) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get entity's retirement transactions in the reporting period
    const { data: retirements, error: retirementError } = await supabase
      .from('transactions')
      .select('*')
      .eq('entity_id', entityId)
      .eq('type', 'retirement')
      .gte('created_at', reportingPeriod.start)
      .lte('created_at', reportingPeriod.end);
    
    if (retirementError) {
      throw retirementError;
    }
    
    // Get certificates for these retirements
    const { data: certificates, error: certificatesError } = await supabase
      .from('retirement_certificates')
      .select('*')
      .in('transaction_id', retirements.map(r => r.id));
    
    if (certificatesError) {
      throw certificatesError;
    }
    
    // Verify compliance through EarnDLT
    const verificationResult = await earnDLT.request('/compliance/verify', 'POST', {
      entity_id: entityId,
      program: complianceProgram,
      period: {
        start: reportingPeriod.start,
        end: reportingPeriod.end
      },
      certificates: certificates.map(c => ({
        id: c.certificate_id,
        transaction_id: c.external_transaction_id
      }))
    });
    
    // Generate compliance report
    const report = {
      entity_id: entityId,
      program: complianceProgram,
      reporting_period: reportingPeriod,
      verified_at: new Date().toISOString(),
      status: verificationResult.status,
      compliance_percentage: verificationResult.compliance_percentage,
      total_retired: verificationResult.total_retired,
      requirement: verificationResult.requirement,
      deficit: verificationResult.deficit,
      certificates: verificationResult.certificates,
      blockchain_verification: verificationResult.blockchain_verification
    };
    
    // Record compliance report in Supabase
    await supabase
      .from('compliance_reports')
      .insert({
        entity_id: entityId,
        program: complianceProgram,
        period_start: reportingPeriod.start,
        period_end: reportingPeriod.end,
        status: verificationResult.status,
        compliance_percentage: verificationResult.compliance_percentage,
        total_retired: verificationResult.total_retired,
        requirement: verificationResult.requirement,
        deficit: verificationResult.deficit,
        report_data: report
      });
    
    return new Response(
      JSON.stringify(report),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error verifying compliance:',  error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

---

## Frontend Integration

### Wallet UI Component

```tsx
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Card, Button, Spinner } from '@/components/ui';

export function WalletBalanceComponent({ walletId }) {
  const { supabase } = useSupabase();
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wallet balance
  const fetchBalance = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-wallet-balance', {
        body: { walletId }
      });
      
      if (error) throw error;
      
      setBalance(data);
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
      setError(err.message || 'Failed to load wallet balance');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (walletId) {
      fetchBalance();
    }
  }, [walletId]);

  if (isLoading) {
    return (
      <Card className="wallet-balance-card">
        <div className="text-center py-6">
          <Spinner size="lg" />
          <p className="mt-2">Loading wallet balance...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="wallet-balance-card error">
        <div className="text-center py-6">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={fetchBalance} className="mt-4">Retry</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="wallet-balance-card">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Wallet Balance</h3>
          <Button size="sm" variant="outline" onClick={fetchBalance}>
            Refresh
          </Button>
        </div>
        
        <div className="wallet-balance-total mb-6">
          <p className="text-sm text-muted-foreground">Total EACs</p>
          <p className="text-3xl font-bold">{balance?.balance.toLocaleString()}</p>
        </div>
        
        <div className="wallet-tokens">
          <h4 className="text-sm font-medium mb-2">Token Breakdown</h4>
          {balance?.tokens.length > 0 ? (
            <div className="space-y-3">
              {balance.tokens.map(token => (
                <div key={token.id} className="token-item flex justify-between items-center p-3 bg-muted rounded-md">
                  <div>
                    <p className="font-medium">{token.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {token.type} • {token.vintage} • {token.standard}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{token.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Units</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No tokens in this wallet</p>
          )}
        </div>
        
        <div className="mt-4 text-xs text-right text-muted-foreground">
          Last updated: {new Date(balance?.lastUpdated).toLocaleString()}
        </div>
      </div>
    </Card>
  );
}
```

### Transaction Form Component

```tsx
import React, { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useUser } from '@/hooks/useUser';
import { 
  Button, 
  Input, 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem,
  Form,
  FormField,
  FormLabel,
  FormMessage,
  Card
} from '@/components/ui';

export function PurchaseEACForm({ eacId, eacName, walletId, onSuccess }) {
  const { supabase } = useSupabase();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  // Load payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('is_active', true)
          .order('is_primary', { ascending: false });
        
        if (error) throw error;
        
        setPaymentMethods(data);
        
        // Set default payment method (primary)
        const primaryMethod = data.find(m => m.is_primary);
        if (primaryMethod) {
          setSelectedPaymentMethod(primaryMethod.id);
        } else if (data.length > 0) {
          setSelectedPaymentMethod(data[0].id);
        }
      } catch (err) {
        console.error('Error loading payment methods:', err);
        setError('Failed to load payment methods');
      }
    };
    
    fetchPaymentMethods();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }
    
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get EAC details for price
      const { data: eacData, error: eacError } = await supabase.functions.invoke('get-eac-details', {
        body: { eacId }
      });
      
      if (eacError) throw eacError;
      
      // Create purchase transaction
      const { data, error } = await supabase.functions.invoke('create-eac-purchase', {
        body: {
          eacId,
          quantity,
          price: eacData.price,
          walletId,
          entityId: user.entity_id,
          userId: user.id,
          paymentMethodId: selectedPaymentMethod,
          metadata: {
            eac_name: eacName,
            user_name: user.name,
            user_email: user.email
          }
        }
      });
      
      if (error) throw error;
      
      // Handle Stripe payment confirmation using the client_secret
      const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);
      
      const { error: stripeError } = await stripe.confirmCardPayment(data.client_secret);
      
      if (stripeError) {
        throw new Error(`Payment failed: ${stripeError.message}`);
      }
      
      // Payment successful, notify parent component
      if (onSuccess) {
        onSuccess(data.transaction_id);
      }
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="purchase-form p-6">
      <h3 className="text-lg font-medium mb-4">Purchase EAC</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField>
            <FormLabel>EAC Type</FormLabel>
            <Input value={eacName} disabled />
          </FormField>
          
          <FormField>
            <FormLabel>Quantity</FormLabel>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              required
            />
            <FormMessage>Enter the number of EACs to purchase</FormMessage>
          </FormField>
          
          <FormField>
            <FormLabel>Payment Method</FormLabel>
            <Select
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.type === 'card' ? (
                      `Credit Card ending in ${method.last4}`
                    ) : (
                      `${method.bank_name} account ending in ${method.last4}`
                    )}
                    {method.is_primary && ' (Primary)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage>Select your payment method</FormMessage>
          </FormField>
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Processing...' : 'Purchase EAC'}
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
}
```

### Transaction Status Component

```tsx
import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Card, Badge, Button, Spinner } from '@/components/ui';

export function TransactionStatusComponent({ transactionId }) {
  const { supabase } = useSupabase();
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch transaction status
  const fetchTransactionStatus = async () => {
    if (!transactionId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-transaction-status', {
        body: { transactionId }
      });
      
      if (error) throw error;
      
      setTransaction(data);
    } catch (err) {
      console.error('Error fetching transaction status:', err);
      setError(err.message || 'Failed to load transaction status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
      case 'pending_payment':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Automatic refresh for pending transactions
  useEffect(() => {
    if (transactionId) {
      fetchTransactionStatus();
      
      // Set up polling for non-final states
      const isPending = transaction && 
        ['pending', 'pending_payment', 'processing'].includes(transaction.status);
      
      if (isPending) {
        const intervalId = setInterval(fetchTransactionStatus, 5000);
        return () => clearInterval(intervalId);
      }
    }
  }, [transactionId, transaction?.status]);
  
  if (isLoading) {
    return (
      <Card className="transaction-status-card">
        <div className="text-center py-6">
          <Spinner size="lg" />
          <p className="mt-2">Loading transaction status...</p>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="transaction-status-card error">
        <div className="text-center py-6">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={fetchTransactionStatus} className="mt-4">Retry</Button>
        </div>
      </Card>
    );
  }
  
  if (!transaction) {
    return (
      <Card className="transaction-status-card">
        <div className="text-center py-6">
          <p>No transaction data available</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="transaction-status-card p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">Transaction Status</h3>
          <p className="text-sm text-muted-foreground">ID: {transaction.id}</p>
        </div>
        <Badge className={getStatusColor(transaction.status)}>
          {transaction.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Type</p>
          <p className="font-medium">{transaction.type.toUpperCase()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="font-medium">{transaction.amount.toLocaleString()} units</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">EAC ID</p>
          <p className="font-medium truncate">{transaction.eac_id}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Wallet</p>
          <p className="font-medium truncate">{transaction.wallet_id}</p>
        </div>
      </div>
      
      {transaction.earnDLT_details?.blockchain_tx && (
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm font-medium text-blue-800">Blockchain Transaction</p>
          <p className="text-xs text-blue-700 truncate">{transaction.earnDLT_details.blockchain_tx}</p>
          <p className="text-xs text-blue-600 mt-1">
            Confirmations: {transaction.earnDLT_details.confirmations || 0}
          </p>
        </div>
      )}
      
      <div className="mt-4 text-right">
        <Button size="sm" variant="outline" onClick={fetchTransactionStatus}>
          Refresh Status
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-right text-muted-foreground">
        Last updated: {new Date(transaction.updated_at).toLocaleString()}
      </div>
    </Card>
  );
}
```

---

## Troubleshooting

### Common Issues and Solutions

1. **Authentication Failures**
   - Verify the EarnDLT API key is correctly set in Supabase secrets
   - Check that the API key has not expired or been revoked
   - Ensure the Edge Function has the correct permissions

2. **Transaction Failures**
   - Insufficient balance in wallet for retirements/transfers
   - Payment method declined for purchases
   - Invalid EAC ID or parameters
   - Network connectivity issues

3. **Certificate Validation Issues**
   - Incorrect certificate ID format
   - Certificate may have been revoked or invalidated
   - Blockchain node synchronization issues

### Debugging Tools

1. **Transaction Status Endpoint**
   Use the `get-transaction-status` endpoint to check the detailed status of any transaction.

2. **EarnDLT Dashboard**
   For administrative users, the EarnDLT dashboard provides detailed insights into transactions, blockchain status, and account management.

3. **Logging and Monitoring**
   Implement comprehensive logging in Edge Functions to track API calls, responses, and errors.

---

## Security Considerations

1. **API Key Management**
   - Store the EarnDLT API key securely in Supabase secrets
   - Rotate the API key periodically
   - Use the principle of least privilege for API access

2. **Transaction Signing**
   - Implement proper authorization checks before initiating transactions
   - Enforce multi-signature requirements for high-value transactions
   - Validate transaction parameters server-side

3. **User Authentication**
   - Verify user identities before allowing wallet access
   - Enforce 2FA for high-privilege operations
   - Implement proper session management and token validation

---

## Best Practices

1. **Wallet Management**
   - Create separate wallets for different divisions or purposes
   - Implement proper key backup and recovery processes
   - Regularly audit wallet access and permissions

2. **Transaction Processing**
   - Validate inputs server-side before submitting to EarnDLT
   - Implement idempotent transaction creation to avoid duplicates
   - Handle transaction failures gracefully with user-friendly error messages

3. **Data Synchronization**
   - Maintain local records of transactions for quick access
   - Periodically reconcile local data with EarnDLT blockchain state
   - Implement proper error handling for temporary network issues
