# KYB Frontend-Backend Integration

This document describes how the frontend KYB system integrates with the backend status management system.

## Overview

The frontend KYB system now provides a complete integration with the backend, including:
- Real-time status updates
- Verification history tracking
- Statistics and analytics
- Test features for development
- Webhook service monitoring

## Key Features

### 1. **Enhanced Status Management**
- **Real-time Updates**: Status changes are reflected immediately
- **Automatic Polling**: Frontend polls backend every 30 seconds for status updates
- **Status Persistence**: Verification status is stored in localStorage for continuity

### 2. **Backend Integration**
- **API Endpoints**: All backend KYB endpoints are properly integrated
- **Error Handling**: Comprehensive error handling for API failures
- **Organization Context**: Proper organization ID handling for multi-tenant support

### 3. **Developer Features**
- **Test Updates**: Manual status update testing
- **Webhook Monitoring**: Real-time webhook service status
- **Verification History**: Complete audit trail of all verifications
- **Statistics Dashboard**: Real-time verification metrics

## API Integration

### Backend Endpoints Used

| Frontend Function | Backend Endpoint | Description |
|------------------|------------------|-------------|
| `startVerification` | `POST /api/kyb/verify` | Submit new verification |
| `checkStatus` | `GET /api/kyb/status/:id` | Check verification status |
| `getVerificationHistory` | `GET /api/kyb/history` | Get verification history |
| `getVerificationStats` | `GET /api/kyb/stats` | Get verification statistics |
| `getWebhookStatus` | `GET /api/kyb/webhook-status` | Check webhook service |
| `testStatusUpdate` | `POST /api/kyb/test-update/:id` | Test status update |

### Request Headers

```typescript
// Organization ID header for multi-tenant support
headers: {
  'Content-Type': 'application/json',
  'X-Organization-ID': organizationId
}
```

## Frontend Components

### 1. **`useKybStatus` Hook**
- **State Management**: Manages all KYB verification state
- **API Integration**: Handles all backend communication
- **Polling Logic**: Automatic status updates every 30 seconds
- **Local Storage**: Persists verification data across sessions

### 2. **`KybStatusDisplay` Component**
- **Status Visualization**: Color-coded status display
- **Action Buttons**: Check status, test updates, reset verification
- **Timing Information**: Estimated completion times and processing duration
- **User Guidance**: Clear messaging about verification process

### 3. **`KycOverview` Component**
- **Form Handling**: KYB verification form with validation
- **Status Management**: Conditional rendering based on verification state
- **Data Dashboard**: Statistics, history, and webhook status
- **Test Features**: Developer tools for testing and debugging

## Data Flow

### 1. **Verification Submission**
```
User submits form → Frontend calls /api/kyb/verify → Backend creates record → Status: 'in_process'
```

### 2. **Status Polling**
```
Frontend polls /api/kyb/status/:id every 30s → Backend simulates DNB updates → Status changes reflected in UI
```

### 3. **Status Updates**
```
Backend webhook service → Status changes → Frontend receives updates → UI updates automatically
```

## Configuration

### Environment Variables
```bash
# Frontend API configuration
VITE_API_URL=http://localhost:5000
```

### Local Storage Keys
```typescript
// Organization context
localStorage.setItem('organization_id', 'demo-org-123');

// Verification state
localStorage.setItem('kyb_status', 'in_process');
localStorage.setItem('kyb_verification_id', 'uuid-here');
localStorage.setItem('kyb_last_updated', 'timestamp');
localStorage.setItem('kyb_estimated_completion', 'timestamp');
localStorage.setItem('kyb_verified', 'true/false');
```

## Testing Features

### 1. **Test Status Updates**
- **Purpose**: Manually trigger status changes for testing
- **Usage**: Click "Test Update" button when verification is in process
- **Backend**: Calls `/api/kyb/test-update/:id` endpoint
- **Result**: Simulates DNB response and updates status

### 2. **Developer Mode**
- **Toggle**: Show/hide test features
- **Features**: Test buttons, webhook status, detailed logging
- **Access**: Available in development environment

### 3. **Verification History**
- **Display**: All previous verification attempts
- **Data**: Company names, statuses, submission dates
- **Organization**: Scoped to current organization

## Error Handling

### 1. **API Errors**
- **Network Failures**: Graceful fallback with user messaging
- **Server Errors**: Clear error messages and retry options
- **Validation Errors**: Field-specific error display

### 2. **Status Errors**
- **Verification Not Found**: Clear messaging and reset options
- **Invalid Data**: Form validation with helpful error messages
- **Timeout Handling**: Automatic retry with exponential backoff

### 3. **User Experience**
- **Loading States**: Clear indication of processing status
- **Error Recovery**: Simple steps to resolve common issues
- **Progress Tracking**: Visual feedback throughout verification process

## Performance Considerations

### 1. **Polling Optimization**
- **Interval**: 30 seconds for active verifications
- **Conditional**: Only polls when status is 'in_process'
- **Cleanup**: Proper cleanup on component unmount

### 2. **Data Caching**
- **Local Storage**: Verification state persisted locally
- **API Caching**: Verification history and stats cached
- **State Management**: Efficient React state updates

### 3. **Memory Management**
- **Interval Cleanup**: Proper cleanup of polling intervals
- **Event Listeners**: Cleanup of event handlers
- **Component Lifecycle**: Proper useEffect cleanup

## Security Features

### 1. **Input Validation**
- **Form Validation**: Zod schema validation
- **API Validation**: Backend validation of all inputs
- **XSS Prevention**: Proper input sanitization

### 2. **Organization Isolation**
- **Multi-tenant**: Organization ID in all requests
- **Data Segregation**: Verification data scoped to organization
- **Access Control**: Proper authorization checks

### 3. **Data Protection**
- **PII Handling**: Sensitive data properly managed
- **Local Storage**: Limited sensitive data in localStorage
- **API Security**: HTTPS and proper headers

## Future Enhancements

### 1. **Real-time Updates**
- **WebSocket**: Real-time status updates
- **Server-Sent Events**: Alternative to polling
- **Push Notifications**: Browser notifications for status changes

### 2. **Advanced Analytics**
- **Charts**: Visual representation of verification data
- **Trends**: Historical verification patterns
- **Predictions**: Estimated completion time improvements

### 3. **Integration Features**
- **Email Notifications**: Status update emails
- **Slack Integration**: Team notifications
- **Webhook Endpoints**: External system integration

## Troubleshooting

### Common Issues

1. **Verification Not Starting**
   - Check backend service is running
   - Verify API endpoints are accessible
   - Check browser console for errors

2. **Status Not Updating**
   - Verify webhook service is active
   - Check polling is working
   - Verify verification ID is valid

3. **History Not Loading**
   - Check organization ID is set
   - Verify backend history endpoint
   - Check network connectivity

### Debug Tools

1. **Browser Console**: Detailed error logging
2. **Network Tab**: API request/response monitoring
3. **Local Storage**: Verification state inspection
4. **Test Features**: Manual status update testing

## Development Setup

### 1. **Backend Requirements**
```bash
# Backend must be running on configured port
cd GreenTruth-Backend
npm install
npm run dev
```

### 2. **Frontend Setup**
```bash
# Frontend development
cd GreenTruth-Frontend
npm install
npm run dev
```

### 3. **Environment Configuration**
```bash
# Set API URL in frontend
VITE_API_URL=http://localhost:5000
```

### 4. **Testing**
```bash
# Test verification flow
1. Submit verification form
2. Check status updates
3. Use test features
4. Monitor webhook service
```

This integration provides a robust, user-friendly KYB verification system with comprehensive backend support, real-time updates, and developer-friendly testing features. 