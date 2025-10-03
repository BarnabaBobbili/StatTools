import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ExportToolsProps {
  // Data to export
  data: number[];
  // Statistics to include in report
  stats?: Record<string, number | string>;
  // Chart element ID for screenshot
  chartElementId?: string;
  // Title for the report
  reportTitle?: string;
}

export function ExportTools({ 
  data, 
  stats = {}, 
  chartElementId,
  reportTitle = "Statistical Analysis Report" 
}: ExportToolsProps) {

  // Export data as CSV
  const exportCSV = () => {
    try {
      // Create CSV content
      let csvContent = "Index,Value\n";
      data.forEach((value, index) => {
        csvContent += `${index + 1},${value}\n`;
      });

      // If stats provided, add them at the end
      if (Object.keys(stats).length > 0) {
        csvContent += "\n\nStatistics\n";
        csvContent += "Metric,Value\n";
        Object.entries(stats).forEach(([key, value]) => {
          csvContent += `${key},${value}\n`;
        });
      }

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportTitle.replace(/\s/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error("Failed to export CSV");
      console.error("CSV export error:", error);
    }
  };

  // Export full report as PDF with chart screenshot
  const exportPDF = async () => {
    try {
      toast.info("Generating PDF... Please wait");

      // Create new PDF document (A4 size)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Add title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(reportTitle, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Add date
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      pdf.text(`Generated on: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Add statistics section if provided
      if (Object.keys(stats).length > 0) {
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Summary Statistics", 20, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        
        // Display stats in two columns
        const statsEntries = Object.entries(stats);
        const midpoint = Math.ceil(statsEntries.length / 2);
        
        for (let i = 0; i < midpoint; i++) {
          const [key1, value1] = statsEntries[i];
          const stat1Text = `${key1}: ${typeof value1 === 'number' ? value1.toFixed(4) : value1}`;
          pdf.text(stat1Text, 20, yPosition);
          
          // Second column if exists
          if (i + midpoint < statsEntries.length) {
            const [key2, value2] = statsEntries[i + midpoint];
            const stat2Text = `${key2}: ${typeof value2 === 'number' ? value2.toFixed(4) : value2}`;
            pdf.text(stat2Text, pageWidth / 2 + 10, yPosition);
          }
          
          yPosition += 6;
        }
        yPosition += 10;
      }

      // Capture chart if element ID provided
      if (chartElementId) {
        const chartElement = document.getElementById(chartElementId);
        
        if (chartElement) {
          try {
            // Capture chart as canvas
            const canvas = await html2canvas(chartElement, {
              scale: 2,
              backgroundColor: '#ffffff',
              logging: false,
            });

            // Convert canvas to image
            const imgData = canvas.toDataURL('image/png');
            
            // Calculate dimensions to fit on page
            const imgWidth = pageWidth - 40; // 20mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Check if we need a new page
            if (yPosition + imgHeight > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }

            // Add chart image
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text("Visualization", 20, yPosition);
            yPosition += 8;
            
            pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 10;
          } catch (error) {
            console.error("Chart capture error:", error);
            toast.error("Could not capture chart, continuing with PDF...");
          }
        }
      }

      // Add data table (first 50 rows to avoid overflow)
      if (yPosition + 60 > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Data Sample (First 50 values)", 20, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      
      const maxRows = Math.min(data.length, 50);
      const rowsPerColumn = 25;
      
      for (let i = 0; i < rowsPerColumn && i < maxRows; i++) {
        pdf.text(`${i + 1}. ${data[i].toFixed(4)}`, 20, yPosition);
        
        // Second column
        if (i + rowsPerColumn < maxRows) {
          pdf.text(`${i + rowsPerColumn + 1}. ${data[i + rowsPerColumn].toFixed(4)}`, pageWidth / 2 + 10, yPosition);
        }
        
        yPosition += 5;
      }

      if (data.length > 50) {
        yPosition += 3;
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "italic");
        pdf.text(`... and ${data.length - 50} more values`, 20, yPosition);
      }

      // Add footer
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "italic");
      pdf.text("Generated by StatTools - Statistical Analysis Platform", pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save PDF
      pdf.save(`${reportTitle.replace(/\s/g, '_')}.pdf`);
      toast.success("PDF report exported successfully");
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error("PDF export error:", error);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Export your data and analysis results in various formats
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* CSV Export */}
          <Button
            variant="outline"
            onClick={exportCSV}
            className="gap-2 h-auto py-4 flex-col"
          >
            <FileText className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Export CSV</div>
              <div className="text-xs text-muted-foreground">Data + Statistics</div>
            </div>
          </Button>

          {/* PDF Export */}
          <Button
            variant="outline"
            onClick={exportPDF}
            className="gap-2 h-auto py-4 flex-col"
          >
            <FileText className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Export PDF</div>
              <div className="text-xs text-muted-foreground">Full Report with Chart</div>
            </div>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>CSV:</strong> Tabular data format, compatible with Excel and spreadsheet software</p>
          <p><strong>PDF:</strong> Complete report with statistics, charts, and data table</p>
        </div>
      </CardContent>
    </Card>
  );
}
