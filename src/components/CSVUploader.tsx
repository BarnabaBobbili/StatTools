import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileJson } from "lucide-react";
import { showSuccess, showError } from "@/lib/errorHandling";

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
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      let data: number[] = [];
      
      if (fileExtension === 'json') {
        data = parseJSONData(text);
      } else {
        data = parseCSVData(text);
      }
      
      if (data.length === 0) {
        showError("No valid numerical data found in the file", 'validation', 'warning');
        return;
      }

      onDataLoaded(data, file.name);
      showSuccess(
        `File loaded successfully`,
        `${data.length} data points imported from ${file.name}`
      );
    } catch (error) {
      showError(
        `Error reading the file. Please make sure it's a valid ${file.name.endsWith('.json') ? 'JSON' : 'CSV'} file.`,
        'file'
      );
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

  const parseJSONData = (jsonText: string): number[] => {
    try {
      const parsed = JSON.parse(jsonText);
      
      // Handle different JSON structures
      if (Array.isArray(parsed)) {
        // If it's an array of numbers
        if (parsed.every(item => typeof item === 'number')) {
          return parsed;
        }
        // If it's an array of objects with a 'value' or 'data' field
        if (parsed.every(item => typeof item === 'object' && item !== null)) {
          const numbers: number[] = [];
          parsed.forEach(item => {
            const value = item.value ?? item.data ?? item.y ?? item.number;
            if (typeof value === 'number' && !isNaN(value)) {
              numbers.push(value);
            }
          });
          return numbers;
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        // If it's an object with a 'data' or 'values' array
        const dataArray = parsed.data ?? parsed.values ?? parsed.numbers;
        if (Array.isArray(dataArray)) {
          return parseJSONData(JSON.stringify(dataArray));
        }
      }
      
      throw new Error('Unsupported JSON structure');
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Data File
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Upload a CSV or JSON file with numerical data</Label>
          <p className="text-sm text-muted-foreground">
            CSV: Numbers separated by commas, semicolons, or tabs. JSON: Array of numbers or objects with numeric values.
          </p>
        </div>
        
        <Button 
          onClick={triggerFileSelect} 
          variant="outline" 
          className="w-full h-20 border-dashed border-2 hover:border-primary"
        >
          <div className="flex flex-col items-center gap-2">
            <FileJson className="h-8 w-8 text-muted-foreground" />
            <span>Click to select CSV or JSON file</span>
          </div>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt,.json"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-xs text-muted-foreground">
          <p><strong>Supported formats:</strong> .csv, .txt, .json</p>
          <p><strong>CSV example:</strong> 1,2,3,4,5 or one number per line</p>
          <p><strong>JSON example:</strong> [1,2,3,4,5] or {"{"}"data": [1,2,3]{"}"}</p>
        </div>
      </CardContent>
    </Card>
  );
}