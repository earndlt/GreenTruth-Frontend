
# Technical Architecture

## System Overview

GreenTruth is an enterprise-grade compliance, procurement, and analytics platform for EAC (Environmental Attribute Certificate) and energy/environmental product markets. The architecture follows a modern microservices pattern with strict separation of concerns.

---

## Architecture Diagram

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│   Frontend Layer  │     │   Service Layer   │     │   Storage Layer   │
│                   │     │                   │     │                   │
│   React + Vite    │────▶│   Edge Functions  │────▶│   Supabase DB     │
│   TypeScript      │     │   Serverless API  │     │   AWS S3          │
│   shadcn/ui       │◀────│   EarnDLT API     │◀────│   MongoDB         │
│   Tailwind CSS    │     │   Stripe/Plaid    │     │   Pinecone Vector │
└───────────────────┘     └───────────────────┘     └───────────────────┘
         ▲                         ▲                         ▲
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                          ┌────────┴─────────┐
                          │  Integration     │
                          │                  │
                          │  Authentication  │
                          │  RBAC/SoD        │
                          │  Webhooks        │
                          └──────────────────┘
```

---

## Key Components

### 1. Frontend Layer
- **Framework**: React 18.x with TypeScript and Vite
- **UI Library**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router v6
- **Charts & Visualization**: Recharts
- **Form Handling**: React Hook Form + Zod validation

### 2. Service Layer
- **Edge Functions**: Supabase Edge Functions (Deno runtime)
- **Authentication**: Supabase Auth (JWT-based)
- **APIs**: 
  - EarnDLT Protocol API (RESTful)
  - Stripe Payment Processing
  - Plaid Banking Integration
  - Custom serverless functions
  - Vector search endpoints

### 3. Storage Layer
- **Primary Database**: Supabase (PostgreSQL)
- **Document Storage**: AWS S3
- **Temporal Data**: MongoDB (for transaction history, analytics events)
- **Vector Store**: Pinecone (for similarity search, ML features)

### 4. Cross-Cutting Concerns
- **Authentication**: JWT-based with Supabase Auth
- **Authorization**: Custom RBAC with Segregation of Duties (SoD)
- **Logging**: Structured logging to CloudWatch
- **Monitoring**: Custom health checks + Sentry error monitoring
- **Caching**: In-memory + Redis for distributed caching

---

## Database Schema

The platform uses a multi-database approach:

### Supabase PostgreSQL
Primary tables include:
- `users` - User accounts and profiles
- `corporate_entities` - Client organizations and divisions
- `payment_methods` - Stored payment methods for transactions
- `transactions` - EAC transaction records
- `wallets` - Digital asset wallets
- `vendors` - Supplier/vendor information
- `procurement_rfps` - RFP management
- `compliance_reports` - Compliance data

### MongoDB Collections
Used for high-velocity data and temporal records:
- `transaction_events` - Detailed transaction lifecycle events
- `user_activity` - User interaction logs
- `analytics_events` - Time-series analytics data
- `market_data` - Historical pricing and market conditions

### Pinecone Vector Database
Stores embeddings for:
- Document similarity search
- Vendor matching algorithms
- Pattern detection in compliance data
- ML-powered recommendation engines

---

## API Layer

The platform exposes and consumes multiple APIs:

1. **Internal API**: RESTful endpoints for CRUD operations
2. **EarnDLT API**: Integration with the blockchain protocol
3. **Stripe API**: Payment processing
4. **Plaid API**: Banking connections
5. **S3 API**: Document storage and retrieval
6. **Vector Search API**: ML-powered similarity search

For detailed API specifications, see the [API Reference](./api-reference.md).

---

## Security Architecture

The platform implements defense-in-depth security:

1. **Authentication**: JWT-based with refresh tokens
2. **Authorization**: 
   - Role-Based Access Control (RBAC)
   - Segregation of Duties (SoD) for enterprise clients
   - Row-Level Security (RLS) in Supabase
3. **Data Protection**:
   - Encryption at rest (AWS KMS)
   - TLS for all connections
   - PII obfuscation where applicable
4. **Compliance**:
   - Audit logging of all sensitive operations
   - Immutable transaction records
   - Digital signatures for critical documents

---

## Performance Optimizations

- React Query for efficient data fetching and caching
- Dynamic code splitting and lazy loading
- Serverless architecture for auto-scaling
- Database read replicas for analytic workloads
- WebSocket connections for real-time updates

---

## Development Workflow

The platform follows a GitFlow workflow:
- `main` - Production code
- `develop` - Integration branch
- Feature branches for new development
- CI/CD pipelines for automated testing and deployment

For contribution guidelines, see [Contributing](./contributing.md).
