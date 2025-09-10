# Frontend API Client Implementation

## Overview
This document outlines the implementation of a centralized API client for the GreenTruth frontend that automatically handles authentication headers for all API calls. This ensures consistent authentication across all services and eliminates the need to manually add Authorization headers to each request.

## Key Components

### 1. API Client (`src/services/apiClient.ts`)

**Features:**
- Automatic authentication header injection
- Centralized error handling
- Automatic token cleanup on 401 errors
- Type-safe request/response handling
- Support for all HTTP methods (GET, POST, PUT, DELETE)

**Key Methods:**
- `get<T>(url, options?)`: Authenticated GET request
- `post<T>(url, data?, options?)`: Authenticated POST request
- `put<T>(url, data?, options?)`: Authenticated PUT request
- `delete<T>(url, options?)`: Authenticated DELETE request
- `isAuthenticated()`: Check if user is authenticated
- `getCurrentUser()`: Get current user data

**Authentication Handling:**
```typescript
// Automatically includes Authorization header
const response = await apiClient.get('/api/kyb/history');

// Equivalent to:
const response = await fetch('/api/kyb/history', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 2. Updated Services

**PaymentMethodService (`src/services/paymentMethodService.ts`):**
- Removed manual fetch calls
- Removed manual header management
- Simplified error handling
- Removed getUserId() method (no longer needed)

**KYB Hook (`src/hooks/useKybStatus.ts`):**
- Updated all API calls to use apiClient
- Simplified request/response handling
- Consistent error handling

## Implementation Benefits

### 1. Security
- **Automatic Authentication**: All API calls automatically include JWT tokens
- **Token Management**: Automatic cleanup of invalid tokens
- **Consistent Headers**: Standardized request headers across all services

### 2. Developer Experience
- **Simplified Code**: No need to manually add Authorization headers
- **Type Safety**: Full TypeScript support with generic types
- **Error Handling**: Centralized error handling with automatic 401 redirects
- **Consistent API**: Uniform interface across all services

### 3. Maintainability
- **Single Source of Truth**: All API logic centralized in one place
- **Easy Updates**: Changes to authentication logic only need to be made in one place
- **Reduced Duplication**: Eliminates repetitive header and error handling code

## Usage Examples

### Before (Manual Headers)
```typescript
// Old way - manual header management
const response = await fetch('/api/payment-methods', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.message || 'Request failed');
}

const data = await response.json();
return data.data;
```

### After (API Client)
```typescript
// New way - automatic header management
const response = await apiClient.get<{ data: PaymentMethod[] }>('/api/payment-methods');
return response.data;
```

### Service Implementation
```typescript
import { apiClient } from '@/services/apiClient';

class MyService {
  async getData(): Promise<MyData[]> {
    const response = await apiClient.get<{ data: MyData[] }>('/api/my-endpoint');
    return response.data;
  }

  async createData(data: CreateDataRequest): Promise<MyData> {
    const response = await apiClient.post<{ data: MyData }>('/api/my-endpoint', data);
    return response.data;
  }

  async updateData(id: string, data: UpdateDataRequest): Promise<MyData> {
    const response = await apiClient.put<{ data: MyData }>(`/api/my-endpoint/${id}`, data);
    return response.data;
  }

  async deleteData(id: string): Promise<void> {
    await apiClient.delete(`/api/my-endpoint/${id}`);
  }
}
```

## Error Handling

### Automatic 401 Handling
```typescript
// If token is invalid or expired, apiClient automatically:
// 1. Clears localStorage tokens
// 2. Redirects to login page
// 3. Throws appropriate error

try {
  const data = await apiClient.get('/api/protected-endpoint');
  // Handle success
} catch (error) {
  // Handle error (user will be redirected to login if 401)
  console.error('API call failed:', error.message);
}
```

### Custom Error Handling
```typescript
try {
  const data = await apiClient.post('/api/endpoint', requestData);
  return data;
} catch (error) {
  // Custom error handling
  if (error.message.includes('Validation failed')) {
    // Handle validation errors
  } else if (error.message.includes('Not found')) {
    // Handle not found errors
  } else {
    // Handle other errors
  }
  throw error;
}
```

## Migration Guide

### Step 1: Import API Client
```typescript
import { apiClient } from '@/services/apiClient';
```

### Step 2: Replace Fetch Calls
```typescript
// Before
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});

// After
const response = await apiClient.post(url, data);
```

### Step 3: Update Response Handling
```typescript
// Before
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.message || 'Request failed');
}
const data = await response.json();

// After
// Error handling is automatic, just use the response
const data = response.data;
```

### Step 4: Remove Manual Token Management
```typescript
// Remove these patterns:
const token = localStorage.getItem('greentruth_access_token');
const headers = { 'Authorization': `Bearer ${token}` };

// API client handles this automatically
```

## Services Updated

### ✅ Completed
- `paymentMethodService.ts` - All methods updated
- `useKybStatus.ts` - All API calls updated

### 🔄 To Be Updated
- `stripePaymentService.ts` - Needs API client integration
- `plaidService.ts` - Needs API client integration
- `transferService.ts` - Needs API client integration
- `regulationsGovApi.ts` - May not need authentication

## Testing

### Authentication Test
```typescript
// Test with valid token
const data = await apiClient.get('/api/protected-endpoint');
console.log('Success:', data);

// Test with invalid token (should redirect to login)
localStorage.setItem('greentruth_access_token', 'invalid_token');
try {
  await apiClient.get('/api/protected-endpoint');
} catch (error) {
  console.log('Expected error:', error.message);
  // User should be redirected to login page
}
```

### Error Handling Test
```typescript
try {
  const data = await apiClient.post('/api/endpoint', invalidData);
} catch (error) {
  console.log('Error handled:', error.message);
  // Should show user-friendly error message
}
```

## Future Enhancements

### 1. Request/Response Interceptors
```typescript
// Add request logging
apiClient.addRequestInterceptor((config) => {
  console.log('Making request:', config.url);
  return config;
});

// Add response logging
apiClient.addResponseInterceptor((response) => {
  console.log('Received response:', response.status);
  return response;
});
```

### 2. Retry Logic
```typescript
// Automatic retry on network errors
apiClient.setRetryConfig({
  retries: 3,
  retryDelay: 1000
});
```

### 3. Request Cancellation
```typescript
// Cancel requests when component unmounts
const controller = new AbortController();
const data = await apiClient.get('/api/endpoint', {
  signal: controller.signal
});
```

## Conclusion

The centralized API client provides a robust, secure, and maintainable solution for handling all API communications in the GreenTruth frontend. It ensures:

1. **Consistent Authentication**: All API calls automatically include proper headers
2. **Simplified Development**: Reduced boilerplate code for API calls
3. **Better Error Handling**: Centralized error management with automatic token cleanup
4. **Type Safety**: Full TypeScript support for request/response types
5. **Easy Maintenance**: Single point of control for API logic

This implementation significantly improves the developer experience while ensuring security and consistency across the entire application.