
# GreenTruth Backend Administration Application

## Overview

The Backend Administration Application provides GreenTruth staff with comprehensive tools to manage the platform, support users, handle transactions, and maintain compliance features. This secure application connects to the same data sources as the main application but provides additional administrative capabilities.

## Architecture

The Backend Administration Application uses a layered architecture:

- **Frontend Layer**: React application with shadcn/ui components for consistent design
- **API Layer**: Secure REST endpoints with JWT authentication and role-based access control
- **Service Layer**: Business logic implementation for all administrative functions
- **Data Access Layer**: Secure connections to PostgreSQL, MongoDB, and Pinecone databases

## Core Modules

### User & Entity Management

- User administration (account management, role assignment)
- Corporate entity verification and KYC management
- Role-based access control configuration

### Transaction Management

- Real-time transaction monitoring and approval workflows
- Wallet management and balance reconciliation
- Multi-signature transaction approval

### EAC Registry Administration

- Certificate issuance, verification, and revocation
- Market monitoring and position tracking
- Suspicious activity detection

### Compliance & Regulatory

- Regulatory update management and distribution
- Audit trail monitoring and export
- Compliance report generation

### Support & Customer Service

- Ticket management and assignment
- Knowledge base article administration
- User assistance tools

### System Configuration

- API key management and monitoring
- Integration configuration and health monitoring
- Feature flag management

### Analytics & Reporting

- System performance monitoring
- Business intelligence dashboards
- Custom report builder

## Security Features

- Mandatory 2FA for administrative access
- IP-based access restrictions
- Comprehensive audit logging
- Role-based access control
- Session management and timeout controls

## Integration Points

The Backend Administration Application integrates with the main GreenTruth application through:

- Shared authentication services with elevated privileges
- Direct database access with proper security controls
- Service-to-service API communication
- Event-based messaging for real-time updates

## Access Requirements

Access to the Backend Administration Application is strictly controlled:

- Only authorized GreenTruth staff members can access the system
- All actions are logged with user identification
- Sensitive operations require multi-factor authentication
- Critical changes may require multiple approvals

## Deployment Model

The Backend Administration Application is deployed:

- In a separate, secure environment
- With its own scaling and redundancy controls
- Behind additional network security layers
- With regular security scanning and updates

For details on specific administrative procedures, please refer to the individual module documentation.
