
# Vector Database Integration

This guide details how to integrate GreenTruth with Pinecone Vector Database for semantic search, document similarity, and AI-powered features.

---

## Overview

GreenTruth uses Pinecone as a vector database for:

1. **Semantic Document Search**: Find relevant documents based on meaning, not just keywords
2. **Vendor Matching**: Automatically match vendors to RFPs/RFIs based on similarity
3. **Regulatory Compliance Mapping**: Connect regulations to specific compliance requirements
4. **Pattern Detection**: Identify unusual market patterns or transaction behaviors

---

## Architecture

The vector database integration follows this architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Document       │     │  Embedding      │     │  Pinecone       │
│  Processing     │────▶│  Generation     │────▶│  Vector DB      │
│                 │     │  (OpenAI)       │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                                                │
        │                                                │
        │                                                ▼
┌─────────────────┐                            ┌─────────────────┐
│  Document       │                            │  Search &       │
│  Sources        │                            │  Retrieval      │
└─────────────────┘                            └─────────────────┘
```

---

## Prerequisites

Before setting up the vector database integration, ensure you have:

1. **Pinecone Account**: Create an account at [Pinecone.io](https://www.pinecone.io/)
2. **API Keys**:
   - Pinecone API Key
   - OpenAI API Key (for embedding generation)
3. **Environment Configuration**:
   - Pinecone environment (e.g., `us-west1-gcp`)
   - OpenAI model access (`text-embedding-ada-002` or newer)

---

## Pinecone Setup

### 1. Index Creation

Create a Pinecone index with the appropriate dimensions:

```bash
# Using Pinecone CLI
pinecone create-index greentruth-vectors \
  --dimension 1536 \
  --metric cosine \
  --pod-type p1.x1 \
  --environment us-west1-gcp
```

Or using the Pinecone Dashboard:
1. Navigate to Indexes tab
2. Click "Create Index"
3. Set name to `greentruth-vectors` 
4. Set dimension to `1536` (for OpenAI embeddings)
5. Set metric to `cosine`
6. Choose pod type `p1.x1` for production (or `starter` for testing)

### 2. Index Configuration

For optimal performance, set up namespaces for different data types:

- `documents`: For all compliance and regulatory documents
- `vendors`: For vendor profiles and capabilities
- `transactions`: For transaction patterns and anomaly detection
- `market-data`: For market trends and pattern recognition

---

## Edge Function Implementation

### 1. Create a Vectorization Service

```typescript
// src/lib/vectorization.ts
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone
const pinecone = new PineconeClient();
await pinecone.init({
  environment: process.env.PINECONE_ENVIRONMENT,
  apiKey: process.env.PINECONE_API_KEY,
});

// Chunk document into manageable pieces
function chunkDocument(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    // Calculate chunk boundaries with overlap
    const start = Math.max(0, i - overlap);
    const end = Math.min(text.length, i + chunkSize);
    chunks.push(text.slice(start, end));
    i += chunkSize - overlap;
  }
  return chunks;
}

// Generate embeddings for text
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
}

// Vectorize and store document
export async function vectorizeDocument(document) {
  try {
    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Get document text
    let documentText;
    if (document.text) {
      documentText = document.text;
    } else if (document.url) {
      // Implement document fetching and text extraction
      // This could use libraries like pdf-parse, docx-parser, etc.
      throw new Error('Document URL processing not implemented');
    } else {
      throw new Error('No document text or URL provided');
    }
    
    // Chunk the document
    const chunks = chunkDocument(documentText);
    
    // Generate embeddings for each chunk
    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);
      
      vectors.push({
        id: `${document.id}-chunk-${i}`,
        values: embedding,
        metadata: {
          documentId: document.id,
          documentType: document.type,
          chunkIndex: i,
          totalChunks: chunks.length,
          text: chunk.slice(0, 100) + '...',  // Preview
          source: document.source || 'unknown',
          timestamp: new Date().toISOString(),
          entityId: document.entityId,
          userId: document.userId
        }
      });
    }
    
    // Get Pinecone index
    const index = pinecone.Index('greentruth-vectors');
    
    // Store vectors in appropriate namespace
    await index.upsert({
      upsertRequest: {
        vectors,
        namespace: document.type || 'documents'
      }
    });
    
    // Update document status in Supabase
    await supabase
      .from('documents')
      .update({
        vectorized: true,
        vector_chunks: chunks.length,
        last_vectorized: new Date().toISOString()
      })
      .eq('id', document.id);
    
    return {
      success: true,
      documentId: document.id,
      chunks: chunks.length,
      vectorized: true
    };
  } catch (error) {
    console.error('Vectorization error:', error);
    return {
      success: false,
      error: error.message,
      documentId: document.id
    };
  }
}
```

### 2. Set Up a Vector Search Function

```typescript
// src/lib/vectorSearch.ts
import { OpenAI } from 'openai';
import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize OpenAI and Pinecone same as above

// Search documents with vector similarity
export async function searchDocuments(query, options = {}) {
  try {
    const {
      namespace = 'documents',
      limit = 5,
      minScore = 0.7,
      filters = {},
      includeText = true
    } = options;
    
    // Generate query embedding
    const embedding = await generateEmbedding(query);
    
    // Set up filter if provided
    const filterQuery = {};
    if (filters.entityId) {
      filterQuery.entityId = { $eq: filters.entityId };
    }
    if (filters.documentType) {
      filterQuery.documentType = { $eq: filters.documentType };
    }
    
    // Get Pinecone index
    const index = pinecone.Index('greentruth-vectors');
    
    // Query Pinecone
    const queryResults = await index.query({
      queryRequest: {
        vector: embedding,
        topK: limit,
        includeMetadata: true,
        includeValues: false,
        namespace,
        filter: Object.keys(filterQuery).length > 0 ? filterQuery : undefined
      }
    });
    
    // Filter results by score
    const filteredResults = queryResults.matches.filter(match => match.score >= minScore);
    
    // Format results
    const results = filteredResults.map(match => ({
      id: match.id,
      score: match.score,
      documentId: match.metadata.documentId,
      documentType: match.metadata.documentType,
      preview: match.metadata.text,
      source: match.metadata.source,
      timestamp: match.metadata.timestamp
    }));
    
    // Get full text if needed
    if (includeText && results.length > 0) {
      // This would typically fetch the full text from Supabase
      // Implement document text retrieval logic here
    }
    
    return {
      query,
      results,
      total: filteredResults.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Vector search error:', error);
    return {
      query,
      results: [],
      total: 0,
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}
```

### 3. Create Edge Functions for Vector Operations

```typescript
// supabase/functions/vectorize-document/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.19.0';
import { vectorizeDocument } from '../_shared/vectorization.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Parse request
    const { document } = await req.json();
    
    if (!document || !document.id) {
      return new Response(
        JSON.stringify({ error: 'Document ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Vectorize the document
    const result = await vectorizeDocument(document);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Document vectorization error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

```typescript
// supabase/functions/semantic-search/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { searchDocuments } from '../_shared/vectorSearch.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Parse request
    const { query, options } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Perform vector search
    const results = await searchDocuments(query, options);
    
    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Semantic search error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

---

## Database Schema Integration

### 1. Supabase Documents Table

Create a table to track document vectorization status:

```sql
-- Create a documents table with vectorization tracking
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  file_type TEXT,
  content_type TEXT,
  status TEXT DEFAULT 'pending',
  content_length INTEGER,
  user_id UUID REFERENCES auth.users(id),
  entity_id UUID,
  visibility TEXT DEFAULT 'private',
  vectorized BOOLEAN DEFAULT false,
  vector_chunks INTEGER DEFAULT 0,
  last_vectorized TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow users to see documents they own or are shared with their entity
CREATE POLICY "users_can_view_own_documents" ON public.documents
  FOR SELECT
  USING (user_id = auth.uid() OR 
         (entity_id IN (SELECT entity_id FROM user_entities WHERE user_id = auth.uid()) AND 
          visibility = 'entity') OR
         visibility = 'public');

-- Users can create documents
CREATE POLICY "users_can_create_documents" ON public.documents
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own documents
CREATE POLICY "users_can_update_own_documents" ON public.documents
  FOR UPDATE
  USING (user_id = auth.uid());
```

### 2. Document Processing Workflow

Create a webhook to trigger vectorization when a new document is uploaded:

```typescript
// supabase/functions/document-webhook/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.19.0';

serve(async (req) => {
  const payload = await req.json();
  
  // Verify webhook signature (implement proper security)
  // ...
  
  // Process only document inserts
  if (payload.type !== 'INSERT' || payload.table !== 'documents') {
    return new Response('Not a document insert', { status: 200 });
  }
  
  const document = payload.record;
  
  // Initialize Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  );
  
  // Skip already vectorized documents
  if (document.vectorized) {
    return new Response('Document already vectorized', { status: 200 });
  }
  
  try {
    // Get document content from storage
    const { data, error } = await supabase
      .storage
      .from('documents')
      .download(document.file_path);
    
    if (error) throw error;
    
    // Extract text based on file type
    let text;
    if (document.file_type === 'pdf') {
      // Use PDF extraction logic
    } else if (document.file_type === 'docx') {
      // Use DOCX extraction logic
    } else {
      // Convert to text as appropriate
      text = await data.text();
    }
    
    // Call vectorization function
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/vectorize-document`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          document: {
            id: document.id,
            text,
            type: document.content_type,
            source: document.file_path,
            entityId: document.entity_id,
            userId: document.user_id
          }
        })
      }
    );
    
    const result = await response.json();
    
    // Update document status
    await supabase
      .from('documents')
      .update({
        status: result.success ? 'processed' : 'error',
        updated_at: new Date().toISOString()
      })
      .eq('id', document.id);
    
    return new Response('Document vectorization triggered', { status: 200 });
  } catch (error) {
    console.error('Document processing error:', error);
    
    // Update document status to error
    await supabase
      .from('documents')
      .update({
        status: 'error',
        updated_at: new Date().toISOString()
      })
      .eq('id', document.id);
    
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});
```

---

## Use Cases Implementation

### 1. Document Semantic Search Component

```typescript
// src/components/DocumentSearch.tsx
import React, { useState } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { Button, Input, Card, Spinner } from '../components/ui';

export function DocumentSearch() {
  const { supabase } = useSupabase();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: {
          query,
          options: {
            namespace: 'documents',
            limit: 10,
            minScore: 0.7
          }
        }
      });
      
      if (error) throw error;
      
      setResults(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'An error occurred during search');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="document-search">
      <div className="search-bar">
        <Input
          type="text"
          placeholder="Search documents by content or meaning..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? <Spinner size="sm" /> : 'Search'}
        </Button>
      </div>
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
      
      <div className="search-results">
        {results.length > 0 ? (
          results.map((result) => (
            <Card key={result.id} className="result-card">
              <h3>{result.documentId}</h3>
              <p className="score">Relevance: {(result.score * 100).toFixed(1)}%</p>
              <p className="preview">{result.preview}</p>
              <div className="metadata">
                <span>Source: {result.source}</span>
                <span>Type: {result.documentType}</span>
              </div>
            </Card>
          ))
        ) : (
          !isSearching && <p className="no-results">No documents found</p>
        )}
      </div>
    </div>
  );
}
```

### 2. Vendor Matching for RFPs

```typescript
// src/lib/vendorMatching.ts
import { generateEmbedding } from './vectorization';
import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize Pinecone (same as above)

export async function findMatchingVendors(rfpDescription, requirements, options = {}) {
  try {
    const {
      limit = 10,
      minScore = 0.75,
      filters = {},
      attributes = []
    } = options;
    
    // Combine RFP description and requirements into a rich query
    const combinedQuery = `
      RFP Description: ${rfpDescription}
      Key Requirements: ${requirements.join(', ')}
      Desired Attributes: ${attributes.join(', ')}
    `;
    
    // Generate embedding for the combined query
    const embedding = await generateEmbedding(combinedQuery);
    
    // Set up filter if provided
    const filterQuery = {};
    if (filters.region) {
      filterQuery.region = { $eq: filters.region };
    }
    if (filters.certifications && filters.certifications.length > 0) {
      filterQuery.certifications = { $in: filters.certifications };
    }
    
    // Get Pinecone index
    const index = pinecone.Index('greentruth-vectors');
    
    // Query Pinecone for matching vendors
    const queryResults = await index.query({
      queryRequest: {
        vector: embedding,
        topK: limit,
        includeMetadata: true,
        includeValues: false,
        namespace: 'vendors',
        filter: Object.keys(filterQuery).length > 0 ? filterQuery : undefined
      }
    });
    
    // Filter and format results
    const vendors = queryResults.matches
      .filter(match => match.score >= minScore)
      .map(match => ({
        id: match.metadata.vendorId,
        name: match.metadata.name,
        score: match.score,
        matchScore: Math.round(match.score * 100),
        description: match.metadata.description,
        capabilities: match.metadata.capabilities,
        certifications: match.metadata.certifications || [],
        location: match.metadata.location,
        contact: match.metadata.contact
      }));
    
    return {
      total: vendors.length,
      vendors: vendors.sort((a, b) => b.score - a.score)
    };
  } catch (error) {
    console.error('Vendor matching error:', error);
    return {
      total: 0,
      vendors: [],
      error: error.message
    };
  }
}
```

### 3. Regulatory Compliance Mapping

```typescript
// src/lib/complianceMapping.ts
import { generateEmbedding } from './vectorization';
import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize Pinecone (same as above)

export async function mapRegulationsToRequirements(businessDescription, activities, options = {}) {
  try {
    const {
      jurisdictions = ['US', 'EU'],
      industries = [],
      limit = 20
    } = options;
    
    // Create a rich context query
    const contextQuery = `
      Business: ${businessDescription}
      Activities: ${activities.join(', ')}
      Industries: ${industries.join(', ')}
      Jurisdictions: ${jurisdictions.join(', ')}
    `;
    
    // Generate embedding
    const embedding = await generateEmbedding(contextQuery);
    
    // Set up filter for jurisdictions
    const filterQuery = {
      jurisdiction: { $in: jurisdictions }
    };
    if (industries.length > 0) {
      filterQuery.industry = { $in: industries };
    }
    
    // Get Pinecone index
    const index = pinecone.Index('greentruth-vectors');
    
    // Query regulations in Pinecone
    const queryResults = await index.query({
      queryRequest: {
        vector: embedding,
        topK: limit,
        includeMetadata: true,
        includeValues: false,
        namespace: 'regulations',
        filter: filterQuery
      }
    });
    
    // Group by regulation and map to requirements
    const regulationMap = {};
    
    queryResults.matches.forEach(match => {
      const regulation = match.metadata.regulation;
      const requirement = {
        id: match.id,
        section: match.metadata.section,
        description: match.metadata.description,
        relevance: match.score,
        actions: match.metadata.actions || []
      };
      
      if (!regulationMap[regulation]) {
        regulationMap[regulation] = {
          name: regulation,
          jurisdiction: match.metadata.jurisdiction,
          industry: match.metadata.industry,
          requirements: [requirement]
        };
      } else {
        regulationMap[regulation].requirements.push(requirement);
      }
    });
    
    // Convert to array and sort
    const regulations = Object.values(regulationMap)
      .map(reg => ({
        ...reg,
        requirements: reg.requirements.sort((a, b) => b.relevance - a.relevance),
        overallRelevance: reg.requirements.reduce((sum, req) => sum + req.relevance, 0) / reg.requirements.length
      }))
      .sort((a, b) => b.overallRelevance - a.overallRelevance);
    
    return {
      total: regulations.length,
      regulations
    };
  } catch (error) {
    console.error('Compliance mapping error:', error);
    return {
      total: 0,
      regulations: [],
      error: error.message
    };
  }
}
```

### 4. Anomaly Detection in Transactions

```typescript
// src/lib/anomalyDetection.ts
import { generateEmbedding } from './vectorization';
import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize Pinecone (same as above)

export async function detectTransactionAnomalies(transaction, options = {}) {
  try {
    const {
      entityId,
      threshold = 0.85,
      limit = 50
    } = options;
    
    // Create transaction description
    const transactionDescription = `
      Type: ${transaction.type}
      Amount: ${transaction.amount} ${transaction.currency}
      Wallet: ${transaction.walletId}
      Token: ${transaction.tokenId}
      Time: ${transaction.timestamp}
    `;
    
    // Generate embedding
    const embedding = await generateEmbedding(transactionDescription);
    
    // Set up filter
    const filterQuery = {};
    if (entityId) {
      filterQuery.entityId = { $eq: entityId };
    }
    
    // Get Pinecone index
    const index = pinecone.Index('greentruth-vectors');
    
    // Query similar transactions
    const queryResults = await index.query({
      queryRequest: {
        vector: embedding,
        topK: limit,
        includeMetadata: true,
        includeValues: false,
        namespace: 'transactions',
        filter: filterQuery
      }
    });
    
    // Analyze similarity scores
    const similarityScores = queryResults.matches.map(match => match.score);
    const averageSimilarity = similarityScores.reduce((sum, score) => sum + score, 0) / similarityScores.length;
    
    // Determine if transaction is anomalous
    const isAnomalous = averageSimilarity < threshold;
    
    // Get the most similar transactions
    const similarTransactions = queryResults.matches
      .slice(0, 5)
      .map(match => ({
        id: match.metadata.transactionId,
        type: match.metadata.type,
        amount: match.metadata.amount,
        currency: match.metadata.currency,
        walletId: match.metadata.walletId,
        tokenId: match.metadata.tokenId,
        timestamp: match.metadata.timestamp,
        similarity: match.score
      }));
    
    return {
      isAnomalous,
      anomalyScore: 1 - averageSimilarity,
      averageSimilarity,
      similarTransactions,
      analysis: {
        sampleSize: similarityScores.length,
        threshold,
        standardDeviation: calculateStandardDeviation(similarityScores)
      }
    };
  } catch (error) {
    console.error('Anomaly detection error:', error);
    return {
      isAnomalous: false,
      error: error.message
    };
  }
}

// Helper to calculate standard deviation
function calculateStandardDeviation(values) {
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
  return Math.sqrt(avgSquareDiff);
}
```

---

## Index Management

### 1. Automated Index Maintenance

Create a scheduled task to keep the Pinecone index optimized:

```typescript
// supabase/functions/maintain-vector-index/index.ts
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { PineconeClient } from 'https://esm.sh/@pinecone-database/pinecone@0.1.6';

// Initialize Pinecone (same as above)

serve(async (req) => {
  try {
    // Get Pinecone index statistics
    const indexStatsResponse = await pinecone.describeIndexStats({
      indexName: 'greentruth-vectors',
    });
    
    const stats = indexStatsResponse.namespaces;
    console.log('Index stats:', stats);
    
    // Log vector counts by namespace
    const namespaceCounts = {};
    for (const [namespace, data] of Object.entries(stats)) {
      namespaceCounts[namespace] = data.vectorCount;
    }
    
    // Here you could implement additional maintenance:
    // - Delete vectors older than X days
    // - Consolidate similar vectors
    // - Rebuild specific namespaces
    
    return new Response(
      JSON.stringify({
        status: 'success',
        vectorCounts: namespaceCounts,
        timestamp: new Date().toISOString()
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Index maintenance error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
```

### 2. Vector Update on Document Change

Create a function to update vectors when documents are modified:

```typescript
// src/lib/vectorUpdateManager.ts
import { vectorizeDocument } from './vectorization';
import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize Pinecone (same as above)

export async function updateDocumentVectors(document, oldDocument) {
  try {
    // Check if content actually changed
    if (document.content === oldDocument.content) {
      console.log('Document content unchanged, skipping vector update');
      return { updated: false, reason: 'content-unchanged' };
    }
    
    // Delete old vectors
    const index = pinecone.Index('greentruth-vectors');
    
    // Find all chunk IDs for this document
    const deleteResponse = await index.delete({
      deleteRequest: {
        filter: {
          documentId: { $eq: document.id }
        },
        namespace: document.type || 'documents'
      }
    });
    
    console.log(`Deleted ${deleteResponse.deletedCount} existing vectors`);
    
    // Vectorize the updated document
    const vectorizationResult = await vectorizeDocument(document);
    
    return {
      updated: true,
      deletedVectors: deleteResponse.deletedCount,
      newVectors: vectorizationResult.chunks,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Vector update error:', error);
    return {
      updated: false,
      error: error.message
    };
  }
}
```

---

## Performance Optimization

### 1. Embedding Caching

Implement caching for frequently requested embeddings:

```typescript
// src/lib/embeddingCache.ts
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generate a cache key for text
function generateCacheKey(text) {
  // Simple hash function for text
  return Array.from(text)
    .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0)
    .toString(16);
}

// Cache-aware embedding generation
export async function getCachedEmbedding(text) {
  // For very short texts, don't bother caching
  if (text.length < 20) {
    return await generateFreshEmbedding(text);
  }
  
  const cacheKey = generateCacheKey(text);
  
  // Check cache first
  const { data, error } = await supabase
    .from('embedding_cache')
    .select('embedding, created_at')
    .eq('cache_key', cacheKey)
    .single();
  
  if (!error && data) {
    // Check if cache entry is fresh (less than 30 days old)
    const createdAt = new Date(data.created_at);
    const now = new Date();
    const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceCreation < 30) {
      console.log('Cache hit for embedding');
      return data.embedding;
    } else {
      console.log('Cache expired for embedding');
    }
  }
  
  // Cache miss or expired, generate fresh embedding
  const embedding = await generateFreshEmbedding(text);
  
  // Store in cache
  try {
    await supabase
      .from('embedding_cache')
      .upsert({
        cache_key: cacheKey,
        text_hash: cacheKey,
        text_preview: text.substring(0, 100),
        embedding,
        created_at: new Date().toISOString(),
        token_count: Math.ceil(text.length / 4)  // Approximate
      }, {
        onConflict: 'cache_key'
      });
    
    console.log('Stored embedding in cache');
  } catch (cacheError) {
    console.error('Error storing in cache:', cacheError);
    // Non-blocking; we can still return the embedding
  }
  
  return embedding;
}

// Generate fresh embedding without cache
async function generateFreshEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}
```

### 2. Batch Processing for Large Documents

Implement batch processing for large document sets:

```typescript
// src/lib/batchVectorization.ts
import { vectorizeDocument } from './vectorization';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function processDocumentBatch(batchSize = 10) {
  try {
    // Find unvectorized documents
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('vectorized', false)
      .eq('status', 'pending')
      .limit(batchSize);
    
    if (error) throw error;
    
    console.log(`Found ${documents.length} documents to vectorize`);
    
    if (documents.length === 0) {
      return { processed: 0, message: 'No documents to process' };
    }
    
    // Process each document
    const results = [];
    for (const document of documents) {
      // Get document content
      let text;
      try {
        const { data, error: downloadError } = await supabase
          .storage
          .from('documents')
          .download(document.file_path);
        
        if (downloadError) throw downloadError;
        
        // Extract text (implement based on file type)
        text = await data.text();
        
        // Update document status to processing
        await supabase
          .from('documents')
          .update({ status: 'processing' })
          .eq('id', document.id);
        
        // Vectorize
        const result = await vectorizeDocument({
          id: document.id,
          text,
          type: document.content_type,
          source: document.file_path,
          entityId: document.entity_id,
          userId: document.user_id
        });
        
        results.push({
          id: document.id,
          success: result.success,
          chunks: result.chunks
        });
      } catch (processingError) {
        console.error(`Error processing document ${document.id}:`, processingError);
        
        // Update document status to error
        await supabase
          .from('documents')
          .update({
            status: 'error',
            updated_at: new Date().toISOString()
          })
          .eq('id', document.id);
        
        results.push({
          id: document.id,
          success: false,
          error: processingError.message
        });
      }
    }
    
    return {
      processed: documents.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  } catch (error) {
    console.error('Batch processing error:', error);
    return {
      processed: 0,
      error: error.message
    };
  }
}
```

---

## Security Best Practices

### 1. API Key Management

Store API keys securely in Supabase secrets:

```bash
# Set Pinecone API key
supabase secrets set PINECONE_API_KEY=your-api-key-here

# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=your-api-key-here

# Set Pinecone environment
supabase secrets set PINECONE_ENVIRONMENT=us-west1-gcp
```

### 2. Access Control

Implement row-level security for vector search results:

```typescript
// src/lib/secureVectorSearch.ts
import { searchDocuments } from './vectorSearch';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function secureSearchDocuments(query, options = {}, user) {
  // Perform the vector search
  const results = await searchDocuments(query, options);
  
  // If no user is provided, filter to only public documents
  if (!user) {
    return {
      ...results,
      results: results.results.filter(r => r.visibility === 'public'),
      filteredCount: results.results.length - results.results.filter(r => r.visibility === 'public').length
    };
  }
  
  // For authenticated users, filter based on access
  const { data: userEntities } = await supabase
    .from('user_entities')
    .select('entity_id')
    .eq('user_id', user.id);
  
  const userEntityIds = userEntities.map(ue => ue.entity_id);
  
  // Filter results based on access control
  const filteredResults = results.results.filter(result => {
    // User's own documents
    if (result.userId === user.id) return true;
    
    // Public documents
    if (result.visibility === 'public') return true;
    
    // Entity documents for entities the user belongs to
    if (result.visibility === 'entity' && 
        userEntityIds.includes(result.entityId)) return true;
    
    // Filter out other documents
    return false;
  });
  
  return {
    ...results,
    results: filteredResults,
    filteredCount: results.results.length - filteredResults.length
  };
}
```

### 3. Input Validation

Implement input validation for vector operations:

```typescript
// src/lib/validateVectorInput.ts
export function validateSearchInput(query, options = {}) {
  const errors = [];
  
  // Check query
  if (!query || typeof query !== 'string') {
    errors.push('Query must be a non-empty string');
  } else if (query.length < 3) {
    errors.push('Query must be at least 3 characters long');
  } else if (query.length > 1000) {
    errors.push('Query must be less than 1000 characters');
  }
  
  // Check options
  if (options.namespace && typeof options.namespace !== 'string') {
    errors.push('Namespace must be a string');
  }
  
  if (options.limit !== undefined) {
    if (typeof options.limit !== 'number' || options.limit < 1 || options.limit > 100) {
      errors.push('Limit must be a number between 1 and 100');
    }
  }
  
  if (options.minScore !== undefined) {
    if (typeof options.minScore !== 'number' || options.minScore < 0 || options.minScore > 1) {
      errors.push('minScore must be a number between 0 and 1');
    }
  }
  
  // Check filters
  if (options.filters && typeof options.filters !== 'object') {
    errors.push('Filters must be an object');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---

## Testing and Monitoring

### 1. Vector Quality Testing

Create a test suite for embedding quality:

```typescript
// src/tests/embeddingQuality.test.js
import { generateEmbedding } from '../lib/vectorization';

describe('Embedding Quality Tests', () => {
  test('Similar texts should have high similarity', async () => {
    const text1 = 'The company complies with environmental regulations';
    const text2 = 'The organization follows eco-friendly regulatory requirements';
    
    const embedding1 = await generateEmbedding(text1);
    const embedding2 = await generateEmbedding(text2);
    
    const similarity = calculateCosineSimilarity(embedding1, embedding2);
    
    expect(similarity).toBeGreaterThan(0.8);
  });
  
  test('Dissimilar texts should have low similarity', async () => {
    const text1 = 'The company complies with environmental regulations';
    const text2 = 'The quarterly financial report shows increased revenue';
    
    const embedding1 = await generateEmbedding(text1);
    const embedding2 = await generateEmbedding(text2);
    
    const similarity = calculateCosineSimilarity(embedding1, embedding2);
    
    expect(similarity).toBeLessThan(0.7);
  });
  
  // Helper function for cosine similarity
  function calculateCosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
});
```

### 2. Vector API Monitoring

Implement monitoring for vector operations:

```typescript
// src/lib/vectorMonitoring.ts
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function logVectorOperation(operation, metadata = {}) {
  try {
    await supabase
      .from('vector_operations_log')
      .insert({
        operation,
        metadata,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error logging vector operation:', error);
    // Non-blocking; operation can continue
  }
}

export async function getVectorOperationStats(period = '24h') {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    if (period === '24h') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    }
    
    // Get operation counts
    const { data, error } = await supabase
      .from('vector_operations_log')
      .select('operation, count')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .group('operation');
    
    if (error) throw error;
    
    // Format results
    const stats = {};
    data.forEach(item => {
      stats[item.operation] = parseInt(item.count);
    });
    
    return {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      stats
    };
  } catch (error) {
    console.error('Error getting vector stats:', error);
    return {
      period,
      error: error.message
    };
  }
}
```

---

## Troubleshooting Guide

Common issues and their solutions:

### 1. Embedding Generation Errors

- **Timeout Errors**: Break down large documents into smaller chunks
- **Token Limits**: Ensure text is within model token limits (8192 tokens for ada-002)
- **API Rate Limits**: Implement exponential backoff for retries

### 2. Pinecone Connectivity Issues

- **Authentication Errors**: Verify API key is correct and not expired
- **Timeout Errors**: Check network connectivity and Pinecone service status
- **Quota Exceeded**: Monitor usage and upgrade plan if necessary

### 3. Query Performance Issues

- **Slow Queries**: Add more specific filters to reduce the search space
- **Low Relevance Results**: Adjust minScore parameter and improve embedding quality
- **Missing Results**: Check namespace configuration and index statistics
