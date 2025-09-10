
# API Reference

This document provides a comprehensive reference for the GreenTruth API, detailing all available endpoints, parameters, and response formats.

---

## Authentication

All API requests require authentication using a JWT token.

### Obtaining a Token

```
POST /auth/token
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

### Using the Token

Include the token in all API requests in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Supabase Edge Functions

GreenTruth exposes serverless APIs through Supabase Edge Functions. These functions can be invoked using the Supabase client.

### Invoking an Edge Function

```javascript
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { /* request parameters */ }
});
```

---

## Transaction Management API

### Create EAC Purchase

Creates a new purchase transaction for Environmental Attribute Certificates.

```
POST /functions/v1/create-eac-purchase
```

**Request Body:**

```json
{
  "eacId": "eac_12345",
  "quantity": 100,
  "price": 5.75,
  "walletId": "wallet_67890",
  "entityId": "entity_12345",
  "userId": "user_12345",
  "paymentMethodId": "pm_12345",
  "metadata": {
    "custom_field": "value"
  }
}
```

**Response:**

```json
{
  "transaction_id": "tx_12345",
  "earnDLT_transaction_id": "earnDLT_tx_12345",
  "payment_intent_id": "pi_12345",
  "client_secret": "pi_12345_secret_67890",
  "status": "pending_payment",
  "next_steps": "Confirm payment using the client_secret"
}
```

### Get Transaction Status

Retrieves the current status of a transaction.

```
POST /functions/v1/get-transaction-status
```

**Request Body:**

```json
{
  "transactionId": "tx_12345"
}
```

**Response:**

```json
{
  "id": "tx_12345",
  "external_id": "earnDLT_tx_12345",
  "type": "purchase",
  "status": "completed",
  "amount": 100,
  "eac_id": "eac_12345",
  "wallet_id": "wallet_67890",
  "entity_id": "entity_12345",
  "created_at": "2023-06-01T12:00:00Z",
  "updated_at": "2023-06-01T12:05:00Z",
  "earnDLT_details": {
    "status": "completed",
    "blockchain_tx": "0x1234567890abcdef1234567890abcdef",
    "confirmations": 12,
    "updated_at": "2023-06-01T12:05:00Z"
  }
}
```

### Get Transaction History

Retrieves transaction history for a wallet or entity.

```
POST /functions/v1/get-transaction-history
```

**Request Body:**

```json
{
  "walletId": "wallet_67890",
  "entityId": "entity_12345",
  "startDate": "2023-01-01T00:00:00Z",
  "endDate": "2023-06-30T23:59:59Z",
  "type": "purchase",
  "status": "completed",
  "limit": 20,
  "offset": 0
}
```

**Response:**

```json
{
  "transactions": [
    {
      "id": "tx_12345",
      "external_id": "earnDLT_tx_12345",
      "type": "purchase",
      "status": "completed",
      "amount": 100,
      "eac_id": "eac_12345",
      "wallet_id": "wallet_67890",
      "entity_id": "entity_12345",
      "created_at": "2023-06-01T12:00:00Z",
      "updated_at": "2023-06-01T12:05:00Z",
      "earnDLT_details": {
        "status": "completed",
        "blockchain_tx": "0x1234567890abcdef1234567890abcdef",
        "confirmations": 12,
        "updated_at": "2023-06-01T12:05:00Z"
      }
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0,
  "has_more": true
}
```

### Retire EAC

Creates a retirement transaction for Environmental Attribute Certificates.

```
POST /functions/v1/retire-eac
```

**Request Body:**

```json
{
  "eacId": "eac_12345",
  "quantity": 50,
  "walletId": "wallet_67890",
  "entityId": "entity_12345",
  "userId": "user_12345",
  "retirementReason": "voluntary_carbon_offset",
  "retirementBeneficiary": "Company XYZ",
  "metadata": {
    "project_id": "project_12345"
  }
}
```

**Response:**

```json
{
  "transaction_id": "tx_67890",
  "earnDLT_transaction_id": "earnDLT_tx_67890",
  "certificate_id": "cert_12345",
  "certificate_url": "https://earndlt.com/certificates/cert_12345",
  "status": "completed"
}
```

---

## Wallet Management API

### Get Wallet Balance

Retrieves the current balance of a wallet.

```
POST /functions/v1/get-wallet-balance
```

**Request Body:**

```json
{
  "walletId": "wallet_67890"
}
```

**Response:**

```json
{
  "walletId": "wallet_67890",
  "balance": 1250,
  "tokens": [
    {
      "id": "eac_12345",
      "name": "Renewable Natural Gas Credit",
      "type": "RNG",
      "standard": "M-RETS",
      "vintage": "2023",
      "amount": 750
    },
    {
      "id": "eac_67890",
      "name": "Carbon Offset Credit",
      "type": "CARBON",
      "standard": "Gold Standard",
      "vintage": "2022",
      "amount": 500
    }
  ],
  "lastUpdated": "2023-06-15T09:30:00Z"
}
```

### Create Corporate Wallet

Creates a new multi-signature wallet for a corporate entity.

```
POST /functions/v1/create-corporate-wallet
```

**Request Body:**

```json
{
  "entityId": "entity_12345",
  "name": "Company XYZ Primary Wallet",
  "administrators": [
    {
      "id": "user_12345",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    {
      "id": "user_67890",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "treasury"
    }
  ]
}
```

**Response:**

```json
{
  "id": "wallet_12345",
  "external_id": "earnDLT_wallet_12345",
  "entity_id": "entity_12345",
  "name": "Company XYZ Primary Wallet",
  "address": "0x1234567890abcdef1234567890abcdef",
  "type": "primary",
  "signers": [
    {
      "id": "user_12345",
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": "user_67890",
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ],
  "threshold": 2,
  "created_at": "2023-06-01T12:00:00Z"
}
```

---

## EAC Marketplace API

### Discover Available EACs

Retrieves a list of available Environmental Attribute Certificates from the marketplace.

```
POST /functions/v1/discover-available-eacs
```

**Request Body:**

```json
{
  "type": "RNG",
  "region": "North America",
  "vintage": "2023",
  "standard": "M-RETS",
  "limit": 20,
  "offset": 0,
  "sort": "price_asc"
}
```

**Response:**

```json
{
  "eacs": [
    {
      "id": "eac_12345",
      "name": "RNG Credit - Project Alpha",
      "type": "RNG",
      "standard": "M-RETS",
      "vintage": "2023",
      "region": "North America",
      "available_amount": 10000,
      "price": 5.75,
      "seller": {
        "id": "seller_12345",
        "name": "Green Energy Producer LLC"
      },
      "project": {
        "id": "project_12345",
        "name": "Project Alpha",
        "description": "Landfill gas capture project"
      }
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0,
  "has_more": true
}
```

### Get EAC Details

Retrieves detailed information about a specific Environmental Attribute Certificate.

```
POST /functions/v1/get-eac-details
```

**Request Body:**

```json
{
  "eacId": "eac_12345"
}
```

**Response:**

```json
{
  "id": "eac_12345",
  "name": "RNG Credit - Project Alpha",
  "type": "RNG",
  "standard": "M-RETS",
  "vintage": "2023",
  "region": "North America",
  "available_amount": 10000,
  "price": 5.75,
  "seller": {
    "id": "seller_12345",
    "name": "Green Energy Producer LLC"
  },
  "project": {
    "id": "project_12345",
    "name": "Project Alpha",
    "description": "Landfill gas capture project",
    "location": {
      "country": "United States",
      "state": "California",
      "coordinates": {
        "latitude": 37.7749,
        "longitude": -122.4194
      }
    },
    "methodology": "ACM0001",
    "certification_date": "2023-01-15T00:00:00Z",
    "verification_body": "Verification Co. Ltd."
  },
  "attributes": {
    "gas_source": "landfill",
    "carbon_intensity": 15.2,
    "additionality": true,
    "environmental_co_benefits": ["biodiversity", "water quality"]
  },
  "documents": [
    {
      "id": "doc_12345",
      "name": "Project Verification Report",
      "type": "verification_report",
      "url": "https://earndlt.com/documents/doc_12345"
    }
  ]
}
```

### Validate EAC

Validates the authenticity of an Environmental Attribute Certificate or retirement certificate.

```
POST /functions/v1/validate-eac
```

**Request Body:**

```json
{
  "eacId": "eac_12345"
}
```

**Response:**

```json
{
  "valid": true,
  "details": {
    "id": "eac_12345",
    "name": "RNG Credit - Project Alpha",
    "type": "RNG",
    "standard": "M-RETS",
    "vintage": "2023",
    "issuer": "M-RETS Registry",
    "issued_at": "2023-01-15T00:00:00Z",
    "status": "active"
  },
  "blockchain_proof": {
    "transaction": "0x1234567890abcdef1234567890abcdef",
    "block": 12345678,
    "timestamp": "2023-01-15T00:05:00Z",
    "verification_url": "https://etherscan.io/tx/0x1234567890abcdef1234567890abcdef"
  }
}
```

---

## Compliance API

### Verify Compliance

Verifies compliance with a specific regulatory program based on retired EACs.

```
POST /functions/v1/verify-compliance
```

**Request Body:**

```json
{
  "entityId": "entity_12345",
  "complianceProgram": "california_lcfs",
  "reportingPeriod": {
    "start": "2023-01-01T00:00:00Z",
    "end": "2023-06-30T23:59:59Z"
  }
}
```

**Response:**

```json
{
  "entity_id": "entity_12345",
  "program": "california_lcfs",
  "reporting_period": {
    "start": "2023-01-01T00:00:00Z",
    "end": "2023-06-30T23:59:59Z"
  },
  "verified_at": "2023-07-01T10:15:00Z",
  "status": "compliant",
  "compliance_percentage": 115.5,
  "total_retired": 10000,
  "requirement": 8658,
  "deficit": 0,
  "certificates": [
    {
      "id": "cert_12345",
      "transaction_id": "tx_12345",
      "amount": 5000,
      "eac_id": "eac_12345",
      "retirement_date": "2023-03-15T14:30:00Z"
    },
    {
      "id": "cert_67890",
      "transaction_id": "tx_67890",
      "amount": 5000,
      "eac_id": "eac_67890",
      "retirement_date": "2023-06-01T09:45:00Z"
    }
  ],
  "blockchain_verification": {
    "hash": "0x1234567890abcdef1234567890abcdef",
    "timestamp": "2023-07-01T10:15:00Z",
    "verified_by": "EarnDLT Compliance Verifier"
  }
}
```

### Generate Compliance Report

Generates a detailed compliance report for a specific entity and program.

```
POST /functions/v1/generate-compliance-report
```

**Request Body:**

```json
{
  "entityId": "entity_12345",
  "complianceProgram": "california_lcfs",
  "reportingPeriod": {
    "start": "2023-01-01T00:00:00Z",
    "end": "2023-06-30T23:59:59Z"
  },
  "format": "pdf"
}
```

**Response:**

```json
{
  "report_id": "report_12345",
  "entity_id": "entity_12345",
  "program": "california_lcfs",
  "reporting_period": {
    "start": "2023-01-01T00:00:00Z",
    "end": "2023-06-30T23:59:59Z"
  },
  "generated_at": "2023-07-01T10:20:00Z",
  "status": "compliant",
  "report_url": "https://greentruth.com/reports/report_12345.pdf",
  "expiry": "2023-08-01T10:20:00Z"
}
```

---

## Analytics API

### Generate Holdings Report

Generates a report of EAC holdings for a specific entity.

```
POST /functions/v1/generate-holdings-report
```

**Request Body:**

```json
{
  "entityId": "entity_12345",
  "format": "json",
  "includeDetails": true
}
```

**Response:**

```json
{
  "entity_id": "entity_12345",
  "generated_at": "2023-07-01T10:25:00Z",
  "wallets": [
    {
      "id": "wallet_12345",
      "external_id": "earnDLT_wallet_12345",
      "name": "Company XYZ Primary Wallet",
      "type": "primary",
      "tokens": [
        {
          "id": "eac_12345",
          "name": "RNG Credit",
          "type": "RNG",
          "standard": "M-RETS",
          "vintage": "2023",
          "amount": 5000
        }
      ],
      "total_eacs": 5000,
      "last_updated": "2023-07-01T10:00:00Z"
    }
  ],
  "token_totals": [
    {
      "id": "eac_12345",
      "name": "RNG Credit",
      "type": "RNG",
      "standard": "M-RETS",
      "vintage": "2023",
      "total_amount": 5000,
      "wallets": [
        {
          "id": "wallet_12345",
          "name": "Company XYZ Primary Wallet",
          "amount": 5000
        }
      ]
    }
  ],
  "total_wallets": 1,
  "total_token_types": 1,
  "total_eac_balance": 5000,
  "entity": {
    "id": "entity_12345",
    "name": "Company XYZ",
    "type": "corporation",
    "created_at": "2023-01-01T00:00:00Z"
  },
  "token_details": [
    {
      "id": "eac_12345",
      "name": "RNG Credit - Project Alpha",
      "type": "RNG",
      "standard": "M-RETS",
      "vintage": "2023",
      "region": "North America",
      "project": {
        "id": "project_12345",
        "name": "Project Alpha"
      }
    }
  ]
}
```

### Get Transaction Volume Metrics

Retrieves transaction volume metrics for a specific entity or wallet.

```
POST /functions/v1/get-transaction-volume-metrics
```

**Request Body:**

```json
{
  "entityId": "entity_12345",
  "period": "30d",
  "groupBy": "day"
}
```

**Response:**

```json
{
  "entity_id": "entity_12345",
  "period": "30d",
  "generated_at": "2023-07-01T10:30:00Z",
  "metrics": {
    "total_volume": 15000,
    "total_value": 86250,
    "average_price": 5.75,
    "transaction_count": 10
  },
  "time_series": [
    {
      "date": "2023-06-01T00:00:00Z",
      "volume": 5000,
      "value": 28750,
      "count": 4
    },
    {
      "date": "2023-06-15T00:00:00Z",
      "volume": 10000,
      "value": 57500,
      "count": 6
    }
  ],
  "by_token_type": [
    {
      "type": "RNG",
      "volume": 12000,
      "value": 69000,
      "count": 8
    },
    {
      "type": "CARBON",
      "volume": 3000,
      "value": 17250,
      "count": 2
    }
  ]
}
```

---

## Payment Management API

### Create Checkout Session

Creates a Stripe checkout session for subscription or one-time payment.

```
POST /functions/v1/create-checkout
```

**Request Body:**

```json
{
  "priceId": "price_12345",
  "successUrl": "https://greentruth.com/success",
  "cancelUrl": "https://greentruth.com/cancel",
  "metadata": {
    "custom_field": "value"
  }
}
```

**Response:**

```json
{
  "sessionId": "cs_12345",
  "url": "https://checkout.stripe.com/pay/cs_12345"
}
```

### Check Subscription Status

Checks the current subscription status for a user.

```
POST /functions/v1/check-subscription
```

**Response:**

```json
{
  "subscribed": true,
  "subscription_tier": "premium",
  "subscription_end": "2024-01-01T00:00:00Z",
  "features": ["sod", "compliance_reporter", "advanced_analytics"]
}
```

### Create Customer Portal Session

Creates a Stripe customer portal session for managing subscriptions.

```
POST /functions/v1/customer-portal
```

**Response:**

```json
{
  "url": "https://billing.stripe.com/p/session/cs_12345"
}
```

### Create Payment Intent

Creates a Stripe payment intent for a transaction.

```
POST /functions/v1/create-payment-intent
```

**Request Body:**

```json
{
  "amount": 10000,
  "currency": "usd",
  "payment_method_id": "pm_12345",
  "description": "EAC Purchase: 100 units of eac_12345",
  "metadata": {
    "transaction_id": "tx_12345"
  }
}
```

**Response:**

```json
{
  "client_secret": "pi_12345_secret_67890",
  "amount": 10000,
  "currency": "usd",
  "status": "requires_confirmation"
}
```

---

## Document Management API

### Vectorize Document

Processes and vectorizes a document for semantic search.

```
POST /functions/v1/vectorize-document
```

**Request Body:**

```json
{
  "document": {
    "id": "doc_12345",
    "text": "Long document text here...",
    "type": "compliance_report",
    "source": "California Air Resources Board",
    "entityId": "entity_12345",
    "userId": "user_12345"
  }
}
```

**Response:**

```json
{
  "success": true,
  "documentId": "doc_12345",
  "chunks": 12,
  "vectorized": true
}
```

### Semantic Search

Performs semantic search across vectorized documents.

```
POST /functions/v1/semantic-search
```

**Request Body:**

```json
{
  "query": "What are the requirements for California LCFS compliance?",
  "options": {
    "namespace": "documents",
    "limit": 5,
    "minScore": 0.7,
    "filters": {
      "entityId": "entity_12345",
      "documentType": "compliance_report"
    }
  }
}
```

**Response:**

```json
{
  "query": "What are the requirements for California LCFS compliance?",
  "results": [
    {
      "id": "doc_12345-chunk-3",
      "score": 0.92,
      "documentId": "doc_12345",
      "documentType": "compliance_report",
      "preview": "The California Low Carbon Fuel Standard (LCFS) requires a 20% reduction in carbon intensity by 2030...",
      "source": "California Air Resources Board",
      "timestamp": "2023-06-01T12:00:00Z"
    }
  ],
  "total": 1,
  "timestamp": "2023-07-01T10:35:00Z"
}
```

---

## Error Handling

All API endpoints follow a consistent error format:

```json
{
  "error": "Description of the error",
  "code": "ERROR_CODE",
  "details": {
    "field": "problematic_field",
    "message": "Specific issue with this field"
  }
}
```

Common error codes include:

- `AUTHENTICATION_ERROR`: Invalid or expired authentication token
- `PERMISSION_DENIED`: User lacks permission for the requested operation
- `RESOURCE_NOT_FOUND`: The requested resource does not exist
- `VALIDATION_ERROR`: Request validation failed
- `INTERNAL_ERROR`: An internal server error occurred
- `PAYMENT_ERROR`: Payment processing failed
- `TRANSACTION_ERROR`: Transaction processing failed
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded

---

## Pagination

Endpoints that return collections support pagination using `limit` and `offset` parameters:

- `limit`: Maximum number of items to return (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

Pagination metadata is included in the response:

```json
{
  "items": [...],
  "total": 45,
  "limit": 20,
  "offset": 0,
  "has_more": true
}
```

---

## Rate Limiting

API requests are subject to rate limiting:

- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated requests

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625149424
```

---

## Webhooks

GreenTruth can send webhook notifications for various events. Configure webhooks in the developer settings.

### Webhook Events

- `transaction.created`: New transaction created
- `transaction.updated`: Transaction status updated
- `transaction.completed`: Transaction completed
- `transaction.failed`: Transaction failed
- `certificate.issued`: New certificate issued
- `wallet.created`: New wallet created
- `document.vectorized`: Document vectorization completed

### Webhook Payload

```json
{
  "id": "evt_12345",
  "type": "transaction.completed",
  "created": "2023-07-01T12:00:00Z",
  "data": {
    "object": {
      "id": "tx_12345",
      "type": "purchase",
      "status": "completed",
      "amount": 100,
      "eac_id": "eac_12345",
      "wallet_id": "wallet_67890",
      "entity_id": "entity_12345"
    }
  }
}
```

### Webhook Security

Webhook requests include a signature header (`X-GreenTruth-Signature`) that should be verified using your webhook secret:

```
X-GreenTruth-Signature: t=1625149424,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
```
