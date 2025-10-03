import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatCard } from "./StatCard";
import { DistributionChart } from "./DistributionChart";
import { hypothesisTests } from "@/lib/statistical";
import { TestTube, Target, AlertTriangle, CheckCircle, Info } from "lucide-react";

export function HypothesisTest() {
  const [testType, setTestType] = useState<"onesample" | "ztest" | "chisquare">("onesample");
  const [dataInput, setDataInput] = useState("98, 99, 100, 101, 102, 103, 104, 105");
  const [nullHypothesis, setNullHypothesis] = useState<number>(100);
  const [populationStd, setPopulationStd] = useState<number>(15);
  const [observedInput, setObservedInput] = useState("10, 15, 8, 12");
  const [expectedInput, setExpectedInput] = useState("12, 12, 12, 12");
  const [alpha, setAlpha] = useState<number>(0.05);
  const [results, setResults] = useState<{
    tStatistic?: number;
    zStatistic?: number;
    chiSquareStatistic?: number;
    degreesOfFreedom: number;
    pValue?: number;
    criticalValue: number;
    reject: boolean;
    alpha: number;
  } | null>(null);

  const parseData = (input: string): number[] => {
    return input
      .split(/[,\s\n]+/)
      .map(s => s.trim())
      .filter(s => s !== "")
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n));
  };

  const runTest = () => {
    const data = parseData(dataInput);
    
    if (testType === "onesample") {
      if (data.length < 2) {
        alert("Please enter at least 2 valid numbers.");
        return;
      }
      const testResults = hypothesisTests.oneSampleTTest(data, nullHypothesis, alpha);
      setResults(testResults);
    } else if (testType === "ztest") {
      if (data.length < 2) {
        alert("Please enter at least 2 valid numbers.");
        return;
      }
      const testResults = hypothesisTests.zTest(data, nullHypothesis, populationStd, alpha);
      setResults(testResults);
    } else if (testType === "chisquare") {
      const observed = parseData(observedInput);
      const expected = parseData(expectedInput);
      
      if (observed.length !== expected.length || observed.length < 2) {
        alert("Observed and expected data must have the same length (at least 2 values).");
        return;
      }
      
      const testResults = hypothesisTests.chiSquareGoodnessOfFit(observed, expected, alpha);
      setResults(testResults);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Hypothesis Testing
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Test whether a sample mean differs significantly from a hypothesized population mean</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Test Type</Label>
            <Select value={testType} onValueChange={(value: "onesample" | "ztest" | "chisquare") => setTestType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onesample">One-Sample t-Test</SelectItem>
                <SelectItem value="ztest">One-Sample Z-Test</SelectItem>
                <SelectItem value="chisquare">Chi-Square Goodness of Fit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="null">Null Hypothesis (μ₀)</Label>
              <Input
                id="null"
                type="number"
                value={nullHypothesis}
                onChange={(e) => setNullHypothesis(parseFloat(e.target.value) || 0)}
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alpha">Significance Level (α)</Label>
              <Select value={alpha.toString()} onValueChange={(value) => setAlpha(parseFloat(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.01">0.01</SelectItem>
                  <SelectItem value="0.05">0.05</SelectItem>
                  <SelectItem value="0.10">0.10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testdata">Sample Data (comma or space separated)</Label>
            <Textarea
              id="testdata"
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder="98, 99, 100, 101, 102..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={runTest} variant="stats" className="w-full">
            Run Hypothesis Test
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="t-Statistic"
              value={results.tStatistic.toFixed(4)}
              icon={<Target />}
              variant="info"
            />
            <StatCard
              title="p-Value"
              value={results.pValue.toFixed(6)}
              icon={<TestTube />}
              variant={results.pValue < results.alpha ? "warning" : "success"}
            />
            <StatCard
              title="Degrees of Freedom"
              value={results.degreesOfFreedom}
              variant="default"
            />
            <StatCard
              title="Critical Value"
              value={`±${results.criticalValue.toFixed(3)}`}
              variant="default"
            />
          </div>

          <Card className={`shadow-card border-2 ${results.reject ? 'border-stats-warning' : 'border-stats-success'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.reject ? (
                  <AlertTriangle className="h-5 w-5 text-stats-warning" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-stats-success" />
                )}
                Test Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={`p-4 rounded-lg ${results.reject ? 'bg-stats-warning/10' : 'bg-stats-success/10'}`}>
                <p className="font-medium text-lg">
                  {results.reject ? "Reject the null hypothesis" : "Fail to reject the null hypothesis"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  At α = {results.alpha} significance level
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">Null Hypothesis (H₀):</p>
                  <p className="text-muted-foreground">μ = {nullHypothesis}</p>
                </div>
                <div>
                  <p className="font-medium">Alternative Hypothesis (H₁):</p>
                  <p className="text-muted-foreground">μ ≠ {nullHypothesis} (two-tailed test)</p>
                </div>
                <div>
                  <p className="font-medium">Interpretation:</p>
                  <p className="text-muted-foreground">
                    {results.reject 
                      ? `There is sufficient evidence to conclude that the population mean is significantly different from ${nullHypothesis}.`
                      : `There is insufficient evidence to conclude that the population mean is significantly different from ${nullHypothesis}.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* P-Value Visualization for t-test */}
          {testType === "onesample" && results.tStatistic !== undefined && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>P-Value Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  distribution="studentt"
                  params={{ df: results.degreesOfFreedom }}
                  title="Student's t-Distribution with Rejection Regions"
                  pValue={results.pValue}
                  alpha={results.alpha}
                  testType="two-tailed"
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  <p><strong>Red shaded areas:</strong> Rejection regions where we would reject H₀</p>
                  <p><strong>Your test statistic:</strong> t = {results.tStatistic.toFixed(4)}</p>
                  {results.reject ? (
                    <p className="text-stats-warning font-medium mt-2">
                      ✓ Test statistic falls in rejection region → Reject H₀
                    </p>
                  ) : (
                    <p className="text-stats-success font-medium mt-2">
                      ✓ Test statistic does not fall in rejection region → Fail to reject H₀
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}