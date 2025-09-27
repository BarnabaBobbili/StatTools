import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "./StatCard";
import { CSVUploader } from "./CSVUploader";
import { HistogramChart } from "./HistogramChart";
import { BoxPlot } from "./BoxPlot";
import { ScatterPlot } from "./ScatterPlot";
import { stats } from "@/lib/statistical";
import { BarChart3, TrendingUp, Sigma, Target, Upload, ScatterChart } from "lucide-react";

export function StatisticalAnalysis() {
  const [dataInput, setDataInput] = useState("1, 2, 3, 4, 5, 6, 7, 8, 9, 10");
  const [xDataInput, setXDataInput] = useState("1, 2, 3, 4, 5");
  const [yDataInput, setYDataInput] = useState("2, 4, 6, 8, 10");
  const [filename, setFilename] = useState<string>("");
  const [analysisResults, setAnalysisResults] = useState<{
    mean: number;
    median: number;
    mode: number[];
    min: number;
    max: number;
    range: number;
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
      mode: stats.mode(data),
      min: stats.min(data),
      max: stats.max(data),
      range: stats.range(data),
      variance: stats.variance(data),
      standardDeviation: stats.standardDeviation(data),
      skewness: stats.skewness(data),
      kurtosis: stats.kurtosis(data),
      count: data.length
    };

    setAnalysisResults(results);
  };

  const handleCSVData = (data: number[], csvFilename?: string) => {
    setDataInput(data.join(", "));
    setFilename(csvFilename || "");
  };

  const parseXYData = (xInput: string, yInput: string): { x: number[], y: number[] } => {
    const xData = parseData(xInput);
    const yData = parseData(yInput);
    
    // Take the minimum length to ensure pairs
    const minLength = Math.min(xData.length, yData.length);
    return {
      x: xData.slice(0, minLength),
      y: yData.slice(0, minLength)
    };
  };

  const formatNumber = (num: number): string => {
    return num.toFixed(4);
  };

  const formatMode = (mode: number[]): string => {
    if (mode.length === 1) return formatNumber(mode[0]);
    if (mode.length <= 3) return mode.map(formatNumber).join(", ");
    return `${mode.slice(0, 3).map(formatNumber).join(", ")}... (${mode.length} values)`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Data Analysis</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="regression">Regression</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Manual Data Input
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

            <CSVUploader onDataLoaded={handleCSVData} />
          </div>

          {filename && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Loaded file:</span> {filename}
            </div>
          )}

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
                  title="Mode"
                  value={formatMode(analysisResults.mode)}
                  description="Most frequent value(s)"
                  icon={<Target />}
                  variant="warning"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Minimum"
                  value={formatNumber(analysisResults.min)}
                />
                <StatCard
                  title="Maximum"
                  value={formatNumber(analysisResults.max)}
                />
                <StatCard
                  title="Range"
                  value={formatNumber(analysisResults.range)}
                  description="Max - Min"
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
        </TabsContent>

        <TabsContent value="visualization" className="space-y-6">
          {analysisResults && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Histogram - Data Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <HistogramChart 
                    data={parseData(dataInput)} 
                    bins={Math.min(15, Math.max(5, Math.floor(analysisResults.count / 5)))}
                  />
                </CardContent>
              </Card>
              
              <BoxPlot 
                data={parseData(dataInput)}
                title="Box Plot - Data Summary"
              />
            </div>
          )}
          {!analysisResults && (
            <Card className="shadow-card">
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Run data analysis first to see visualizations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="regression" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScatterChart className="h-5 w-5" />
                Scatter Plot & Regression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="xdata">X Values (independent variable)</Label>
                  <Textarea
                    id="xdata"
                    value={xDataInput}
                    onChange={(e) => setXDataInput(e.target.value)}
                    placeholder="1, 2, 3, 4, 5..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ydata">Y Values (dependent variable)</Label>
                  <Textarea
                    id="ydata"
                    value={yDataInput}
                    onChange={(e) => setYDataInput(e.target.value)}
                    placeholder="2, 4, 6, 8, 10..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Scatter Plot with Regression Line</CardTitle>
            </CardHeader>
            <CardContent>
              <ScatterPlot 
                xData={parseXYData(xDataInput, yDataInput).x}
                yData={parseXYData(xDataInput, yDataInput).y}
                showRegression={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}