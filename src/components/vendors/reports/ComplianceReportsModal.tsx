import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplianceReport } from '../types/reportTypes';
import { getVendorComplianceReports } from '../data/complianceReports';
import { FileText, Check, AlertTriangle, FileBarChart, FileCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ComplianceReportsModalProps {
  open: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
}

const ComplianceReportsModal: React.FC<ComplianceReportsModalProps> = ({
  open,
  onClose,
  vendorId,
  vendorName,
}) => {
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const reports = getVendorComplianceReports(vendorId);

  const handleViewReport = (report: ComplianceReport) => {
    setSelectedReport(report);
  };

  const handleBackToList = () => {
    setSelectedReport(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reviewed':
        return <Badge className="bg-green-500">Reviewed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending Review</Badge>;
      case 'flagged':
        return <Badge className="bg-red-500">Flagged</Badge>;
      default:
        return null;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <Badge className="bg-green-500">Positive</Badge>;
      case 'neutral':
        return <Badge className="bg-blue-500">Neutral</Badge>;
      case 'negative':
        return <Badge className="bg-red-500">Negative</Badge>;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedReport ? (
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={handleBackToList} className="mr-2">
                  ← Back
                </Button>
                {selectedReport.title}
              </div>
            ) : (
              <div className="flex items-center">
                <FileBarChart className="mr-2 h-5 w-5" />
                Compliance Reports - {vendorName}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {!selectedReport ? (
          <div className="space-y-4">
            {reports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Product Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono">{report.transactionId}</TableCell>
                      <TableCell>{report.eacType}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-full bg-muted rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                report.overallScore >= 85
                                  ? 'bg-green-500'
                                  : report.overallScore >= 70
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${report.overallScore}%` }}
                            ></div>
                          </div>
                          <span className={getScoreColor(report.overallScore)}>
                            {report.overallScore}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(report)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-8">
                <FileBarChart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Compliance Reports</h3>
                <p className="text-muted-foreground mt-2">
                  There are no compliance reports available for this vendor yet.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Report Overview</CardTitle>
                    <CardDescription>Compliance report for {selectedReport.eacType} EACs</CardDescription>
                  </div>
                  {getStatusBadge(selectedReport.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-sm">{selectedReport.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">EAC Quantity</p>
                    <p>{selectedReport.eacQuantity.toLocaleString()} tokens</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">EAC Type</p>
                    <p>{selectedReport.eacType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date Generated</p>
                    <p>{selectedReport.date}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Overall Compliance Score</p>
                  <div className="flex items-center">
                    <div className="w-full bg-muted rounded-full h-3 mr-3">
                      <div
                        className={`h-3 rounded-full ${
                          selectedReport.overallScore >= 85
                            ? 'bg-green-500'
                            : selectedReport.overallScore >= 70
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedReport.overallScore}%` }}
                      ></div>
                    </div>
                    <span className={`text-xl font-semibold ${getScoreColor(selectedReport.overallScore)}`}>
                      {selectedReport.overallScore}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="esg">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="esg">ESG Policy Match</TabsTrigger>
                <TabsTrigger value="procurement">Procurement Policy</TabsTrigger>
                <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
              </TabsList>

              <TabsContent value="esg" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>ESG Policy Alignment</CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-semibold ${getScoreColor(selectedReport.esgPolicyMatch.score)}`}>
                          {selectedReport.esgPolicyMatch.score}%
                        </span>
                        {getImpactBadge(selectedReport.esgPolicyMatch.impact)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      {selectedReport.esgPolicyMatch.impact === 'positive'
                        ? 'This delivery exceeds your ESG policy requirements for this product category.'
                        : selectedReport.esgPolicyMatch.impact === 'neutral'
                        ? 'This delivery meets the minimum requirements of your ESG policy.'
                        : 'This delivery has some concerns regarding your ESG policy requirements.'}
                    </p>

                    <h4 className="text-sm font-medium mb-2">Key Observations</h4>
                    <ul className="space-y-2">
                      {selectedReport.esgPolicyMatch.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-0.5 text-muted-foreground">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="procurement" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Procurement Policy Alignment</CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-semibold ${getScoreColor(selectedReport.procurementPolicyMatch.score)}`}>
                          {selectedReport.procurementPolicyMatch.score}%
                        </span>
                        {getImpactBadge(selectedReport.procurementPolicyMatch.impact)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      {selectedReport.procurementPolicyMatch.impact === 'positive'
                        ? 'This vendor and transaction align strongly with your procurement policies.'
                        : selectedReport.procurementPolicyMatch.impact === 'neutral'
                        ? 'This vendor and transaction meet standard procurement requirements.'
                        : 'This vendor and transaction have some procurement policy concerns.'}
                    </p>

                    <h4 className="text-sm font-medium mb-2">Key Observations</h4>
                    <ul className="space-y-2">
                      {selectedReport.procurementPolicyMatch.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-0.5 text-muted-foreground">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sustainability" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Sustainability Policy Alignment</CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-semibold ${getScoreColor(selectedReport.sustainabilityPolicyMatch.score)}`}>
                          {selectedReport.sustainabilityPolicyMatch.score}%
                        </span>
                        {getImpactBadge(selectedReport.sustainabilityPolicyMatch.impact)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      {selectedReport.sustainabilityPolicyMatch.impact === 'positive'
                        ? 'This delivery significantly contributes to your sustainability goals.'
                        : selectedReport.sustainabilityPolicyMatch.impact === 'neutral'
                        ? 'This delivery maintains your current sustainability metrics.'
                        : 'This delivery may negatively impact your sustainability metrics.'}
                    </p>

                    <h4 className="text-sm font-medium mb-2">Key Observations</h4>
                    <ul className="space-y-2">
                      {selectedReport.sustainabilityPolicyMatch.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-0.5 text-muted-foreground">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="outline">
                <FileCheck className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {selectedReport.status !== 'reviewed' && (
                <Button>
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Reviewed
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ComplianceReportsModal;
