import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { saveAnalysis } from "@/lib/storage";
import { showSuccess, showError } from "@/lib/errorHandling";
import { useAuth } from "@/hooks/useAuth";

interface SaveAnalysisDialogProps {
  analysisType: string;
  data: any;
  results: any;
}

export function SaveAnalysisDialog({
  analysisType,
  data,
  results,
}: SaveAnalysisDialogProps) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSave = async () => {
    if (!name.trim()) {
      showError("Please enter a name for this analysis", "validation");
      return;
    }

    setLoading(true);
    try {
      await saveAnalysis(name, analysisType, data, results);
      showSuccess("Analysis saved", "Your analysis has been saved successfully");
      setName("");
      setOpen(false);
    } catch (error: any) {
      showError(error.message || "Failed to save analysis", "storage");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Analysis
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Analysis</DialogTitle>
          <DialogDescription>
            Give your analysis a name to save it for later
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Analysis Name</Label>
            <Input
              id="name"
              placeholder="My Statistical Analysis"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
