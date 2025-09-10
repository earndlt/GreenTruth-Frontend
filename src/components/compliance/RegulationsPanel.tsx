
import React, { useState } from 'react';
import { useRegulations } from '@/context/RegulationsContext';
import { RegulationsDocument } from '@/services/regulationsGovApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Filter, 
  AlertCircle, 
  FileText, 
  Calendar, 
  RefreshCw, 
  ExternalLink 
} from 'lucide-react';
import { format } from 'date-fns';

const RegulationsPanel: React.FC = () => {
  const { documents, loading, lastSync, syncRegulations } = useRegulations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Filter documents based on search term and tab
  const filteredDocuments = documents.filter(doc => {
    // First apply search filter
    const matchesSearch = !searchTerm || 
      doc.attributes.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.attributes.summary && doc.attributes.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    // Then apply tab filter
    if (selectedTab === 'all') return true;
    if (selectedTab === 'active' && doc.attributes.documentType === 'Rule') return true;
    if (selectedTab === 'proposed' && doc.attributes.documentType === 'Proposed Rule') return true;
    if (selectedTab === 'notice' && doc.attributes.documentType === 'Notice') return true;
    
    return false;
  });

  // Handle manual refresh
  const handleRefresh = async () => {
    await syncRegulations(true);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Regulatory Documents</CardTitle>
            <CardDescription>
              Regulations.gov documents relevant to your business
            </CardDescription>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search regulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="active">Active Rules</TabsTrigger>
            <TabsTrigger value="proposed">Proposed Rules</TabsTrigger>
            <TabsTrigger value="notice">Notices</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab}>
            {filteredDocuments.length > 0 ? (
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => (
                    <RegulationItem key={doc.id} document={doc} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
                <h3 className="mt-4 text-lg font-medium">No regulations found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm 
                    ? "Try adjusting your search terms" 
                    : "No regulatory documents matching the selected criteria"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
          {lastSync ? (
            <p>Last updated: {format(new Date(lastSync), 'PPP p')}</p>
          ) : (
            <p>Not yet synchronized with Regulations.gov</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface RegulationItemProps {
  document: RegulationsDocument;
}

const RegulationItem: React.FC<RegulationItemProps> = ({ document }) => {
  // Determine document type badge color
  const getBadgeColor = (docType: string) => {
    switch (docType) {
      case 'Rule':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Proposed Rule':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'Notice':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return '';
    }
  };
  
  // Format publication date
  const formattedDate = document.attributes.publicationDate 
    ? format(new Date(document.attributes.publicationDate), 'PPP')
    : 'N/A';
  
  // Determine if comment period is active
  const hasCommentPeriod = document.attributes.commentStartDate && document.attributes.commentEndDate;
  const commentEndDate = document.attributes.commentEndDate ? new Date(document.attributes.commentEndDate) : null;
  const commentPeriodActive = commentEndDate ? commentEndDate > new Date() : false;
  
  // External link to the document on Regulations.gov
  const externalLink = `https://www.regulations.gov/document/${document.id}`;
  
  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
        <h3 className="font-medium">{document.attributes.title}</h3>
        <Badge className={getBadgeColor(document.attributes.documentType)}>
          {document.attributes.documentType}
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          Published: {formattedDate}
        </div>
        
        <div>Agency: {document.attributes.agencyId}</div>
        
        {document.attributes.frNumber && (
          <div>FR #{document.attributes.frNumber}</div>
        )}
      </div>
      
      {document.attributes.summary && (
        <p className="text-sm mt-2 mb-3 line-clamp-2">{document.attributes.summary}</p>
      )}
      
      <div className="flex justify-between items-center mt-3">
        {hasCommentPeriod && (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs">
              Comments {commentPeriodActive ? 'open until' : 'closed on'} {
                format(new Date(document.attributes.commentEndDate!), 'PPP')
              }
            </span>
          </div>
        )}
        
        <Button size="sm" variant="outline" asChild>
          <a href={externalLink} target="_blank" rel="noopener noreferrer">
            View on Regulations.gov
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default RegulationsPanel;
