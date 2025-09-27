import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText } from "lucide-react";

interface CSVUploaderProps {
  onDataLoaded: (data: number[], filename?: string) => void;
}

export function CSVUploader({ onDataLoaded }: CSVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = parseCSVData(text);
      
      if (data.length === 0) {
        alert("No valid numerical data found in the CSV file.");
        return;
      }

      onDataLoaded(data, file.name);
    } catch (error) {
      alert("Error reading the CSV file. Please make sure it's a valid CSV file.");
    }
  };

  const parseCSVData = (csvText: string): number[] => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    const numbers: number[] = [];

    lines.forEach(line => {
      // Split by comma, semicolon, or tab
      const values = line.split(/[,;\t]/).map(val => val.trim());
      
      values.forEach(val => {
        // Try to parse as number, skip headers and non-numeric values
        const num = parseFloat(val);
        if (!isNaN(num)) {
          numbers.push(num);
        }
      });
    });

    return numbers;
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload CSV Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Upload a CSV file with numerical data</Label>
          <p className="text-sm text-muted-foreground">
            The file should contain numbers separated by commas, semicolons, or tabs. 
            Headers will be automatically ignored.
          </p>
        </div>
        
        <Button 
          onClick={triggerFileSelect} 
          variant="outline" 
          className="w-full h-20 border-dashed border-2 hover:border-primary"
        >
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <span>Click to select CSV file</span>
          </div>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-xs text-muted-foreground">
          <p><strong>Supported formats:</strong> .csv, .txt</p>
          <p><strong>Example data:</strong> 1,2,3,4,5 or one number per line</p>
        </div>
      </CardContent>
    </Card>
  );
}