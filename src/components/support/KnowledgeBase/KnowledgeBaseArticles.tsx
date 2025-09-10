
import React from "react";
import { Code, Shield, Users, User, Zap, BookOpen, Hash, Info, DollarSign, ShieldCheck, TrendingUp, Search, Map } from 'lucide-react';
import IntegrationHubAccessArticle from './IntegrationHubAccessArticle';
import RbacAndSodArticle from './RbacAndSodArticle';
import IntegrationHubZapierArticle from './IntegrationHubZapierArticle';
import VendorIdStandardArticle from './VendorIdStandardArticle';
import GreenTruthOverviewArticle from './GreenTruthOverviewArticle';
import TransactionClearingArticle from './TransactionClearingArticle';
import KycVerificationArticle from './KycVerificationArticle';
import EacTransactionStructureArticle from './EacTransactionStructureArticle';
import VendorDiscoveryArticle from './VendorDiscoveryArticle';
import KNumberMatchArticle from './KNumberMatchArticle';
import PipelineMapArticle from './PipelineMapArticle';

export const articles = [
  {
    title: "GreenTruth Platform Overview",
    url: null,
    content: <GreenTruthOverviewArticle />,
    icon: <Info className="h-3 w-3 text-primary mr-1" />,
  },
  {
    title: "Vendor Discovery & RFI Process",
    url: null,
    content: <VendorDiscoveryArticle />,
    icon: <Search className="h-3 w-3 text-primary mr-1" />,
  },
  {
    title: "EAC Transaction Structures (Spot & Forward)",
    url: null,
    content: <EacTransactionStructureArticle />,
    icon: <TrendingUp className="h-3 w-3 text-primary mr-1" />,
  },
  {
    title: "Transaction Clearing & Payment Processing",
    url: null,
    content: <TransactionClearingArticle />,
    icon: <DollarSign className="h-3 w-3 text-primary mr-1" />,
  },
  {
    title: "Entity Verification & KYC Process",
    url: null,
    content: <KycVerificationArticle />,
    icon: <ShieldCheck className="h-3 w-3 text-primary mr-1" />,
  },
  {
    title: "Integration Hub Access",
    url: null,
    content: <IntegrationHubAccessArticle />,
    icon: <Code className="h-3 w-3 text-primary mr-1" />,
  },
  {
    title: "Connect Integration Hub to Zapier & Automate Workflows",
    url: null,
    content: <IntegrationHubZapierArticle />,
    icon: <Zap className="h-3 w-3 text-yellow-500 mr-1" />,
  },
  {
    title: "Understanding Role-Based Access Control (RBAC) & Segregation of Duties (SoD)",
    url: null,
    content: <RbacAndSodArticle />,
    icon: <Shield className="h-3 w-3 text-primary mr-1" />,
  },
  {
    title: "Vendor ID Assignment Standard",
    url: null,
    content: <VendorIdStandardArticle />,
    icon: <Hash className="h-3 w-3 text-primary mr-1" />,
  },
  {
            title: "Gas Trace Guide",
    url: null,
    content: <KNumberMatchArticle />,
    icon: <Hash className="h-3 w-3 text-primary mr-1" />,
  },
  {
    title: "EAC EAC Map: Visual Discovery Tool",
    url: null,
    content: <PipelineMapArticle />,
    icon: <Map className="h-3 w-3 text-primary mr-1" />,
  },
  {
    title: 'Getting Started with GreenTruth',
    url: 'https://yourdomain.hubspot.com/knowledge/getting-started-with-greentruth',
    icon: <Users className="h-3 w-3" />,
  },
  {
    title: 'Managing EAC Certificates',
    url: 'https://yourdomain.hubspot.com/knowledge/managing-eac-certificates',
    icon: <User className="h-3 w-3" />,
  },
  {
    title: 'Understanding Compliance Reports',
    url: 'https://yourdomain.hubspot.com/knowledge/understanding-compliance-reports',
    icon: <Shield className="h-3 w-3" />,
  },
  {
    title: 'Vendor Management Best Practices',
    url: 'https://yourdomain.hubspot.com/knowledge/vendor-management-best-practices',
    icon: <Users className="h-3 w-3" />,
  },
];
