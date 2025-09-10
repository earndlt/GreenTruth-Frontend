import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Wallet,
  Award,
  FileBarChart,
  Database,
  Users,
  FileCog,
} from "lucide-react";

// This file is *long* but only because it copies the original tab structure for reusability.
// For true maintainability, extract each tab's content into a dedicated subcomponent.

const ApiTabs: React.FC = () => (
  <Tabs defaultValue="wallet" className="w-full">
    <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
      <TabsTrigger value="wallet" className="flex items-center">
        <Wallet className="mr-2 h-4 w-4" />
        Wallet API
      </TabsTrigger>
      <TabsTrigger value="eac" className="flex items-center">
        <Award className="mr-2 h-4 w-4" />
        EAC Registry
      </TabsTrigger>
      <TabsTrigger value="reporting" className="flex items-center">
        <FileBarChart className="mr-2 h-4 w-4" />
        Reporting
      </TabsTrigger>
      <TabsTrigger value="compliance" className="flex items-center">
        <Database className="mr-2 h-4 w-4" />
        Compliance
      </TabsTrigger>
      <TabsTrigger value="vendors" className="flex items-center">
        <Users className="mr-2 h-4 w-4" />
        Vendors
      </TabsTrigger>
    </TabsList>

    <ScrollArea className="h-[600px] pr-4 rounded-md border">
      <div className="p-4">
        {/* TabsContent for Wallet */}
        <TabsContent value="wallet" className="space-y-6 mt-0">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileCog className="mr-2 h-5 w-5" />
              Wallet Balance API
            </h3>
            <p className="mb-3">
              Access and manage wallet balances across your organization:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Get Wallet Balance</h4>
                <p className="text-sm mb-2">
                  GET /api/v1/wallets/{"{wallet_id}"}/balance
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md font-mono text-sm">
                  <pre>{`// Sample Response
{
  "wallet_id": "0x3a1e9EbA62e1208D030F3280Aa1f560D41C434Df",
  "company_id": "acme_corp",
  "balances": [
    {
      "token_type": "GO",
      "amount": 5000,
      "vintage": "2023",
      "source": "wind",
      "region": "EU"
    },
    {
      "token_type": "REC",
      "amount": 3200,
      "vintage": "2023",
      "source": "solar",
      "region": "North America"
    }
  ],
  "last_updated": "2023-04-10T12:00:00Z"
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Get Transaction History</h4>
                <p className="text-sm mb-2">
                  GET /api/v1/wallets/{"{wallet_id}"}/transactions
                </p>
              </div>

              <div>
                <h4 className="font-medium">Transfer Tokens</h4>
                <p className="text-sm mb-2">
                  POST /api/v1/wallets/{"{wallet_id}"}/transfer
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md font-mono text-sm">
                  <pre>{`// Request Body
{
  "recipient_wallet": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "token_type": "GO",
  "amount": 1000,
  "reference": "Transfer for Q2 compliance"
}`}</pre>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileCog className="mr-2 h-5 w-5" />
              Wallet Management
            </h3>
            <p className="mb-3">Create and manage wallet credentials:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Create Wallet</h4>
                <p className="text-sm mb-2">POST /api/v1/wallets</p>
              </div>

              <div>
                <h4 className="font-medium">Get Wallet Details</h4>
                <p className="text-sm mb-2">
                  GET /api/v1/wallets/{"{wallet_id}"}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        {/* TabsContent for EAC */}
        <TabsContent value="eac" className="space-y-6 mt-0">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileCog className="mr-2 h-5 w-5" />
              EAC Registry API
            </h3>
            <p className="mb-3">
              Manage Energy Attribute Certificates in the registry:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">List Available EACs</h4>
                <p className="text-sm mb-2">GET /api/v1/eac/certificates</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md font-mono text-sm">
                  <pre>{`// Sample Response
{
  "certificates": [
    {
      "id": "EAC-12345",
      "type": "GO",
      "vintage": "2023",
      "source": "wind",
      "region": "EU",
      "quantity": 1000,
      "status": "active"
    },
    {
      "id": "EAC-67890",
      "type": "REC",
      "vintage": "2023",
      "source": "solar",
      "region": "North America",
      "quantity": 500,
      "status": "active"
    }
  ],
  "total": 2,
  "page": 1,
  "page_size": 50
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Get EAC Certificate Details</h4>
                <p className="text-sm mb-2">
                  GET /api/v1/eac/certificates/{"{certificate_id}"}
                </p>
              </div>

              <div>
                <h4 className="font-medium">Retire EAC</h4>
                <p className="text-sm mb-2">
                  POST /api/v1/eac/certificates/{"{certificate_id}"}/retire
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md font-mono text-sm">
                  <pre>{`// Request Body
{
  "retirement_purpose": "scope_2_claims",
  "beneficiary": "Acme Corporation",
  "retirement_details": {
    "reporting_year": 2023,
    "facility_id": "FAC-123",
    "project": "Carbon Neutrality Initiative"
  }
}`}</pre>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileCog className="mr-2 h-5 w-5" />
              EAC Transactions
            </h3>
            <p className="mb-3">Manage and track EAC transactions:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Get Transaction History</h4>
                <p className="text-sm mb-2">GET /api/v1/eac/transactions</p>
              </div>

              <div>
                <h4 className="font-medium">Get Transaction Details</h4>
                <p className="text-sm mb-2">
                  GET /api/v1/eac/transactions/{"{transaction_id}"}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        {/* TabsContent for Reporting */}
        <TabsContent value="reporting" className="space-y-6 mt-0">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileCog className="mr-2 h-5 w-5" />
              Reporting API
            </h3>
            <p className="mb-3">
              Generate and retrieve compliance and emissions reports:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Generate Compliance Report</h4>
                <p className="text-sm mb-2">POST /api/v1/reports/compliance</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md font-mono text-sm">
                  <pre>{`// Request Body
{
  "company_id": "acme_corp",
  "reporting_period": {
    "start_date": "2023-01-01",
    "end_date": "2023-12-31"
  },
  "format": "pdf",
  "include_attachments": true
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Generate Emissions Report</h4>
                <p className="text-sm mb-2">POST /api/v1/reports/emissions</p>
              </div>

              <div>
                <h4 className="font-medium">List Available Reports</h4>
                <p className="text-sm mb-2">GET /api/v1/reports</p>
              </div>

              <div>
                <h4 className="font-medium">Download Report</h4>
                <p className="text-sm mb-2">
                  GET /api/v1/reports/{"{report_id}"}/download
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileCog className="mr-2 h-5 w-5" />
              Report Templates
            </h3>
            <p className="mb-3">Manage report templates:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">List Templates</h4>
                <p className="text-sm mb-2">GET /api/v1/reports/templates</p>
              </div>

              <div>
                <h4 className="font-medium">Create Custom Template</h4>
                <p className="text-sm mb-2">POST /api/v1/reports/templates</p>
              </div>
            </div>
          </div>
        </TabsContent>
        {/* TabsContent for Compliance */}
        <TabsContent value="compliance" className="space-y-6 mt-0">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileCog className="mr-2 h-5 w-5" />
              Compliance API
            </h3>
            <p className="mb-3">Monitor and manage compliance status:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Get Compliance Status</h4>
                <p className="text-sm mb-2">GET /api/v1/compliance/status</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md font-mono text-sm">
                  <pre>{`// Sample Response
{
  "company_id": "acme_corp",
  "compliance_status": {
    "overall": "compliant",
    "categories": [
      {
        "name": "EU ETS",
        "status": "compliant",
        "last_updated": "2023-04-10T12:00:00Z",
        "details": {
          "required_certificates": 5000,
          "current_balance": 5200,
          "surplus": 200
        }
      },
      {
        "name": "US RPS",
        "status": "at_risk",
        "last_updated": "2023-04-05T10:30:00Z",
        "details": {
          "required_certificates": 3000,
          "current_balance": 2800,
          "deficit": 200,
          "deadline": "2023-06-30"
        }
      }
    ]
  }
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Get Compliance Requirements</h4>
                <p className="text-sm mb-2">
                  GET /api/v1/compliance/requirements
                </p>
              </div>

              <div>
                <h4 className="font-medium">Get Compliance History</h4>
                <p className="text-sm mb-2">GET /api/v1/compliance/history</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileCog className="mr-2 h-5 w-5" />
              Compliance Alerts
            </h3>
            <p className="mb-3">Manage compliance alerts and notifications:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Get Active Alerts</h4>
                <p className="text-sm mb-2">GET /api/v1/compliance/alerts</p>
              </div>

              <div>
                <h4 className="font-medium">Configure Alert Settings</h4>
                <p className="text-sm mb-2">
                  PUT /api/v1/compliance/alerts/settings
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        {/* TabsContent for Vendors */}
        <TabsContent value="vendors" className="space-y-6 mt-0">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileCog className="mr-2 h-5 w-5" />
              Vendors API
            </h3>
            <p className="mb-3">Manage vendor relationships and data:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">List Vendors</h4>
                <p className="text-sm mb-2">GET /api/v1/vendors</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md font-mono text-sm">
                  <pre>{`// Sample Response
{
  "vendors": [
    {
      "id": "vendor-123",
      "name": "EcoSource Energy",
      "compliance_status": "compliant",
      "last_updated": "2023-04-10T12:00:00Z",
      "categories": ["energy", "renewables"],
      "tier": 1
    },
    {
      "id": "vendor-456",
      "name": "GreenPower Solutions",
      "compliance_status": "pending_review",
      "last_updated": "2023-04-05T10:30:00Z",
      "categories": ["energy"],
      "tier": 2
    }
  ],
  "total": 2,
  "page": 1,
  "page_size": 50
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Get Vendor Details</h4>
                <p className="text-sm mb-2">
                  GET /api/v1/vendors/{"{vendor_id}"}
                </p>
              </div>

              <div>
                <h4 className="font-medium">Update Vendor</h4>
                <p className="text-sm mb-2">
                  PUT /api/v1/vendors/{"{vendor_id}"}
                </p>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-medium">Sync Vendors with ERP</h4>
                <p className="text-sm mb-2">POST /api/v1/vendors/sync-erp</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md font-mono text-sm">
                  <pre>{`// Request Body
{
  "erp_system": "sap",
  "sync_direction": "bidirectional", // or "push", "pull"
  "sync_fields": ["name", "email", "category", "compliance_status"],
  "filters": {
    "categories": ["energy", "renewables"],
    "updated_since": "2023-01-01T00:00:00Z"
  }
}`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Get ERP Sync Status</h4>
                <p className="text-sm mb-2">GET /api/v1/vendors/sync-status</p>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md font-mono text-sm">
                  <pre>{`// Sample Response
{
  "last_sync": "2023-04-10T12:00:00Z",
  "status": "completed",
  "records_synced": 156,
  "records_failed": 3,
  "erp_system": "sap",
  "next_scheduled_sync": "2023-04-17T12:00:00Z"
}`}</pre>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FileCog className="mr-2 h-5 w-5" />
              Vendor Compliance
            </h3>
            <p className="mb-3">Manage vendor compliance data:</p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Get Vendor Compliance</h4>
                <p className="text-sm mb-2">
                  GET /api/v1/vendors/{"{vendor_id}"}/compliance
                </p>
              </div>

              <div>
                <h4 className="font-medium">Request Vendor Documentation</h4>
                <p className="text-sm mb-2">
                  POST /api/v1/vendors/{"{vendor_id}"}/request-documents
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </ScrollArea>
  </Tabs>
);

export default ApiTabs;
