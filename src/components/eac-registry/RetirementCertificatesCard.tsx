import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Updated certificates data with company association
const RETIREMENT_CERTIFICATES = [
  {
    id: "CERT-12345",
    tokenType: "Natural Gas Production",
    amount: "5,000",
    unit: "MMBtu",
    date: "2023-09-15",
    purpose: "Corporate Carbon Reduction",
    beneficiary: "Acme USA, LLC",
    verifier: "EarnDLT Registry",
    companyId: "acme-usa",
  },
  {
    id: "CERT-12346",
    tokenType: "LNG",
    amount: "3,500",
    unit: "MMBtu",
    date: "2023-10-22",
    purpose: "Voluntary Carbon Offset",
    beneficiary: "Acme USA, LLC",
    verifier: "EarnDLT Registry",
    companyId: "acme-usa",
  },
  {
    id: "CERT-12347",
    tokenType: "Natural Gas Production",
    amount: "8,200",
    unit: "MMBtu",
    date: "2023-11-18",
    purpose: "Corporate ESG Initiative",
    beneficiary: "Acme Corporation",
    verifier: "EarnDLT Registry",
    companyId: "acme-corp",
  },
  {
    id: "CERT-12348",
    tokenType: "Methanol",
    amount: "1,200",
    unit: "kg",
    date: "2023-12-05",
    purpose: "Project Compliance",
    beneficiary: "Acme Energy Marketing, LLC",
    verifier: "EarnDLT Registry",
    companyId: "acme-energy",
  },
  {
    id: "CERT-12349",
    tokenType: "Carbon Credits",
    amount: "2,000",
    unit: "MMBtu",
    date: "2023-11-05",
    purpose: "Project Compliance",
    beneficiary: "Acme Permian Operating, LLC",
    verifier: "EarnDLT Registry",
    companyId: "acme-permian",
  },
  {
    id: "CERT-12350",
    tokenType: "Natural Gas Production",
    amount: "6,500",
    unit: "MMBtu",
    date: "2024-01-12",
    purpose: "Regulatory Compliance",
    beneficiary: "Acme Permian Operating, LLC",
    verifier: "EarnDLT Registry",
    companyId: "acme-permian",
  },
  {
    id: "CERT-12351",
    tokenType: "LNG",
    amount: "4,800",
    unit: "MMBtu",
    date: "2024-02-08",
    purpose: "Corporate Carbon Neutrality",
    beneficiary: "Acme Corporation",
    verifier: "EarnDLT Registry",
    companyId: "acme-corp",
  },
  {
    id: "CERT-12352",
    tokenType: "Methanol",
    amount: "950",
    unit: "kg",
    date: "2024-03-15",
    purpose: "Project Compliance",
    beneficiary: "Acme Energy Marketing, LLC",
    verifier: "EarnDLT Registry",
    companyId: "acme-energy",
  },
];

interface RetirementCertificatesCardProps {
  companyId?: string;
}

const RetirementCertificatesCard = ({
  companyId = "acme-corp",
}: RetirementCertificatesCardProps) => {
  // Filter certificates based on the selected company
  const filteredCertificates = companyId
    ? RETIREMENT_CERTIFICATES.filter((cert) => cert.companyId === companyId)
    : RETIREMENT_CERTIFICATES;

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-emerald-500" />
            <h3 className="text-lg font-medium">Retirement Certificates</h3>
          </div>
          <Badge
            variant="outline"
            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          >
            {filteredCertificates.length} Certificates
          </Badge>
        </div>

        {filteredCertificates.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate ID</TableHead>
                  <TableHead>Token Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.id}</TableCell>
                    <TableCell>{cert.tokenType}</TableCell>
                    <TableCell>
                      {cert.amount} {cert.unit}
                    </TableCell>
                    <TableCell>
                      {new Date(cert.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{cert.purpose}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8 text-center border rounded-md">
            <Award className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <h4 className="font-medium mb-1">No Retirement Certificates</h4>
            <p className="text-sm text-muted-foreground">
              There are no retirement certificates for this corporate entity.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RetirementCertificatesCard;
