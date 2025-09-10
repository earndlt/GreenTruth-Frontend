
# MongoDB Integration

This guide details how to integrate GreenTruth with your existing MongoDB infrastructure for temporal data storage, analytics, and event tracking.

---

## Overview

GreenTruth uses MongoDB as a complementary database to the primary Supabase PostgreSQL storage. MongoDB is particularly well-suited for:

1. **High-velocity event data**: Transaction events, user activity logs
2. **Time-series analytics**: Market data, performance metrics
3. **Flexible schema data**: Vendor profiles, compliance documents
4. **Operational data**: Session information, cached data

---

## Architecture

GreenTruth integrates with MongoDB using the following approach:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GreenTruth     │     │  Edge Functions │     │  MongoDB        │
│  Frontend       │────▶│  Serverless API │────▶│  Atlas/Self-    │
│                 │     │                 │     │  Hosted         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │                        │
                                │                        │
                                ▼                        ▼
                         ┌─────────────────┐     ┌─────────────────┐
                         │  Event          │     │  Analytics      │
                         │  Processing     │     │  Dashboard      │
                         └─────────────────┘     └─────────────────┘
```

---

## MongoDB Requirements

For optimal performance, we recommend:

| Environment | Instance Size           | Configuration                          |
|-------------|-------------------------|----------------------------------------|
| Development | M10 (MongoDB Atlas)     | Single region, no sharding             |
| Production  | M30+ (MongoDB Atlas)    | Multi-region, sharded for large datasets |
| Self-hosted | 4 vCPU, 16GB RAM, SSD   | Replica set with 3+ nodes              |

---

## Connection Configuration

### 1. Environment Setup

Store your MongoDB connection string in Supabase Edge Function secrets:

```bash
supabase secrets set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greentruth
```

### 2. Connection Implementation

GreenTruth uses connection pooling for efficient MongoDB access:

```typescript
// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

// Connection pool
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('MongoDB URI not configured');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 5,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the connection pool
  // is maintained across hot reloads
  let globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, create a new connection pool
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

For Edge Functions, use a more lightweight approach:

```typescript
// Edge function MongoDB client
import { MongoClient } from 'https://deno.land/x/mongo@v0.31.2/mod.ts';

export async function getMongoClient() {
  const uri = Deno.env.get('MONGODB_URI');
  if (!uri) throw new Error('MongoDB URI not configured');
  
  const client = new MongoClient();
  await client.connect(uri);
  return client;
}
```

---

## Database Schema Design

GreenTruth organizes MongoDB data into collections with the following structure:

### 1. Transaction Events Collection

```javascript
{
  _id: ObjectId,                  // MongoDB-generated ID
  transactionId: UUID,            // Reference to Supabase transaction
  eventType: String,              // e.g., "initiated", "approved", "completed"
  timestamp: ISODate,             // When the event occurred
  data: {                         // Event-specific data
    amount: Number,
    tokenId: String,
    fromWallet: String,
    toWallet: String,
    price: Number,
    currency: String
  },
  metadata: {                     // Additional context
    ipAddress: String,
    userAgent: String,
    location: String
  },
  userId: UUID,                   // Who triggered the event
  entityId: UUID,                 // Associated corporate entity
  status: String,                 // e.g., "success", "failed", "pending"
  isProcessed: Boolean,           // Flag for processing status
  version: Number                 // Schema version for migrations
}
```

### 2. Analytics Events Collection

```javascript
{
  _id: ObjectId,                  // MongoDB-generated ID
  eventName: String,              // e.g., "page_view", "button_click"
  userId: UUID,                   // Who triggered the event
  sessionId: String,              // Browser session ID
  timestamp: ISODate,             // When the event occurred
  properties: {                   // Event properties
    page: String,
    component: String,
    action: String,
    value: Mixed,
    duration: Number
  },
  context: {                      // Environmental context
    userAgent: String,
    ipAddress: String,
    locale: String,
    timezone: String,
    referrer: String
  },
  tags: [String],                 // Categorization tags
  isProcessed: Boolean,           // Whether it's been analyzed
  segmentId: String               // User segment for analysis
}
```

### 3. Market Data Collection

```javascript
{
  _id: ObjectId,                  // MongoDB-generated ID
  instrumentId: String,           // Asset identifier
  marketId: String,               // Market identifier
  timestamp: ISODate,             // Time of the price point
  price: Number,                  // Asset price
  volume: Number,                 // Trading volume
  high: Number,                   // Session high
  low: Number,                    // Session low
  open: Number,                   // Opening price
  close: Number,                  // Closing price
  source: String,                 // Data source
  isAdjusted: Boolean,            // Flag for adjusted data
  metadata: Object                // Additional market data
}
```

### 4. User Sessions Collection

```javascript
{
  _id: ObjectId,                  // MongoDB-generated ID
  sessionId: String,              // Session identifier
  userId: UUID,                   // Associated user
  startedAt: ISODate,             // Session start time
  lastActiveAt: ISODate,          // Last activity time
  expiresAt: ISODate,             // Session expiration
  userAgent: String,              // Browser/device info
  ipAddress: String,              // Client IP address
  location: {                     // Approximate location
    country: String,
    region: String,
    city: String
  },
  deviceInfo: {                   // Device details
    type: String,                 // desktop, mobile, tablet
    os: String,
    browser: String
  },
  isActive: Boolean,              // Current session status
  pageViews: Number,              // Count of pages viewed
  actions: [                      // User actions during session
    {
      type: String,
      timestamp: ISODate,
      page: String,
      data: Object
    }
  ]
}
```

---

## Indexing Strategy

Proper indexing is crucial for MongoDB performance:

```javascript
// Transaction Events Indexes
db.transaction_events.createIndex({ transactionId: 1 });
db.transaction_events.createIndex({ userId: 1 });
db.transaction_events.createIndex({ entityId: 1 });
db.transaction_events.createIndex({ timestamp: -1 });
db.transaction_events.createIndex({ eventType: 1, timestamp: -1 });

// Analytics Events Indexes
db.analytics_events.createIndex({ userId: 1 });
db.analytics_events.createIndex({ sessionId: 1 });
db.analytics_events.createIndex({ timestamp: -1 });
db.analytics_events.createIndex({ eventName: 1, timestamp: -1 });
db.analytics_events.createIndex({ 
  userId: 1, 
  eventName: 1, 
  timestamp: -1 
});

// Market Data Indexes
db.market_data.createIndex({ instrumentId: 1, timestamp: -1 });
db.market_data.createIndex({ marketId: 1, timestamp: -1 });
db.market_data.createIndex({ timestamp: -1 });
db.market_data.createIndex({ 
  instrumentId: 1, 
  marketId: 1, 
  timestamp: -1 
});

// User Sessions Indexes
db.user_sessions.createIndex({ sessionId: 1 }, { unique: true });
db.user_sessions.createIndex({ userId: 1 });
db.user_sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
db.user_sessions.createIndex({ lastActiveAt: -1 });
```

---

## Data Access Patterns

GreenTruth implements several data access patterns for MongoDB:

### 1. Transaction Event Recording

```typescript
import { getMongoClient } from '../lib/mongodb';

export async function recordTransactionEvent(eventData) {
  const client = await getMongoClient();
  const db = client.database('greentruth');
  const collection = db.collection('transaction_events');
  
  const event = {
    transactionId: eventData.transactionId,
    eventType: eventData.eventType,
    timestamp: new Date(),
    data: eventData.data || {},
    metadata: eventData.metadata || {},
    userId: eventData.userId,
    entityId: eventData.entityId,
    status: eventData.status || 'success',
    isProcessed: false,
    version: 1
  };
  
  const result = await collection.insertOne(event);
  return { id: result.insertedId, event };
}
```

### 2. Analytics Aggregation

```typescript
export async function getTransactionVolumeByDay(entityId, startDate, endDate) {
  const client = await getMongoClient();
  const db = client.database('greentruth');
  const collection = db.collection('transaction_events');
  
  const pipeline = [
    { 
      $match: { 
        entityId,
        eventType: 'completed',
        timestamp: { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate) 
        }
      } 
    },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        },
        volume: { $sum: '$data.amount' },
        count: { $sum: 1 },
        avgPrice: { $avg: '$data.price' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day'
          }
        },
        volume: 1,
        count: 1,
        avgPrice: 1
      }
    }
  ];
  
  return await collection.aggregate(pipeline).toArray();
}
```

### 3. User Activity Tracking

```typescript
export async function trackUserActivity(userId, sessionId, eventName, properties) {
  const client = await getMongoClient();
  const db = client.database('greentruth');
  const collection = db.collection('analytics_events');
  
  // Get user agent and IP info
  const context = {
    userAgent: request.headers.get('user-agent'),
    ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    referrer: request.headers.get('referer') || '',
    timezone: properties.timezone || 'UTC',
    locale: properties.locale || 'en-US'
  };
  
  const event = {
    eventName,
    userId,
    sessionId,
    timestamp: new Date(),
    properties: properties || {},
    context,
    tags: properties.tags || [],
    isProcessed: false
  };
  
  await collection.insertOne(event);
  
  // Update the session's last active time
  const sessions = db.collection('user_sessions');
  await sessions.updateOne(
    { sessionId },
    { 
      $set: { lastActiveAt: new Date() },
      $inc: { pageViews: eventName === 'page_view' ? 1 : 0 },
      $push: { 
        actions: {
          type: eventName,
          timestamp: new Date(),
          page: properties.page || '',
          data: properties
        }
      }
    }
  );
  
  return { success: true };
}
```

### 4. Market Data Queries

```typescript
export async function getMarketTrends(instrumentId, days = 30) {
  const client = await getMongoClient();
  const db = client.database('greentruth');
  const collection = db.collection('market_data');
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const pipeline = [
    {
      $match: {
        instrumentId,
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $sort: { timestamp: 1 }
    },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        },
        open: { $first: '$open' },
        close: { $last: '$close' },
        high: { $max: '$high' },
        low: { $min: '$low' },
        volume: { $sum: '$volume' },
        date: { $first: '$timestamp' }
      }
    },
    { $sort: { date: 1 } },
    {
      $project: {
        _id: 0,
        date: 1,
        open: 1,
        close: 1,
        high: 1,
        low: 1,
        volume: 1,
        change: { $subtract: ['$close', '$open'] },
        changePercent: { 
          $multiply: [
            { $divide: [
              { $subtract: ['$close', '$open'] },
              '$open'
            ]},
            100
          ]
        }
      }
    }
  ];
  
  return await collection.aggregate(pipeline).toArray();
}
```

---

## Data Synchronization with Supabase

GreenTruth maintains consistency between MongoDB and Supabase:

### 1. Transaction Event Sync

```typescript
// Edge function to sync transaction data
export async function syncTransactionEvents() {
  // Get MongoDB client
  const mongoClient = await getMongoClient();
  const db = mongoClient.database('greentruth');
  const events = db.collection('transaction_events');
  
  // Get Supabase client with service role
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  );
  
  // Find unprocessed events
  const unprocessedEvents = await events.find({
    isProcessed: false,
    eventType: { $in: ['completed', 'failed'] }
  }).limit(100).toArray();
  
  for (const event of unprocessedEvents) {
    // Update transaction status in Supabase
    const { error } = await supabase
      .from('transactions')
      .update({
        status: event.eventType === 'completed' ? 'success' : 'failed',
        updated_at: new Date().toISOString()
      })
      .match({ id: event.transactionId });
    
    if (!error) {
      // Mark as processed in MongoDB
      await events.updateOne(
        { _id: event._id },
        { $set: { isProcessed: true } }
      );
    }
  }
  
  return { processed: unprocessedEvents.length };
}
```

### 2. Scheduled Jobs

Set up a CRON job to periodically sync data:

```typescript
// Supabase Edge Function CRON handler
Deno.cron("Sync MongoDB to Supabase", "*/15 * * * *", async () => {
  try {
    await syncTransactionEvents();
    await syncMarketData();
    await processAnalytics();
  } catch (error) {
    console.error("Sync error:", error);
  }
});
```

---

## Analytics Implementation

GreenTruth uses MongoDB for advanced analytics:

### 1. User Activity Dashboard

```typescript
export async function getUserActivityMetrics(period = '7d') {
  const client = await getMongoClient();
  const db = client.database('greentruth');
  const collection = db.collection('analytics_events');
  
  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  
  if (period === '24h') {
    startDate.setDate(startDate.getDate() - 1);
  } else if (period === '7d') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === '30d') {
    startDate.setDate(startDate.getDate() - 30);
  } else if (period === '90d') {
    startDate.setDate(startDate.getDate() - 90);
  }
  
  // Activity by page
  const pageViewsAgg = [
    {
      $match: {
        eventName: 'page_view',
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$properties.page',
        count: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        _id: 0,
        page: '$_id',
        views: '$count',
        uniqueUsers: { $size: '$uniqueUsers' }
      }
    },
    { $sort: { views: -1 } }
  ];
  
  // Active users over time
  const usersOverTimeAgg = [
    {
      $match: {
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        },
        uniqueUsers: { $addToSet: '$userId' },
        totalEvents: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day'
          }
        },
        activeUsers: { $size: '$uniqueUsers' },
        totalEvents: 1
      }
    },
    { $sort: { date: 1 } }
  ];
  
  const [pageViews, usersOverTime] = await Promise.all([
    collection.aggregate(pageViewsAgg).toArray(),
    collection.aggregate(usersOverTimeAgg).toArray()
  ]);
  
  return {
    pageViews,
    usersOverTime,
    period
  };
}
```

### 2. Transaction Performance Analysis

```typescript
export async function getTransactionPerformanceMetrics(entityId, period = '30d') {
  const client = await getMongoClient();
  const db = client.database('greentruth');
  const collection = db.collection('transaction_events');
  
  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  
  if (period === '7d') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === '30d') {
    startDate.setDate(startDate.getDate() - 30);
  } else if (period === '90d') {
    startDate.setDate(startDate.getDate() - 90);
  } else if (period === '1y') {
    startDate.setDate(startDate.getDate() - 365);
  }
  
  // Transaction volume
  const volumeAgg = [
    {
      $match: {
        entityId,
        eventType: 'completed',
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        },
        volume: { $sum: '$data.amount' },
        value: { $sum: { $multiply: ['$data.amount', '$data.price'] } },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day'
          }
        },
        volume: 1,
        value: 1,
        count: 1
      }
    },
    { $sort: { date: 1 } }
  ];
  
  // Token type distribution
  const tokenTypeAgg = [
    {
      $match: {
        entityId,
        eventType: 'completed',
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$data.tokenType',
        volume: { $sum: '$data.amount' },
        value: { $sum: { $multiply: ['$data.amount', '$data.price'] } },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        tokenType: '$_id',
        volume: 1,
        value: 1,
        count: 1,
        avgPrice: { $divide: ['$value', '$volume'] }
      }
    },
    { $sort: { volume: -1 } }
  ];
  
  const [volumeData, tokenTypeData] = await Promise.all([
    collection.aggregate(volumeAgg).toArray(),
    collection.aggregate(tokenTypeAgg).toArray()
  ]);
  
  return {
    volumeOverTime: volumeData,
    tokenTypeDistribution: tokenTypeData,
    period
  };
}
```

---

## Backup and Recovery

Implement a robust backup strategy for MongoDB:

### 1. Scheduled Backups

```bash
#!/bin/bash
# MongoDB backup script

# Configuration
MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/"
BACKUP_DIR="/path/to/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_PATH="$BACKUP_DIR/mongodb-backup-$TIMESTAMP"
S3_BUCKET="greentruth-backups-prod"

# Create backup directory
mkdir -p $BACKUP_PATH

# Run mongodump
mongodump --uri="$MONGO_URI" --out="$BACKUP_PATH"

# Compress the backup
tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "mongodb-backup-$TIMESTAMP"

# Upload to S3
aws s3 cp "$BACKUP_PATH.tar.gz" "s3://$S3_BUCKET/mongodb-backups/mongodb-backup-$TIMESTAMP.tar.gz"

# Clean up local files
rm -rf "$BACKUP_PATH" "$BACKUP_PATH.tar.gz"

# Remove backups older than 30 days
find "$BACKUP_DIR" -name "mongodb-backup-*.tar.gz" -type f -mtime +30 -delete
```

### 2. Point-in-Time Recovery

For detailed recovery procedures, see [Disaster Recovery Plan](./disaster-recovery.md).

---

## Performance Monitoring

Monitor MongoDB performance using:

1. **MongoDB Atlas Monitoring** (if using Atlas)
2. **Custom Metrics**:

```typescript
import { MongoClient } from 'mongodb';

export async function getDatabaseStats() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('greentruth');
  
  try {
    // Get database stats
    const dbStats = await db.stats();
    
    // Get collection stats
    const collections = ['transaction_events', 'analytics_events', 'market_data', 'user_sessions'];
    const collectionStats = {};
    
    for (const collection of collections) {
      collectionStats[collection] = await db.collection(collection).stats();
    }
    
    // Get index usage stats
    const indexStats = {};
    for (const collection of collections) {
      const indexes = await db.collection(collection).indexes();
      indexStats[collection] = indexes;
    }
    
    return {
      dbStats,
      collectionStats,
      indexStats,
      timestamp: new Date().toISOString()
    };
  } finally {
    await client.close();
  }
}
```

---

## Security Best Practices

1. **Network Security**:
   - Use TLS connections to MongoDB
   - Configure Network Access Lists to restrict access
   - Use VPC Peering when possible

2. **Authentication**:
   - Use X.509 certificates or SCRAM-SHA-256
   - Create dedicated users with specific roles
   - Rotate credentials regularly

3. **Authorization**:
   - Implement role-based access control
   - Apply principle of least privilege
   - Create separate roles for read/write operations

4. **Field-Level Encryption**:
   - For sensitive data like PII
   - Client-side encryption for specific fields
   - Document-level redaction

Sample MongoDB user setup:

```javascript
db.createUser({
  user: "greentruth_app",
  pwd: "complex-password-here",
  roles: [
    { role: "readWrite", db: "greentruth" }
  ],
  authenticationRestrictions: [
    { clientSource: ["10.0.0.0/24", "192.168.1.0/24"] }
  ]
})
```

---

## Troubleshooting

Common issues and their solutions:

1. **Connection Issues**:
   - Check network ACLs and firewall rules
   - Verify connection strings and credentials
   - Test with MongoDB Compass

2. **Performance Problems**:
   - Review index usage with explain() plans
   - Check for missing indexes
   - Optimize query patterns

3. **Scaling Bottlenecks**:
   - Consider sharding for large datasets
   - Implement read replicas for analytics
   - Use change streams for real-time processing

---

## Migration Path

When migrating existing data to MongoDB:

```javascript
// Migration script example
const { MongoClient } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function migrateTransactions() {
  // Connect to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Connect to MongoDB
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('greentruth');
  const collection = db.collection('transaction_events');
  
  // Get transactions from Supabase
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching transactions:', error);
    return;
  }
  
  console.log(`Migrating ${transactions.length} transactions...`);
  
  // Transform and insert
  const events = transactions.map(tx => ({
    transactionId: tx.id,
    eventType: tx.status === 'success' ? 'completed' : 
               tx.status === 'failed' ? 'failed' : 'initiated',
    timestamp: new Date(tx.created_at),
    data: {
      amount: tx.amount,
      tokenId: tx.token_id,
      fromWallet: tx.from_wallet,
      toWallet: tx.to_wallet,
      price: tx.price,
      currency: tx.currency
    },
    userId: tx.user_id,
    entityId: tx.entity_id,
    status: tx.status,
    isProcessed: true,
    version: 1
  }));
  
  if (events.length > 0) {
    const result = await collection.insertMany(events);
    console.log(`Inserted ${result.insertedCount} events`);
  }
  
  await client.close();
}

migrateTransactions()
  .then(() => console.log('Migration complete'))
  .catch(err => console.error('Migration failed:', err));
```
