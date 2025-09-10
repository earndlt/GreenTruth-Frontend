
import React from 'react';
import { Link } from 'react-router-dom';
import { File } from 'lucide-react';

const DocumentationSidebar: React.FC = () => {
  return (
    <div className="sticky top-24 space-y-2">
      <h3 className="font-medium mb-2">Documents</h3>
      <ul className="space-y-1">
        <li>
          <Link 
            to="/docs/k-number-match"
            className="flex items-center p-2 text-sm hover:bg-muted rounded-md"
          >
            <File className="h-4 w-4 mr-2" />
            K# Match Documentation
          </Link>
        </li>
        <li>
          <Link 
            to="/docs/k-number-match/overview"
            className="flex items-center p-2 text-sm hover:bg-muted rounded-md"
          >
            <File className="h-4 w-4 mr-2" />
            Overview
          </Link>
        </li>
        <li>
          <Link 
            to="/docs/k-number-match/best-practices"
            className="flex items-center p-2 text-sm hover:bg-muted rounded-md"
          >
            <File className="h-4 w-4 mr-2" />
            Best Practices
          </Link>
        </li>
        <li>
          <Link 
            to="/docs/k-number-match/troubleshooting"
            className="flex items-center p-2 text-sm hover:bg-muted rounded-md"
          >
            <File className="h-4 w-4 mr-2" />
            Troubleshooting
          </Link>
        </li>
        <li>
          <Link 
            to="/docs/k-number-match/error-handling"
            className="flex items-center p-2 text-sm hover:bg-muted rounded-md"
          >
            <File className="h-4 w-4 mr-2" />
            Error Handling
          </Link>
        </li>
        <li>
          <Link 
            to="/docs/k-number-match/monitoring"
            className="flex items-center p-2 text-sm hover:bg-muted rounded-md"
          >
            <File className="h-4 w-4 mr-2" />
            Monitoring
          </Link>
        </li>
        <li>
          <Link 
            to="/docs/k-number-match/integration-guide"
            className="flex items-center p-2 text-sm hover:bg-muted rounded-md"
          >
            <File className="h-4 w-4 mr-2" />
            Integration Guide
          </Link>
        </li>
        <li>
          <Link 
            to="/docs/admin-backend"
            className="flex items-center p-2 text-sm hover:bg-muted rounded-md"
          >
            <File className="h-4 w-4 mr-2" />
            Admin Backend
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DocumentationSidebar;
