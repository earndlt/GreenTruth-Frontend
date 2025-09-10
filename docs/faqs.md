
# Frequently Asked Questions

This document provides answers to common questions about the GreenTruth platform, its features, and how to resolve common issues.

---

## General Questions

### What is GreenTruth?

GreenTruth is a comprehensive compliance, procurement, and analytics platform designed specifically for EAC (Environmental Attribute Certificate) and energy/environmental product markets. It provides robust procurement workflows, analytics dashboards, registry integration, role-based access control with segregation of duties, and integrated billing/subscriptions.

### What can I do with GreenTruth?

GreenTruth enables you to:
- Procure, track, and retire Environmental Attribute Certificates (EACs)
- Manage compliance with environmental regulations
- Discover and onboard vendors through our AI-powered matching system
- Create and manage RFPs and RFIs with procurement workflows
- Generate detailed reports for compliance and stakeholder communications
- Integrate with your existing systems (ERP, accounting, etc.)

### How is GreenTruth different from other platforms?

GreenTruth distinguishes itself through:
- Deep integration with the EarnDLT blockchain protocol for immutable record-keeping
- AI-powered vendor matching and document analysis
- Built-in Segregation of Duties for enhanced compliance and security
- Multi-registry connectivity across environmental markets
- Vector-based semantic search for regulatory and compliance documents

### What technology stack does GreenTruth use?

GreenTruth is built on a modern tech stack including:
- Frontend: React, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Supabase (PostgreSQL), Edge Functions
- Cloud: AWS (EC2, S3), MongoDB, Pinecone Vector DB
- Authentication: JWT-based with multi-factor authentication
- Integrations: EarnDLT, Stripe, Plaid, various EAC registries

---

## Account Management

### How do I create an account?

Contact our sales team at sales@greentruth.com to set up your organization's account. We'll guide you through the onboarding process and help configure your environment.

### Can I have multiple users under one organization?

Yes, GreenTruth supports multiple users within an organization with different roles and permissions. The number of users depends on your subscription plan.

### How do I add new users to my organization?

Administrators can add new users through:
1. Settings → Admin → User Management
2. Click "Add User"
3. Enter the user's details and assign appropriate roles
4. The user will receive an email invitation

### How do I change my password?

To change your password:
1. Click on your profile icon in the top right corner
2. Select "Settings"
3. Navigate to the "Account" tab
4. Click "Change Password"

### What is two-factor authentication and how do I enable it?

Two-factor authentication (2FA) adds an extra layer of security to your account by requiring a second verification step beyond your password. To enable 2FA:
1. Go to Settings → Account → Security
2. Click "Enable Two-Factor Authentication"
3. Follow the prompts to set up using an authenticator app

### Can I have multiple corporate entities under one account?

Yes, GreenTruth supports multiple corporate entities under a single parent organization. This is useful for companies with multiple subsidiaries or divisions.

---

## Subscription and Billing

### What subscription plans are available?

GreenTruth offers several subscription tiers:
- **Basic**: Core compliance and procurement features
- **Professional**: Advanced analytics and integration capabilities
- **Enterprise**: Custom features, dedicated support, and unlimited users

### How do I view or change my subscription?

Administrators can manage subscriptions through:
1. Settings → Billing & Subscription
2. View current plan details
3. Click "Change Plan" to upgrade or downgrade
4. Use "Manage Subscription" to access the Stripe Customer Portal

### What payment methods do you accept?

We accept credit cards and ACH bank transfers through our secure Stripe integration.

### How do I update my payment information?

To update payment information:
1. Go to Settings → Billing & Subscription
2. Click "Update Payment Method"
3. Enter new payment details or select a previously saved method

### What happens if my subscription expires?

If your subscription expires:
1. You'll receive email notifications before expiration
2. Your account will enter a grace period (typically 7 days)
3. After the grace period, access to premium features will be restricted
4. Data is retained for 30 days after expiration

### How do I get a copy of my invoice?

Invoices are available in the billing section:
1. Go to Settings → Billing & Subscription → Billing History
2. Find the invoice you need
3. Click "Download PDF" to save or print the invoice

---

## EAC Management

### What types of Environmental Attribute Certificates (EACs) does GreenTruth support?

GreenTruth supports various EAC types, including:
- Renewable Natural Gas (RNG) credits
- Renewable Energy Certificates (RECs)
- Carbon offsets and credits
- Low Carbon Fuel Standard (LCFS) credits
- Renewable Fuel Standard (RFS) RINs
- Custom/project-specific EACs

### How do I purchase EACs through GreenTruth?

To purchase EACs:
1. Navigate to EAC Registry → Active EACs
2. Browse available EACs or use filters to find specific types
3. Click on an EAC to view details
4. Click "Purchase" and follow the guided process
5. Complete payment using your saved payment method
6. The EAC will be transferred to your wallet upon confirmation

### How do I retire EACs for compliance or voluntary purposes?

To retire EACs:
1. Go to EAC Registry → Wallet
2. Select the EACs you wish to retire
3. Click "Retire Tokens"
4. Enter retirement reason and beneficiary
5. Confirm retirement
6. A retirement certificate will be generated and stored in your account

### How can I validate the authenticity of an EAC or retirement certificate?

To validate an EAC or certificate:
1. Go to EAC Registry → Transactions or Retirement Certificates
2. Find the item you want to validate
3. Click "Verify" to check blockchain validation
4. The system will display validation status, blockchain proof, and verification details

### Can I transfer EACs to another organization?

Yes, you can transfer EACs to other organizations registered on EarnDLT:
1. Go to EAC Registry → Wallet
2. Select the EACs to transfer
3. Click "Transfer"
4. Enter the recipient's wallet address
5. Confirm the transfer
6. Transaction details will be recorded in both organizations' systems

### How are my EACs secured?

Your EACs are secured through:
1. Blockchain-based immutable record-keeping via EarnDLT
2. Multi-signature wallet requirements for transfers
3. Role-based access controls and Segregation of Duties
4. Comprehensive audit logging of all transactions
5. Regular security audits and penetration testing

---

## Procurement and Vendor Management

### How do I create a Request for Proposal (RFP)?

To create an RFP:
1. Go to Procurement → RFPs
2. Click "Create RFP"
3. Follow the multi-step process to define requirements, timeline, and evaluation criteria
4. Select vendors to invite
5. Review and publish the RFP

### How do I find and onboard new vendors?

GreenTruth offers several ways to find and onboard vendors:
1. Vendor Discovery tool uses AI to match vendors to your requirements
2. Manual vendor invitation through email
3. Vendor self-registration through your company portal
4. Import existing vendors from your ERP system

### How does the AI-powered vendor matching work?

Our vendor matching system:
1. Analyzes your RFP/RFI requirements using natural language processing
2. Creates vector embeddings of vendor capabilities and your requirements
3. Performs similarity matching to find vendors with relevant expertise
4. Provides match scores based on multiple factors including sustainability profiles
5. Presents ranked results with rationale for the matches

### How do I evaluate vendor responses?

GreenTruth provides comprehensive tools for vendor evaluation:
1. Side-by-side comparison of responses
2. AI-assisted evaluation highlights
3. Collaborative scoring and commenting
4. Document verification and validation
5. Compliance and sustainability scoring

### Can I integrate my existing procurement system?

Yes, GreenTruth offers several integration options:
1. API-based integration with major ERP systems
2. CSV/Excel import and export functionality
3. Webhook notifications for key events
4. Custom integration services (Enterprise plan)

---

## Compliance and Reporting

### How does GreenTruth help with regulatory compliance?

GreenTruth supports compliance through:
1. Automated compliance verification against regulatory requirements
2. Document management with semantic search
3. Blockchain-verified retirement certificates
4. Audit-ready transaction history and reporting
5. Role-based access control with Segregation of Duties
6. Compliance calendar and notification system

### What types of reports can I generate?

GreenTruth offers various report types:
1. EAC Holdings reports (current positions)
2. Retirement reports for compliance submission
3. Transaction history reports
4. Carbon intensity and emissions reports
5. Vendor performance and sustainability reports
6. Custom reports (Enterprise plan)

### How do I generate a compliance report?

To generate a compliance report:
1. Go to Reports → Generate Report
2. Select the report type
3. Configure parameters (reporting period, scope, format)
4. Click "Generate"
5. The report will be available for download in your specified format

### Can I schedule recurring reports?

Yes, Enterprise customers can schedule recurring reports:
1. Go to Reports → Report Schedule
2. Click "Create Schedule"
3. Select report type and parameters
4. Set frequency (daily, weekly, monthly, quarterly)
5. Specify recipients and delivery method

### How do I share reports with regulators or auditors?

GreenTruth provides several ways to share reports:
1. Direct download and email
2. Secure URL sharing with expiration dates
3. Read-only access for external auditors
4. API access for continuous reporting
5. Direct submission to regulatory portals (where supported)

---

## Security and Access Control

### What is Role-Based Access Control (RBAC)?

RBAC is a security approach that restricts system access based on a user's role. GreenTruth implements RBAC to ensure users only have access to the functionality they need for their specific job responsibilities.

### What is Segregation of Duties (SoD)?

Segregation of Duties is an enterprise security feature that prevents any single user from controlling an entire transaction process. In GreenTruth, SoD ensures that:
1. The person initiating a transaction cannot also approve it
2. The person creating a vendor cannot also approve payments
3. System administrators have limited transaction privileges
4. Critical actions require multi-person approval

### How do I enable Segregation of Duties?

SoD is available as a subscription add-on:
1. Go to Settings → Billing & Subscription
2. Navigate to Add-ons section
3. Enable the SoD feature
4. Configure SoD roles and workflows
5. Assign appropriate roles to users

### What roles are available in the SoD model?

The SoD model includes specialized roles:
1. **Administrator**: User/org/settings management with minimal tx privileges
2. **Treasury**: Initiates transactions, retirements, and transfers
3. **Risk**: Manages vendors and creates token batches
4. **Trader**: Combined Treasury & Risk capabilities
5. **Professional**: 3rd party with vendor management/transaction initiation
6. **Manager**: Approval authority for all actions (requires 2FA)
7. **Analyst**: Read-only access

### How secure is my data in GreenTruth?

GreenTruth implements multiple security measures:
1. End-to-end encryption for all data in transit and at rest
2. Role-based access control and optional Segregation of Duties
3. Multi-factor authentication
4. Regular security audits and penetration testing
5. Comprehensive audit logging
6. SOC 2 Type II certified infrastructure

---

## Technical Integration

### Does GreenTruth offer an API?

Yes, GreenTruth provides a comprehensive REST API for integration with other systems. See our [API Reference](./api-reference.md) for details.

### How do I connect GreenTruth to my ERP system?

GreenTruth offers several ERP integration options:
1. Direct API integration with major ERP systems
2. CSV/Excel import/export functionality
3. Webhook notifications for key events
4. Custom integration services (Enterprise plan)

For detailed integration instructions, see the ERP integration documentation in the Support section.

### Can I use GreenTruth with my existing document management system?

Yes, GreenTruth can integrate with document management systems through:
1. API-based document exchange
2. S3-compatible storage integration
3. Webhook notifications for document updates
4. Document embedding and vectorization for existing documents

### How can I import my existing EAC data?

We offer several options for importing existing EAC data:
1. Bulk import via CSV/Excel templates
2. API-based data migration
3. Direct database migration (for supported systems)
4. Professional services for data migration (Enterprise plan)

### Does GreenTruth integrate with blockchain networks other than EarnDLT?

While EarnDLT is our primary blockchain integration, Enterprise customers can request integration with additional networks:
1. Ethereum-based networks
2. Hyperledger Fabric
3. Custom blockchain implementations

### How do I handle custom workflows or special requirements?

Enterprise customers have several options for customization:
1. Configuration settings for workflow adjustments
2. Custom fields for organization-specific data
3. Webhook system for triggering external processes
4. API for building custom interfaces
5. Professional services for complex customization

---

## Troubleshooting

### I forgot my password. How do I reset it?

To reset your password:
1. On the login page, click "Forgot Password"
2. Enter your email address
3. Check your email for a password reset link
4. Click the link and create a new password

### Why am I getting a "Permission Denied" error?

Permission denied errors typically occur because:
1. Your user role doesn't have the required permissions
2. Segregation of Duties is preventing the action (e.g., you can't approve your own transaction)
3. Your organization's subscription doesn't include this feature
4. Your session has expired

Contact your administrator for role adjustments if needed.

### My transaction is stuck in "pending" status. What should I do?

For pending transactions:
1. Wait 15-30 minutes as blockchain confirmation can take time
2. Check your payment method status if it's a purchase transaction
3. Verify if the transaction requires approval from another user (SoD)
4. Contact support if the issue persists for more than 2 hours

### How do I contact support?

You can contact support through:
1. In-app support chat (click the "?" icon)
2. Email: support@greentruth.com
3. Knowledge Base: help.greentruth.com
4. Emergency hotline: +1-555-123-4567 (Enterprise customers)

### Is there a maintenance schedule I should be aware of?

GreenTruth maintenance is typically scheduled during low-usage periods:
1. Routine maintenance: Sundays 2:00-4:00 AM ET
2. Major updates: Announced 7 days in advance
3. Emergency patching: As needed, with minimal disruption

Check the System Status page for the current maintenance schedule.

---

## Mobile Access

### Is there a mobile app for GreenTruth?

GreenTruth is currently available as a responsive web application that works well on mobile devices. Dedicated mobile apps for iOS and Android are on our product roadmap.

### How do I access GreenTruth on my mobile device?

Access GreenTruth on your mobile device by:
1. Opening your mobile browser
2. Navigating to app.greentruth.com
3. Logging in with your credentials
4. Optionally, adding a shortcut to your home screen for quick access

### What features are available on mobile?

Most GreenTruth features are available on mobile, with some optimizations:
1. Dashboard views adapted for smaller screens
2. Transaction approval workflows
3. Document viewing and basic search
4. Notifications and alerts
5. Basic reporting

Complex operations like RFP creation are better suited for desktop use.

---

## Need more help?

If your question isn't answered here:
1. Check the in-app Knowledge Base for detailed guides
2. Contact your account manager
3. Email support@greentruth.com
4. Schedule a training session (Enterprise customers)
