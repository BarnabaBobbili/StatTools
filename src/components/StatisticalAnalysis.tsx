import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "./StatCard";
import { stats } from "@/lib/statistical";
import { BarChart3, TrendingUp, Sigma, Target } from "lucide-react";

export function StatisticalAnalysis() {
  const [dataInput, setDataInput] = useState("1, 2, 3, 4, 5, 6, 7, 8, 9, 10");
  const [analysisResults, setAnalysisResults] = useState<{
    mean: number;
    median: number;
    variance: number;
    standardDeviation: number;
    skewness: number;
    kurtosis: number;
    count: number;
  } | null>(null);

  const parseData = (input: string): number[] => {
    return input
      .split(/[,\s\n]+/)
      .map(s => s.trim())
      .filter(s => s !== "")
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n));
  };

  const analyzeData = () => {
    const data = parseData(dataInput);
    
    if (data.length < 2) {
      alert("Please enter at least 2 valid numbers.");
      return;
    }

    const results = {
      mean: stats.mean(data),
      median: stats.median(data),
      variance: stats.variance(data),
      standardDeviation: stats.standardDeviation(data),
      skewness: stats.skewness(data),
      kurtosis: stats.kurtosis(data),
      count: data.length
    };

    setAnalysisResults(results);
  };

  const formatNumber = (num: number): string => {
    return num.toFixed(4);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Data Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data">Enter your data (comma or space separated)</Label>
            <Textarea
              id="data"
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder="1, 2, 3, 4, 5..."
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={analyzeData} variant="stats" className="w-full">
            Analyze Data
          </Button>
        </CardContent>
      </Card>

      {analysisResults && (
        <>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Sample Size"
              value={analysisResults.count}
              icon={<Target />}
              variant="info"
            />
            <StatCard
              title="Mean"
              value={formatNumber(analysisResults.mean)}
              description="Average value"
              icon={<TrendingUp />}
              variant="success"
            />
            <StatCard
              title="Median"
              value={formatNumber(analysisResults.median)}
              description="Middle value"
              icon={<BarChart3 />}
              variant="info"
            />
            <StatCard
              title="Std Deviation"
              value={formatNumber(analysisResults.standardDeviation)}
              description="Measure of spread"
              icon={<Sigma />}
              variant="warning"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Variance"
              value={formatNumber(analysisResults.variance)}
              description="Square of std deviation"
            />
            <StatCard
              title="Skewness"
              value={formatNumber(analysisResults.skewness)}
              description="Measure of asymmetry"
            />
            <StatCard
              title="Kurtosis"
              value={formatNumber(analysisResults.kurtosis)}
              description="Measure of tail heaviness"
            />
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Interpretation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Skewness Interpretation:</p>
                  <p className="text-muted-foreground">
                    {Math.abs(analysisResults.skewness) < 0.5 ? "Approximately symmetric" :
                     analysisResults.skewness > 0.5 ? "Right-skewed (positive)" :
                     "Left-skewed (negative)"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Kurtosis Interpretation:</p>
                  <p className="text-muted-foreground">
                    {analysisResults.kurtosis > 0 ? "Heavier tails than normal" :
                     analysisResults.kurtosis < 0 ? "Lighter tails than normal" :
                     "Similar to normal distribution"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}