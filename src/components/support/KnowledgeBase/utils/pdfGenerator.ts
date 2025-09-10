
import html2pdf from 'html2pdf.js';

export const generatePdf = async (content: HTMLElement, fileName: string) => {
  // Create a deep clone of the content to avoid modifying the original
  const contentClone = content.cloneNode(true) as HTMLElement;
  
  // Add PDF specific styling
  const style = document.createElement('style');
  style.textContent = `
    body {
      font-family: 'Helvetica', Arial, sans-serif;
      line-height: 1.5;
      color: #333;
      padding: 20px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }
    p {
      margin-bottom: 10px;
    }
    section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .grid {
      display: block !important;
    }
    .grid > div {
      margin-bottom: 15px;
      page-break-inside: avoid;
    }
    ul, ol {
      padding-left: 20px;
      margin-bottom: 10px;
    }
    li {
      margin-bottom: 5px;
    }
    .border-t {
      border-top: 1px solid #ddd;
      padding-top: 15px;
      margin-top: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    td, th {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .pdf-tier-table {
      width: 100%;
      border-collapse: collapse;
    }
    .pdf-tier-table td, .pdf-tier-table th {
      padding: 8px;
      vertical-align: top;
    }
    .border {
      border: 1px solid #ddd;
      padding: 10px;
      margin-bottom: 10px;
    }
    .rounded-lg, .rounded-md, .rounded {
      border-radius: 4px;
    }
    .p-4, .p-3 {
      padding: 12px;
    }
    .mb-4, .mb-3, .mb-2, .space-y-4, .space-y-3, .space-y-2 {
      margin-bottom: 16px;
    }
    .bg-muted\\/30, .bg-muted\\/50 {
      background-color: #f5f5f5;
    }
    .text-sm {
      font-size: 14px;
    }
    .text-xs {
      font-size: 12px;
    }
    .font-medium {
      font-weight: 500;
    }
    .font-semibold {
      font-weight: 600;
    }
    .text-muted-foreground {
      color: #555;
    }
    .space-y-1, .space-y-2, .space-y-3, .space-y-4 > * {
      margin-bottom: 8px;
    }
  `;
  contentClone.appendChild(style);

  // Create proper PDF-compatible layout for subscription tiers grid
  const tiersGrids = contentClone.querySelectorAll('.subscription-tiers-grid');
  tiersGrids.forEach(grid => {
    // Create a table that will replace the grid
    const table = document.createElement('table');
    table.className = 'pdf-tier-table';
    
    // Add table header with tier names
    const headerRow = document.createElement('tr');
    const tierNames = ['Basic', 'Pro', 'Team', 'Business', 'Enterprise'];
    
    tierNames.forEach(name => {
      const th = document.createElement('th');
      th.textContent = name;
      headerRow.appendChild(th);
    });
    
    table.appendChild(headerRow);
    
    // Create a row for features
    const featureRow = document.createElement('tr');
    
    // Extract content from each tier div and add to table
    const tierDivs = Array.from(grid.querySelectorAll(':scope > div'));
    tierDivs.forEach(div => {
      const td = document.createElement('td');
      td.innerHTML = div.innerHTML;
      featureRow.appendChild(td);
    });
    
    table.appendChild(featureRow);
    
    // Replace the grid with the table
    grid.parentNode?.insertBefore(table, grid);
    grid.parentNode?.removeChild(grid);
  });

  // Fix grid layout for core features
  const gridContainers = contentClone.querySelectorAll('.grid');
  gridContainers.forEach(grid => {
    Array.from(grid.children).forEach(child => {
      if (child instanceof HTMLElement) {
        child.style.marginBottom = '20px';
        child.style.pageBreakInside = 'avoid';
      }
    });
  });

  // Make sure all content sections are visible
  const sections = contentClone.querySelectorAll('section');
  sections.forEach(section => {
    if (section instanceof HTMLElement) {
      section.style.display = 'block';
      section.style.pageBreakInside = 'avoid';
      section.style.marginBottom = '30px';
    }
  });

  // Ensure lists are properly formatted
  const lists = contentClone.querySelectorAll('ul, ol');
  lists.forEach(list => {
    if (list instanceof HTMLElement) {
      list.style.paddingLeft = '20px';
      list.style.marginBottom = '15px';
    }
  });

  const options = {
    margin: [0.75, 0.75, 0.75, 0.75],
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'], before: '.page-break-before', after: '.page-break-after', avoid: ['img', 'table', 'li'] }
  };

  try {
    await html2pdf().from(contentClone).set(options).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
