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
import { Textarea } from "@/components/ui/textarea";
import { Database } from "lucide-react";
import { saveDataset } from "@/lib/storage";
import { showSuccess, showError } from "@/lib/errorHandling";
import { useAuth } from "@/hooks/useAuth";

interface SaveDatasetDialogProps {
  data: number[];
  defaultName?: string;
}

export function SaveDatasetDialog({ data, defaultName }: SaveDatasetDialogProps) {
  const [name, setName] = useState(defaultName || "");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSave = async () => {
    if (!name.trim()) {
      showError("Please enter a name for this dataset", "validation");
      return;
    }

    setLoading(true);
    try {
      await saveDataset(name, data, description);
      showSuccess("Dataset saved", "Your dataset has been saved successfully");
      setName("");
      setDescription("");
      setOpen(false);
    } catch (error: any) {
      showError(error.message || "Failed to save dataset", "storage");
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
          <Database className="h-4 w-4" />
          Save Dataset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Dataset</DialogTitle>
          <DialogDescription>
            Save this dataset to reuse it later in your analyses
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dataset-name">Dataset Name</Label>
            <Input
              id="dataset-name"
              placeholder="My Dataset"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataset-description">Description (optional)</Label>
            <Textarea
              id="dataset-description"
              placeholder="Describe your dataset..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {data.length} data points
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
