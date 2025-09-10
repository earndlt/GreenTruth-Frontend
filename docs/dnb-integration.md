# Frontend D&B RiskAnalytics Integration Updates

This document describes the frontend updates made to support the new D&B RiskAnalytics API integration in the GreenTruth KYB solution.

## Overview

The frontend has been enhanced to provide a comprehensive interface for D&B RiskAnalytics integration, including entity creation, screening evaluation, and enhanced verification capabilities. The updates maintain backward compatibility while adding powerful new features.

## Updated Components

### 1. **Enhanced KYB Types (`src/types/kyb.ts`)**

Extended the existing KYB types to support new D&B integration features:

#### New Interfaces Added:
- `KYBEntityCreationRequest`: For creating new entities in D&B
- `KYBScreeningRequest`: For screening evaluation configuration
- `KYBRiskAssessment`: For comprehensive risk assessment data
- `KYBEntityDetails`: For detailed entity information

#### Enhanced Existing Interfaces:
- `KYBVerificationRequest`: Added D&B-specific fields
- `KYBVerificationResponse`: Added entity and screening details
- `KYBVerificationRecord`: Added comprehensive D&B data fields

#### New Fields Added:
```typescript
// Entity creation and management
entityType?: "Individual" | "Organization" | "Vessel" | "Aircraft";
dataPackage?: "CORE" | "CORE_PLUS" | "Non-DUNS";
inPortfolio?: "Yes" | "No";
startEvaluation?: "Yes" | "No";

// Contact and business information
phoneNumber?: string;
emailAddress?: string;
websiteURL?: string;
entityYearOfBirth?: string;
countryRegistrationNumber?: string;

// Advanced options
uboSearchIncluded?: boolean;
tradeUp?: boolean;
customerReference?: string;

// Screening configuration
screeningEnrichment?: string;
screeningLevel?: string;
kaseIterationId?: string;
kaseId?: string;

// Risk assessment data
riskScore?: number;
stabilityScore?: number;
supplierStabilityIndex?: number;
supplierEvaluationRisk?: number;
```

### 2. **Enhanced KYB Hook (`src/hooks/useKybStatus.ts`)**

Extended the existing KYB hook with new D&B integration methods:

#### New Methods Added:
- `createEntityAndScreen()`: Creates entity and initiates screening
- `getFullEntityInfo()`: Retrieves comprehensive entity information
- `initiateScreening()`: Initiates screening for existing entity
- `initiateScreeningByDuns()`: Initiates screening by DUNS number

#### Enhanced Error Handling:
- Better error messages and status updates
- Comprehensive error logging
- Improved user feedback

### 3. **New Enhanced KYB Form Component (`src/components/settings/admin/EnhancedKybForm.tsx`)**

A comprehensive new component that provides full D&B RiskAnalytics integration:

#### Features:
- **Tabbed Interface**: Three main sections for different workflows
- **Entity Creation**: Full entity creation with D&B integration
- **Entity Search**: Search existing entities by DUNS number
- **Screening Management**: Initiate and manage screening evaluations

#### Tab Structure:
1. **Create Entity**: Create new entities and initiate screening
2. **Search Entity**: Search for existing entities
3. **Screening**: Manage screening evaluations

#### Form Fields:
- Entity type and data package selection
- Comprehensive business information
- Address information with ISO country codes
- Screening configuration options
- Advanced options (UBO search, trade-up, etc.)

### 4. **Updated KYB Overview Component (`src/components/settings/admin/KycOverview.tsx`)**

Enhanced the existing KYB overview to include new D&B integration features:

#### New Tab Structure:
1. **Overview**: Basic verification and status display
2. **Enhanced D&B**: Full D&B integration interface
3. **History**: Verification history and management

#### Enhanced Features:
- Integrated enhanced KYB form
- Better status display
- Improved verification history
- Cleaner user interface

### 5. **Updated API Configuration (`src/config/api.ts`)**

Added new API endpoints for D&B integration:

#### New Endpoints:
```typescript
KYB: {
  // Existing endpoints
  VERIFY: `${API_URL}/api/kyb/verify`,
  CHECK_STATUS: `${API_URL}/api/kyb/status`,
  HISTORY: `${API_URL}/api/kyb/history`,
  
  // New D&B integration endpoints
  CREATE_ENTITY: `${API_URL}/api/kyb/create-entity`,
  GET_ENTITY_INFO: `${API_URL}/api/kyb/entity`,
  INITIATE_SCREENING_ENTITY: `${API_URL}/api/kyb/screening/entity`,
  INITIATE_SCREENING_DUNS: `${API_URL}/api/kyb/screening/duns`,
  
  // Legacy endpoints (kept for backward compatibility)
  STATS: `${API_URL}/api/kyb/stats`,
  RESET: `${API_URL}/api/kyb/reset`,
  TEST_UPDATE: `${API_URL}/api/kyb/test-update`,
  WEBHOOK_STATUS: `${API_URL}/api/kyb/webhook-status`,
  TRIGGER_WEBHOOK: `${API_URL}/api/kyb/trigger-webhook`,
}
```

## User Interface Features

### 1. **Enhanced Entity Creation Form**

#### Entity Type Selection:
- Organization (default)
- Individual
- Vessel
- Aircraft

#### Data Package Options:
- **CORE**: Basic business information
- **CORE_PLUS**: Enhanced business data and risk scores
- **Non-DUNS**: For entities without DUNS numbers

#### Comprehensive Business Information:
- Company name and contact details
- Address information with validation
- Business registration details
- Website and social media links

#### Screening Configuration:
- Screening enrichment level (Standard/Enhanced)
- Screening level (Basic/Comprehensive)
- UBO search inclusion
- Trade-up options

### 2. **Entity Search and Management**

#### DUNS Number Search:
- Search existing entities by DUNS
- Display comprehensive entity information
- Entity status and details
- Integration with screening workflows

#### Entity Information Display:
- Entity ID and DUNS number
- Business name and status
- Data package information
- Creation and modification dates

### 3. **Screening Management**

#### Screening Initiation:
- Initiate screening for existing entities
- Configure screening parameters
- Monitor screening progress
- View screening results

#### Screening Options:
- **Enrichment Level**: Standard or Enhanced
- **Screening Level**: Basic or Comprehensive
- **Custom Parameters**: Kase ID and iteration tracking

### 4. **Enhanced Status Display**

#### Real-time Updates:
- Live status monitoring
- Progress indicators
- Estimated completion times
- Detailed status messages

#### Status Types:
- **Pending**: Initial submission
- **In Process**: D&B processing
- **Approved**: Verification successful
- **Rejected**: Verification failed
- **Expired**: Verification expired
- **Requires Action**: Additional information needed

## User Experience Improvements

### 1. **Intuitive Workflow**

#### Tabbed Navigation:
- Clear separation of different workflows
- Logical progression from basic to advanced features
- Consistent interface across all sections

#### Form Validation:
- Real-time validation feedback
- Clear error messages
- Required field indicators
- Helpful placeholder text

### 2. **Responsive Design**

#### Mobile Optimization:
- Responsive grid layouts
- Touch-friendly form controls
- Optimized spacing for mobile devices
- Consistent experience across devices

#### Accessibility:
- Proper form labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### 3. **User Feedback**

#### Toast Notifications:
- Success and error messages
- Clear action confirmations
- Helpful guidance text
- Non-intrusive notifications

#### Loading States:
- Spinner indicators during API calls
- Disabled states for form submission
- Progress indicators for long operations
- Clear status updates

## Integration Features

### 1. **D&B RiskAnalytics Integration**

#### Authentication:
- Automatic JWT token management
- Token refresh handling
- Secure API communication
- Error handling for auth failures

#### Data Synchronization:
- Real-time status updates
- Automatic data refresh
- Webhook integration
- Background processing

### 2. **Risk Assessment Display**

#### Risk Scores:
- Supplier Stability Index
- Supplier Evaluation Risk Score
- Composite Risk Scorecard
- Cybersecurity Scorecard

#### Risk Visualization:
- Color-coded risk indicators
- Progress bars for scores
- Trend analysis
- Comparative metrics

### 3. **Compliance Features**

#### UBO Management:
- Ultimate Beneficial Owner search
- Ownership structure analysis
- Compliance reporting
- Risk assessment integration

#### Audit Trail:
- Complete verification history
- User action logging
- Compliance documentation
- Export capabilities

## Configuration and Setup

### 1. **Environment Variables**

#### Required Configuration:
```bash
# D&B RiskAnalytics API Configuration
DNB_CLIENT_ID=your_client_id
DNB_CLIENT_SECRET=your_client_secret
DNB_BASE_URL=https://integration.riskanalytics.dnb.com
```

#### Optional Configuration:
```bash
# Frontend Configuration
VITE_API_URL=http://localhost:3000
VITE_DNB_ENABLED=true
VITE_DNB_MOCK_MODE=false
```

### 2. **Feature Flags**

#### D&B Integration:
- Enable/disable D&B features
- Mock mode for development
- Feature-specific toggles
- Environment-based configuration

#### User Permissions:
- Role-based access control
- Feature-level permissions
- Organization-level settings
- User preference management

## Development and Testing

### 1. **Development Mode**

#### Mock Data:
- Simulated API responses
- Test data generation
- Offline development support
- Rapid prototyping

#### Debug Features:
- API call logging
- Response inspection
- Error simulation
- Performance monitoring

### 2. **Testing Support**

#### Unit Tests:
- Component testing
- Hook testing
- Utility function testing
- Mock service testing

#### Integration Tests:
- API integration testing
- End-to-end workflows
- User interaction testing
- Error scenario testing

## Migration Guide

### 1. **From Legacy KYB**

#### Backward Compatibility:
- All existing functionality preserved
- Gradual migration path
- Feature toggle support
- Data migration tools

#### New Features:
- Enhanced entity creation
- Advanced screening options
- Risk assessment display
- Compliance features

### 2. **User Training**

#### New Workflows:
- Entity creation process
- Screening management
- Risk assessment interpretation
- Compliance reporting

#### Interface Changes:
- Tabbed navigation
- Enhanced forms
- Status displays
- History management

## Support and Maintenance

### 1. **Technical Support**

#### Documentation:
- API reference documentation
- User guides and tutorials
- Troubleshooting guides
- Best practices

#### Support Channels:
- Development team support
- D&B technical support
- User community forums
- Knowledge base articles

### 2. **Maintenance**

#### Updates:
- Regular feature updates
- Security patches
- Performance improvements
- Bug fixes

#### Monitoring:
- API usage monitoring
- Error rate tracking
- Performance metrics
- User feedback collection

## Conclusion

The frontend updates provide a comprehensive and user-friendly interface for D&B RiskAnalytics integration. The enhanced features maintain backward compatibility while adding powerful new capabilities for business verification, risk assessment, and compliance management.

Key benefits include:
- **Enhanced User Experience**: Intuitive workflows and clear feedback
- **Comprehensive Integration**: Full D&B RiskAnalytics API support
- **Advanced Features**: Entity creation, screening, and risk assessment
- **Compliance Support**: UBO management and audit trails
- **Scalable Architecture**: Modular design for future enhancements

The updated frontend positions GreenTruth as a leading platform for comprehensive business verification and risk assessment through D&B's industry-leading data and analytics capabilities. 