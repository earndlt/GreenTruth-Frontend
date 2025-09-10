
import { v4 as uuidv4 } from 'uuid';
import { VendorContact } from '../types';

export const parseCSV = (text: string): Array<{name: string, businessName: string, email: string}> => {
  console.log("Parsing CSV content:", text.substring(0, 100) + "...");
  
  // Split the CSV into lines and remove any empty lines
  const lines = text.split('\n').filter(line => line.trim() !== '');
  console.log("Found lines:", lines.length);
  
  if (lines.length === 0) {
    throw new Error('The CSV file appears to be empty.');
  }
  
  // The first line should be the header
  const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
  console.log("Found headers:", headers);
  
  // Find the indices of the required columns
  const nameIndex = headers.findIndex(h => h.includes('name') && !h.includes('business'));
  const businessIndex = headers.findIndex(h => h.includes('business') || h.includes('company'));
  const emailIndex = headers.findIndex(h => h.includes('email'));
  
  console.log("Column indices - name:", nameIndex, "business:", businessIndex, "email:", emailIndex);
  
  if (nameIndex === -1 || businessIndex === -1 || emailIndex === -1) {
    throw new Error('CSV format is incorrect. Please use the provided template.');
  }
  
  // Parse the data lines (skip the header)
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    return {
      name: values[nameIndex],
      businessName: values[businessIndex],
      email: values[emailIndex]
    };
  }).filter(contact => contact.name && contact.businessName && contact.email);
};

export const createExcelTemplate = (): Blob => {
  console.log("Creating CSV template");
  // Create CSV content for the template
  const headers = "Contact Name,Business Name,Email\n";
  const exampleRow = "John Doe,Acme Corp,john@example.com\n";
  const csvContent = headers + exampleRow;
  
  console.log("Template content:", csvContent);
  
  // Create a Blob with the CSV content
  return new Blob([csvContent], { type: 'text/csv' });
};

export const createVendorContactsFromFile = (
  file: File, 
  currentContacts: VendorContact[]
): Promise<VendorContact[]> => {
  console.log("Processing file:", file.name, file.type, file.size);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        console.log("File read successful");
        
        // Verify it's a CSV file
        const extension = file.name.split('.').pop()?.toLowerCase();
        console.log("File extension:", extension);
        
        if (extension !== 'csv') {
          reject(new Error("Only CSV files are supported."));
          return;
        }
        
        const content = e.target?.result as string;
        console.log("Content length:", content.length);
        
        const contacts = parseCSV(content);
        console.log("Parsed contacts:", contacts.length);
        
        if (contacts.length === 0) {
          reject(new Error("No valid contacts found in the file."));
          return;
        }
        
        // Add each contact from the file
        const newContacts = contacts.map(contact => ({
          ...contact,
          id: uuidv4()
        }));
        
        console.log("Created new contacts:", newContacts.length);
        
        resolve([...currentContacts, ...newContacts]);
      } catch (error) {
        console.error("Error processing file:", error);
        reject(error);
      }
    };
    
    reader.onerror = (e) => {
      console.error("File read error:", e);
      reject(new Error("An error occurred while reading the file."));
    };
    
    console.log("Starting file read");
    reader.readAsText(file);
  });
};
