
# Gas Trace Overview

## Introduction

The Gas Trace feature enables automatic matching of Environmental Attribute Certificates (EACs) with REX and Ruby pipeline contracts using K# identifiers. This integration allows for streamlined verification and transaction processing of environmental attributes associated with natural gas contracts through an intuitive, tabbed interface for improved user experience.

## Key Features

- Real-time validation of K# identifiers and Receipt Location IDs
- Receipt Location ID requirement for REX pipeline contracts
- Multiple emission point selections with counterparty tracking
- Book and claim matching with temporal and geolocation verification
- Both spot and forward orders with flexible delivery scheduling
- Carbon Neutral certification tracking
- Environmental impact metrics integration
- Tabbed interface for search parameters and results
- Streamlined transaction process

## System Architecture

### Components

1. **Contract Validation Service**
   - Validates K# format and existence
   - Validates Receipt Location IDs for REX pipeline
   - Checks contract status and availability
   - Verifies authorized producer status

2. **Counterparty Management**
   - Tracks known counterparties by emission point
   - Auto-populates transportation counterparties
   - Verifies approved counterparty status
   - Supports custom counterparty entry

3. **EAC Matching Engine**
   - Links EACs to valid contracts using book and claim methodology
   - Handles multiple emission points
   - Performs temporal and geolocation matching
   - Validates volume requirements
   - Manages certification status

4. **Transaction Processing**
   - Supports spot and forward transactions
   - Processes delivery schedules
   - Handles payment verification
   - Updates EAC statuses

5. **User Interface Components**
   - Tabbed search and results interface
   - Company selector
   - Counterparty input forms
   - Transaction initiation card
   - Review and confirmation workflow

## Prerequisites

- Active EarnDLT Registry account with API access
- REX or Ruby Pipeline system credentials
- Authorized producer status verification
- Valid payment method configuration
- Receipt Location ID for REX pipeline contracts
