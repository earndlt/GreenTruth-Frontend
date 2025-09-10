
// Function to fetch markdown content from the docs directory
export const fetchDocumentationContent = async (docPath: string): Promise<string> => {
  console.log("Attempting to fetch documentation for:", docPath);
  
  // First check if the docPath is empty and set to default
  const path = docPath || 'k-number-match';
  
  try {
    // We'll try multiple approaches to find the content
    let content;
    
    // First try exact path match
    try {
      content = await import(`../../../../docs/${path}.md?raw`);
      console.log("Found exact match file");
      return content.default;
    } catch (err) {
      console.log("No exact match, trying directory/index");
      
      // Try directory/index.md
      try {
        content = await import(`../../../../docs/${path}/index.md?raw`);
        console.log("Found directory index file");
        return content.default;
      } catch (err2) {
        console.log("No directory index either, trying just path");
        
        // Try just the path without .md extension
        try {
          content = await import(`../../../../docs/${path}?raw`);
          console.log("Found path without extension");
          return content.default;
        } catch (err3) {
          console.log("All attempts failed");
          throw new Error("Documentation not found");
        }
      }
    }
  } catch (error) {
    console.error("Error loading documentation:", error);
    throw error;
  }
};
