import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, FileText, Filter, RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import RegulationsPanel from '@/components/compliance/RegulationsPanel';
import { RegulationsProvider } from '@/context/RegulationsContext';

const Compliance = () => {
  return (
    <RegulationsProvider>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Compliance Monitor</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">Run Compliance Check</Button>
          </div>
        </div>
        
        <RegulationsPanel />
        
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Regulations</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ComplianceRegulationCard 
                title="EPA Clean Air Act Amendments"
                authority="Environmental Protection Agency"
                status="Compliant"
                statusType="success"
                lastChecked="2 hours ago"
              />
              
              <ComplianceRegulationCard 
                title="EU Packaging and Packaging Waste Directive"
                authority="European Commission"
                status="At Risk"
                statusType="warning"
                lastChecked="1 day ago"
              />
              
              <ComplianceRegulationCard 
                title="UNEP Basel Convention"
                authority="United Nations Environment Programme"
                status="Non-Compliant"
                statusType="danger"
                lastChecked="12 hours ago"
              />
              
              <ComplianceRegulationCard 
                title="REACH Regulation"
                authority="European Chemicals Agency"
                status="Compliant"
                statusType="success"
                lastChecked="3 days ago"
              />
              
              <ComplianceRegulationCard 
                title="TSCA - Toxic Substances Control Act"
                authority="Environmental Protection Agency"
                status="Compliant"
                statusType="success"
                lastChecked="1 week ago"
              />
              
              <ComplianceRegulationCard 
                title="Circular Economy Action Plan"
                authority="European Commission"
                status="At Risk"
                statusType="warning"
                lastChecked="4 days ago"
              />
            </div>
            
            <Button variant="outline" className="w-full">Load More</Button>
          </TabsContent>
          
          <TabsContent value="alerts" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Alerts</CardTitle>
                <CardDescription>
                  Recent regulatory changes that may affect your compliance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ComplianceAlertItem 
                    title="New EPA regulation #2023-456 affecting chemical supply chain"
                    description="Regulation introduces stricter requirements for chemical transport and handling, effective January 1, 2024."
                    time="2 hours ago"
                    severity="high"
                  />
                  
                  <ComplianceAlertItem 
                    title="EU-Lex update on carbon reporting standards"
                    description="Updated reporting standards will require additional documentation for carbon emissions and offsets."
                    time="5 hours ago"
                    severity="medium"
                  />
                  
                  <ComplianceAlertItem 
                    title="UNEP compliance report available"
                    description="Annual UNEP compliance report for industrial sectors published with updated benchmarks."
                    time="1 day ago"
                    severity="low"
                  />
                  
                  <ComplianceAlertItem 
                    title="Critical supply chain vulnerability detected"
                    description="Three vendors in your network have been flagged for compliance issues related to recent regulatory changes."
                    time="1 day ago"
                    severity="high"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
                <CardDescription>
                  Generated reports and compliance documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ComplianceReportItem 
                    title="Q3 2023 Compliance Summary"
                    description="Overview of compliance status across all regulations for Q3 2023"
                    date="Sep 30, 2023"
                    type="summary"
                  />
                  
                  <ComplianceReportItem 
                    title="Annual EPA Submission"
                    description="Annual compliance report submitted to the Environmental Protection Agency"
                    date="Aug 15, 2023"
                    type="submission"
                  />
                  
                  <ComplianceReportItem 
                    title="EU Chemical Registration Audit"
                    description="Internal audit of EU chemical registration compliance"
                    date="Jul 22, 2023"
                    type="audit"
                  />
                  
                  <ComplianceReportItem 
                    title="Supply Chain Risk Assessment"
                    description="Assessment of compliance risks in the current supply chain"
                    date="Jun 10, 2023"
                    type="assessment"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RegulationsProvider>
  );
};

interface ComplianceRegulationCardProps {
  title: string;
  authority: string;
  status: string;
  statusType: 'success' | 'warning' | 'danger';
  lastChecked: string;
}

const ComplianceRegulationCard = ({
  title,
  authority,
  status,
  statusType,
  lastChecked,
}: ComplianceRegulationCardProps) => {
  const statusColor = {
    success: 'bg-green-500 hover:bg-green-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    danger: 'bg-destructive hover:bg-destructive/90',
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{authority}</p>
          </div>
          <Badge className={statusColor[statusType]}>{status}</Badge>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Last checked: {lastChecked}</span>
          <Button variant="ghost" size="sm">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ComplianceAlertItemProps {
  title: string;
  description: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
}

const ComplianceAlertItem = ({
  title,
  description,
  time,
  severity,
}: ComplianceAlertItemProps) => {
  const severityIcon = {
    high: <AlertTriangle className="h-5 w-5 text-destructive" />,
    medium: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    low: <AlertTriangle className="h-5 w-5 text-green-500" />,
  };
  
  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg">
      <div className="mt-0.5">
        {severityIcon[severity]}
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-muted-foreground">{time}</span>
          <Button variant="ghost" size="sm">View Details</Button>
        </div>
      </div>
    </div>
  );
};

interface ComplianceReportItemProps {
  title: string;
  description: string;
  date: string;
  type: 'summary' | 'submission' | 'audit' | 'assessment';
}

const ComplianceReportItem = ({
  title,
  description,
  date,
  type,
}: ComplianceReportItemProps) => {
  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg">
      <div className="mt-0.5">
        <FileText className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-1 flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-muted-foreground">Generated: {date}</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Download</Button>
            <Button variant="ghost" size="sm">View</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
