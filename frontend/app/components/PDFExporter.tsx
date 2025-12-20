'use client';

import { Download } from 'lucide-react';

interface PDFExporterProps {
  title: string;
  content: any;
  filename: string;
  type: 'predictions' | 'compatibility' | 'face-reading' | 'palmistry';
}

export default function PDFExporter({ title, content, filename, type }: PDFExporterProps) {
  const generatePDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download PDF');
      return;
    }

    let htmlContent = '';

    // Generate HTML based on type
    if (type === 'predictions') {
      htmlContent = generatePredictionsHTML(content);
    } else if (type === 'compatibility') {
      htmlContent = generateCompatibilityHTML(content);
    } else if (type === 'face-reading') {
      htmlContent = generateFaceReadingHTML(content);
    } else if (type === 'palmistry') {
      htmlContent = generatePalmistryHTML(content);
    }

    // Write HTML to print window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #1a202c;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #667eea;
              padding-bottom: 20px;
            }
            .header h1 {
              font-size: 32px;
              color: #667eea;
              margin-bottom: 8px;
            }
            .header p {
              color: #718096;
              font-size: 14px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 20px;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e2e8f0;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              margin-bottom: 20px;
            }
            .info-item {
              padding: 12px;
              background: #f7fafc;
              border-radius: 8px;
              border-left: 4px solid #667eea;
            }
            .info-label {
              font-size: 12px;
              color: #718096;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .info-value {
              font-size: 16px;
              font-weight: 600;
              color: #2d3748;
            }
            .prediction-card {
              background: #f7fafc;
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 16px;
              border-left: 4px solid #667eea;
            }
            .prediction-title {
              font-size: 18px;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 8px;
            }
            .prediction-date {
              font-size: 14px;
              color: #718096;
              margin-bottom: 12px;
            }
            .prediction-content {
              font-size: 14px;
              line-height: 1.6;
              color: #4a5568;
            }
            .score-badge {
              display: inline-block;
              padding: 8px 16px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 20px;
              font-size: 24px;
              font-weight: 700;
              margin: 16px 0;
            }
            .trait-list {
              list-style: none;
            }
            .trait-item {
              padding: 12px;
              background: #f7fafc;
              border-radius: 8px;
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .trait-name {
              font-weight: 600;
              color: #2d3748;
            }
            .trait-value {
              color: #667eea;
              font-weight: 600;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e2e8f0;
              text-align: center;
              color: #718096;
              font-size: 12px;
            }
            @media print {
              body {
                background: white;
              }
              .container {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}</h1>
              <p>Generated on ${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            ${htmlContent}
            <div class="footer">
              <p>© ${new Date().getFullYear()} AstroAI - Your Cosmic Journey Platform</p>
              <p>This report is for personal use only. Generated with advanced AI algorithms.</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Trigger print dialog
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const generatePredictionsHTML = (predictions: any[]) => {
    if (!predictions || predictions.length === 0) {
      return '<p>No predictions available to export.</p>';
    }

    return `
      <div class="section">
        <h2 class="section-title">Your Cosmic Predictions (${predictions.length} Total)</h2>
        ${predictions.map(pred => `
          <div class="prediction-card">
            <div class="prediction-title">${pred.title || 'Prediction'}</div>
            <div class="prediction-date">
              ${pred.date ? new Date(pred.date).toLocaleDateString() : 
                pred.year ? `Year ${pred.year}` : 'Date Unknown'}
            </div>
            <div class="prediction-content">
              ${pred.description || pred.prediction || 'No description available'}
            </div>
            ${pred.probability ? `
              <div style="margin-top: 12px;">
                <span style="color: #667eea; font-weight: 600;">Probability: ${pred.probability}%</span>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  };

  const generateCompatibilityHTML = (data: any) => {
    if (!data) {
      return '<p>No compatibility data available to export.</p>';
    }

    return `
      <div class="section">
        <h2 class="section-title">Compatibility Analysis</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Person 1</div>
            <div class="info-value">${data.person1?.name || 'Unknown'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Person 2</div>
            <div class="info-value">${data.person2?.name || 'Unknown'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Analysis Type</div>
            <div class="info-value">${data.type === 'vedic' ? 'Vedic Kundali Milan' : 'Western Synastry'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date</div>
            <div class="info-value">${new Date(data.timestamp || Date.now()).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      <div class="section" style="text-align: center;">
        <h2 class="section-title">Compatibility Score</h2>
        <div class="score-badge">${data.score || 0}/100</div>
        <p style="color: #718096; margin-top: 8px;">
          ${data.score >= 80 ? 'Excellent Match' : 
            data.score >= 60 ? 'Good Compatibility' : 
            data.score >= 40 ? 'Moderate Compatibility' : 'Challenging Match'}
        </p>
      </div>

      ${data.analysis ? `
        <div class="section">
          <h2 class="section-title">Detailed Analysis</h2>
          <div style="background: #f7fafc; padding: 20px; border-radius: 12px; line-height: 1.6;">
            ${data.analysis}
          </div>
        </div>
      ` : ''}
    `;
  };

  const generateFaceReadingHTML = (data: any) => {
    if (!data) {
      return '<p>No face reading data available to export.</p>';
    }

    return `
      <div class="section">
        <h2 class="section-title">Face Reading Analysis</h2>
        <p style="color: #718096; margin-bottom: 20px;">
          Analysis Date: ${new Date(data.timestamp || Date.now()).toLocaleDateString()}
        </p>
      </div>

      ${data.traits && data.traits.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Personality Traits</h2>
          <ul class="trait-list">
            ${data.traits.map((trait: any) => `
              <li class="trait-item">
                <span class="trait-name">${trait.name || trait}</span>
                ${trait.value ? `<span class="trait-value">${trait.value}%</span>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      ${data.personality ? `
        <div class="section">
          <h2 class="section-title">Personality Overview</h2>
          <div style="background: #f7fafc; padding: 20px; border-radius: 12px; line-height: 1.6;">
            ${data.personality}
          </div>
        </div>
      ` : ''}

      ${data.analysis ? `
        <div class="section">
          <h2 class="section-title">Detailed Analysis</h2>
          <div style="background: #f7fafc; padding: 20px; border-radius: 12px; line-height: 1.6;">
            ${data.analysis}
          </div>
        </div>
      ` : ''}
    `;
  };

  const generatePalmistryHTML = (data: any) => {
    if (!data) {
      return '<p>No palmistry data available to export.</p>';
    }

    return `
      <div class="section">
        <h2 class="section-title">Palmistry Reading</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Hand</div>
            <div class="info-value">${data.hand || 'Not specified'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Analysis Date</div>
            <div class="info-value">${new Date(data.timestamp || Date.now()).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      ${data.lines && Object.keys(data.lines).length > 0 ? `
        <div class="section">
          <h2 class="section-title">Major Lines</h2>
          <ul class="trait-list">
            ${Object.entries(data.lines).map(([line, details]: [string, any]) => `
              <li class="trait-item">
                <span class="trait-name">${line.replace(/([A-Z])/g, ' $1').trim()}</span>
                ${details.strength ? `<span class="trait-value">${details.strength}</span>` : ''}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      ${data.interpretation ? `
        <div class="section">
          <h2 class="section-title">Interpretation</h2>
          <div style="background: #f7fafc; padding: 20px; border-radius: 12px; line-height: 1.6;">
            ${data.interpretation}
          </div>
        </div>
      ` : ''}

      ${data.analysis ? `
        <div class="section">
          <h2 class="section-title">Detailed Analysis</h2>
          <div style="background: #f7fafc; padding: 20px; border-radius: 12px; line-height: 1.6;">
            ${data.analysis}
          </div>
        </div>
      ` : ''}
    `;
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg hover:shadow-emerald-500/30"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Export PDF</span>
      <span className="sm:hidden">PDF</span>
    </button>
  );
}
