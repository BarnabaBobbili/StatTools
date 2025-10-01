import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "./StatCard";
import { HistogramChart } from "./HistogramChart";
import { stats } from "@/lib/statistical";
import { GitCompare, TrendingUp, BarChart3 } from "lucide-react";

export function DatasetComparison() {
  const [dataset1Input, setDataset1Input] = useState("90, 92, 88, 95, 89, 91, 93, 87, 94, 90");
  const [dataset2Input, setDataset2Input] = useState("85, 88, 84, 87, 86, 85, 89, 83, 88, 86");
  const [compared, setCompared] = useState(false);

  const parseData = (input: string): number[] => {
    return input
      .split(/[,\s\n]+/)
      .map(s => s.trim())
      .filter(s => s !== "")
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n));
  };

  const data1 = parseData(dataset1Input);
  const data2 = parseData(dataset2Input);

  const stats1 = compared && data1.length >= 2 ? {
    mean: stats.mean(data1),
    median: stats.median(data1),
    std: stats.standardDeviation(data1),
    min: stats.min(data1),
    max: stats.max(data1),
  } : null;

  const stats2 = compared && data2.length >= 2 ? {
    mean: stats.mean(data2),
    median: stats.median(data2),
    std: stats.standardDeviation(data2),
    min: stats.min(data2),
    max: stats.max(data2),
  } : null;

  const handleCompare = () => {
    if (data1.length < 2 || data2.length < 2) {
      alert("Both datasets must have at least 2 valid numbers.");
      return;
    }
    setCompared(true);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Compare Two Datasets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataset1">Dataset 1</Label>
              <Textarea
                id="dataset1"
                value={dataset1Input}
                onChange={(e) => setDataset1Input(e.target.value)}
                placeholder="90, 92, 88, 95..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataset2">Dataset 2</Label>
              <Textarea
                id="dataset2"
                value={dataset2Input}
                onChange={(e) => setDataset2Input(e.target.value)}
                placeholder="85, 88, 84, 87..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <Button onClick={handleCompare} variant="stats" className="w-full">
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Datasets
          </Button>
        </CardContent>
      </Card>

      {compared && stats1 && stats2 && (
        <>
          <Separator />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg">Dataset 1 Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <StatCard title="Mean" value={stats1.mean.toFixed(3)} icon={<TrendingUp />} variant="info" />
                  <StatCard title="Median" value={stats1.median.toFixed(3)} icon={<BarChart3 />} variant="info" />
                  <StatCard title="Std Dev" value={stats1.std.toFixed(3)} variant="default" />
                  <StatCard title="Range" value={`${stats1.min.toFixed(1)} - ${stats1.max.toFixed(1)}`} variant="default" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-l-4 border-l-secondary">
              <CardHeader>
                <CardTitle className="text-lg">Dataset 2 Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <StatCard title="Mean" value={stats2.mean.toFixed(3)} icon={<TrendingUp />} variant="success" />
                  <StatCard title="Median" value={stats2.median.toFixed(3)} icon={<BarChart3 />} variant="success" />
                  <StatCard title="Std Dev" value={stats2.std.toFixed(3)} variant="default" />
                  <StatCard title="Range" value={`${stats2.min.toFixed(1)} - ${stats2.max.toFixed(1)}`} variant="default" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Mean Difference:</p>
                  <p className="text-muted-foreground">{Math.abs(stats1.mean - stats2.mean).toFixed(3)}</p>
                </div>
                <div>
                  <p className="font-medium">Higher Mean:</p>
                  <p className="text-muted-foreground">{stats1.mean > stats2.mean ? "Dataset 1" : "Dataset 2"}</p>
                </div>
                <div>
                  <p className="font-medium">More Variable:</p>
                  <p className="text-muted-foreground">{stats1.std > stats2.std ? "Dataset 1" : "Dataset 2"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Dataset 1 Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <HistogramChart data={data1} bins={Math.min(10, Math.max(5, Math.floor(data1.length / 3)))} />
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Dataset 2 Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <HistogramChart data={data2} bins={Math.min(10, Math.max(5, Math.floor(data2.length / 3)))} />
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {!compared && (
        <Card className="shadow-card bg-muted/30">
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center space-y-2">
              <GitCompare className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">Enter data and click "Compare Datasets" to see comparison</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
