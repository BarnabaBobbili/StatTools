import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Check, X, TableIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SpreadsheetDataEntryProps {
  onDataSubmit: (data: number[]) => void;
  initialData?: number[];
  columnName?: string;
}

export function SpreadsheetDataEntry({ 
  onDataSubmit, 
  initialData = [],
  columnName = "Value"
}: SpreadsheetDataEntryProps) {
  // Each row has an id and value
  const [rows, setRows] = useState<{ id: number; value: string }[]>([]);
  const [nextId, setNextId] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Initialize with existing data or empty rows
  useEffect(() => {
    if (initialData.length > 0) {
      setRows(initialData.map((val, idx) => ({ 
        id: idx + 1, 
        value: val.toString() 
      })));
      setNextId(initialData.length + 1);
    } else {
      // Start with 5 empty rows
      setRows(Array.from({ length: 5 }, (_, i) => ({ 
        id: i + 1, 
        value: '' 
      })));
      setNextId(6);
    }
  }, [initialData]);

  // Add a new row
  const addRow = () => {
    setRows([...rows, { id: nextId, value: '' }]);
    setNextId(nextId + 1);
    toast.success("Row added");
  };

  // Delete a row
  const deleteRow = (id: number) => {
    if (rows.length <= 1) {
      toast.error("Must have at least one row");
      return;
    }
    setRows(rows.filter(row => row.id !== id));
    toast.success("Row deleted");
  };

  // Update row value
  const updateRowValue = (id: number, newValue: string) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, value: newValue } : row
    ));
  };

  // Validate and submit data
  const handleSubmit = () => {
    // Filter out empty rows and parse to numbers
    const validNumbers: number[] = [];
    const invalidRows: number[] = [];

    rows.forEach((row, index) => {
      if (row.value.trim() === '') {
        return; // Skip empty rows
      }
      const num = parseFloat(row.value);
      if (isNaN(num)) {
        invalidRows.push(index + 1);
      } else {
        validNumbers.push(num);
      }
    });

    if (invalidRows.length > 0) {
      toast.error(`Invalid numbers in rows: ${invalidRows.join(', ')}`);
      return;
    }

    if (validNumbers.length === 0) {
      toast.error("Please enter at least one valid number");
      return;
    }

    onDataSubmit(validNumbers);
    toast.success(`${validNumbers.length} values submitted`);
  };

  // Clear all data
  const handleClear = () => {
    setRows(Array.from({ length: 5 }, (_, i) => ({ 
      id: nextId + i, 
      value: '' 
    })));
    setNextId(nextId + 5);
    toast.info("Data cleared");
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableIcon className="h-5 w-5" />
          Spreadsheet Data Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Enter numerical data in the table below. Leave rows empty to skip them.
        </div>

        {/* Scrollable table container for mobile */}
        <div className="border rounded-lg overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">#</TableHead>
                <TableHead>{columnName}</TableHead>
                <TableHead className="w-20 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  {/* Row number */}
                  <TableCell className="text-center text-muted-foreground font-medium">
                    {index + 1}
                  </TableCell>
                  
                  {/* Input cell */}
                  <TableCell>
                    <Input
                      type="text"
                      value={row.value}
                      onChange={(e) => updateRowValue(row.id, e.target.value)}
                      onFocus={() => setEditingId(row.id)}
                      onBlur={() => setEditingId(null)}
                      placeholder="Enter number..."
                      className={`
                        ${editingId === row.id ? 'ring-2 ring-primary' : ''} 
                        ${row.value && isNaN(parseFloat(row.value)) ? 'border-destructive' : ''}
                      `}
                    />
                  </TableCell>
                  
                  {/* Delete button */}
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRow(row.id)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete this row</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addRow}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Row
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a new empty row to the table</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear all data and reset to empty rows</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSubmit}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Submit Data
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Validate and submit the entered data for analysis</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Data summary */}
        <div className="text-sm text-muted-foreground">
          {rows.filter(r => r.value.trim() !== '').length} of {rows.length} rows filled
        </div>
      </CardContent>
    </Card>
  );
}
