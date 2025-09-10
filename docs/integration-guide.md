
# Integration Guide

This guide provides detailed instructions for integrating GreenTruth with your existing infrastructure components, including AWS, MongoDB, and Pinecone vector database.

---

## Overview

GreenTruth is designed with a modular architecture that enables multiple integration paths:

1. **API Integration**: Connect via REST APIs
2. **Database Integration**: Direct database connections
3. **Event-Driven Integration**: Webhook subscription
4. **Authentication Integration**: SSO/OIDC support
5. **Custom Edge Functions**: Extendable serverless functions

---

## Prerequisites

Before beginning integration, ensure you have:

- API credentials for all systems
- Network connectivity between environments
- Appropriate IAM/security permissions
- Development environment with Node.js 18+ and npm

---

## EarnDLT Integration

GreenTruth tightly integrates with the EarnDLT protocol for blockchain-based EAC (Environmental Attribute Certificate) tracking.

### Authentication

1. Obtain an API key from your EarnDLT account
2. Store this key in Supabase secrets:
   ```bash
   supabase secrets set EARNDLT_API_KEY=your_key_here
   ```

### Transaction Workflow

The EarnDLT integration follows this flow:

1. User initiates an EAC purchase/transfer in GreenTruth UI
2. GreenTruth validates the request via RBAC/SoD rules
3. Edge function creates a transaction record and calls EarnDLT API
4. EarnDLT processes the blockchain transaction
5. Confirmation webhook updates the transaction status

### Implementation Example

```typescript
// Edge function for EarnDLT transaction
import { createClient } from '@supabase/supabase-js';
import { EarnDLTClient } from './utils/earnDLTClient';

export async function handler(req, res) {
  const { txType, amount, walletId, sourceId } = req.body;
  
  // Initialize clients
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const earnDLT = new EarnDLTClient(env.EARNDLT_API_KEY);
  
  // Create transaction
  const txPayload = {
    type: txType,
    amount: amount,
    wallet: walletId,
    source: sourceId,
    timestamp: new Date().toISOString()
  };
  
  // Submit to EarnDLT
  const { txId, status } = await earnDLT.createTransaction(txPayload);
  
  // Record in database
  await supabase.from('transactions').insert({
    external_id: txId,
    status: status,
    data: txPayload
  });
  
  return { txId, status };
}
```

For detailed API reference, see [EarnDLT Integration](./earndlt-integration.md).

---

## AWS Integration

GreenTruth integrates with AWS services, primarily EC2 and S3.

### EC2 Setup

1. **VPC Configuration**:
   - Create a security group allowing traffic on ports 443/80
   - Configure network ACLs for additional security

2. **EC2 Instance Provisioning**:
   ```bash
   aws ec2 run-instances \
     --image-id ami-0c55b159cbfafe1f0 \
     --instance-type t2.micro \
     --key-name MyKeyPair \
     --security-group-ids sg-903004f8 \
     --subnet-id subnet-6e7f829e
   ```

3. **Load Balancer Configuration**:
   - Set up an Application Load Balancer
   - Configure health checks at `/api/health`
   - Set up SSL termination

### S3 Integration

GreenTruth uses S3 for document storage with the following components:

1. **Bucket Structure**:
   - `greentruth-documents-{env}`: Main document storage
   - `greentruth-exports-{env}`: Report exports
   - `greentruth-backups-{env}`: Database backups

2. **IAM Policy Example**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:ListBucket",
           "s3:DeleteObject"
         ],
         "Resource": [
           "arn:aws:s3:::greentruth-documents-*/*",
           "arn:aws:s3:::greentruth-documents-*"
         ]
       }
     ]
   }
   ```

3. **Implementation**:
   GreenTruth uses the AWS SDK to interact with S3:

   ```typescript
   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

   const s3Client = new S3Client({
     region: 'us-west-2',
     credentials: {
       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
     }
   });

   async function uploadDocument(fileBuffer, fileName, contentType) {
     const command = new PutObjectCommand({
       Bucket: 'greentruth-documents-prod',
       Key: fileName,
       Body: fileBuffer,
       ContentType: contentType,
       Metadata: {
         uploadDate: new Date().toISOString()
       }
     });
     return s3Client.send(command);
   }
   ```

For details on S3 lifecycle policies, encryption, and advanced features, see [AWS Integration](./aws-integration.md).

---

## MongoDB Integration

GreenTruth uses MongoDB for temporal data and analytics events.

### Connection Setup

1. **MongoDB Atlas Cluster** (recommended):
   - Create an M10+ cluster for production
   - Configure network access for GreenTruth servers
   - Create a dedicated database user with appropriate permissions

2. **Connection String**:
   Store your MongoDB connection string in Supabase secrets:
   ```bash
   supabase secrets set MONGODB_URI=mongodb+srv://user:password@cluster0.mongodb.net/greentruth
   ```

### Schema Design

GreenTruth uses the following collections in MongoDB:

1. **Transaction Events**:
   ```javascript
   {
     _id: ObjectId,
     transactionId: UUID,
     eventType: String,  // "created", "approved", "completed", "failed"
     timestamp: ISODate,
     data: Object,
     actor: UUID,
     metadata: Object
   }
   ```

2. **Analytics Events**:
   ```javascript
   {
     _id: ObjectId,
     userId: UUID,
     entityId: UUID,
     eventType: String,
     timestamp: ISODate,
     properties: Object,
     sessionId: UUID
   }
   ```

3. **Market Data**:
   ```javascript
   {
     _id: ObjectId,
     instrumentId: String,
     timestamp: ISODate,
     price: Number,
     volume: Number,
     marketId: String,
     metadata: Object
   }
   ```

### Implementation Example

```typescript
import { MongoClient } from 'mongodb';

const uri = Deno.env.get('MONGODB_URI');
const client = new MongoClient(uri);

export async function recordTransactionEvent(event) {
  try {
    await client.connect();
    const database = client.db('greentruth');
    const events = database.collection('transaction_events');
    
    const result = await events.insertOne({
      transactionId: event.txId,
      eventType: event.type,
      timestamp: new Date(),
      data: event.data,
      actor: event.userId,
      metadata: event.metadata
    });
    
    return result.insertedId;
  } finally {
    await client.close();
  }
}
```

For details on indexes, aggregation pipelines, and data lifecycle management, see [MongoDB Integration](./mongodb-integration.md).

---

## Pinecone Vector Database Integration

GreenTruth uses Pinecone for vector similarity search in several AI-powered features.

### Setup

1. **Pinecone Index Creation**:
   ```bash
   pinecone create-index greentruth-vectors --dimension 1536 --metric cosine
   ```

2. **API Credentials**:
   Store your Pinecone API key in Supabase secrets:
   ```bash
   supabase secrets set PINECONE_API_KEY=your_key_here
   supabase secrets set PINECONE_ENVIRONMENT=us-west1-gcp
   ```

### Embedding Generation

GreenTruth uses OpenAI embeddings for document vectorization:

```typescript
import { Configuration, OpenAIApi } from 'openai';
import { PineconeClient } from 'pinecone-client';

const openai = new OpenAIApi(
  new Configuration({ apiKey: Deno.env.get('OPENAI_API_KEY') })
);

const pinecone = new PineconeClient({
  apiKey: Deno.env.get('PINECONE_API_KEY'),
  environment: Deno.env.get('PINECONE_ENVIRONMENT')
});

async function indexDocument(document) {
  // Generate embedding
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: document.text
  });
  
  const embedding = response.data.data[0].embedding;
  
  // Store in Pinecone
  await pinecone.index('greentruth-vectors').upsert({
    vectors: [{
      id: document.id,
      values: embedding,
      metadata: {
        source: document.source,
        title: document.title,
        type: document.type,
        timestamp: new Date().toISOString()
      }
    }]
  });
}
```

### Query Implementation

Vector similarity search can be used for document discovery:

```typescript
async function findSimilarDocuments(query, topK = 5) {
  // Generate query embedding
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: query
  });
  
  const queryEmbedding = response.data.data[0].embedding;
  
  // Query Pinecone
  const results = await pinecone.index('greentruth-vectors').query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true
  });
  
  return results.matches;
}
```

For details on namespace organization, filtering, and hybrid search, see [Vector Database Integration](./vector-db-integration.md).

---

## Authentication Integration

GreenTruth supports multiple authentication methods:

1. **Native Authentication** (Supabase Auth)
2. **OAuth Providers** (Google, Microsoft, etc.)
3. **SAML/SSO** for enterprise deployments

For enterprise SSO setup, see [Authentication Guide](./authentication.md).

---

## Webhooks

GreenTruth can send and receive webhooks for event-driven architecture:

- **Outgoing Webhooks**: Transaction events, user activities
- **Incoming Webhooks**: EarnDLT callbacks, payment notifications

For webhook payload formats and security best practices, see [Webhook Integration](./webhooks.md).

---

## Testing Your Integration

A comprehensive test suite is available for validating integrations:

```bash
# Run integration tests
npm run test:integration

# Test specific components
npm run test:integration -- --grep="MongoDB"
```

---

## Troubleshooting

Common integration issues and their solutions:

1. **Authentication Failures**:
   - Verify API keys and secrets
   - Check network connectivity and firewall rules
   - Examine expiration dates on tokens

2. **Data Synchronization Issues**:
   - Inspect webhook delivery logs
   - Verify schema compatibility
   - Check for race conditions in transaction processing

For more troubleshooting guidance, see [FAQs](./faqs.md).
