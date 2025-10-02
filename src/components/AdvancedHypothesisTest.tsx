/**
 * Advanced Hypothesis Testing Component
 * Provides UI for Two-Sample t-Test, Paired t-Test, ANOVA, and Chi-Square Independence
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TestTube, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { twoSampleTTest, pairedTTest, oneWayANOVA, chiSquareIndependence } from "@/lib/statisticalExtended";

export const AdvancedHypothesisTest = () => {
  // State for test selection and configuration
  const [testType, setTestType] = useState<'two-sample' | 'paired' | 'anova' | 'chi-square'>('two-sample');
  const [alpha, setAlpha] = useState(0.05);
  const [equalVariance, setEqualVariance] = useState(true);
  
  // Input data
  const [sample1Input, setSample1Input] = useState("");
  const [sample2Input, setSample2Input] = useState("");
  const [groupsInput, setGroupsInput] = useState(""); // For ANOVA
  const [matrixInput, setMatrixInput] = useState(""); // For Chi-Square
  
  // Results
  const [results, setResults] = useState<any>(null);

  /**
   * Parse comma-separated values into number array
   * Handles whitespace and invalid inputs
   */
  const parseDataInput = (input: string): number[] => {
    return input
      .split(',')
      .map(val => val.trim())
      .filter(val => val !== '')
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val));
  };

  /**
   * Parse matrix input (rows separated by semicolons, values by commas)
   * Example: "10,20,30;15,25,35" creates 2x3 matrix
   */
  const parseMatrixInput = (input: string): number[][] => {
    return input
      .split(';')
      .map(row => parseDataInput(row))
      .filter(row => row.length > 0);
  };

  /**
   * Execute the selected hypothesis test
   */
  const runTest = () => {
    try {
      let result;

      switch (testType) {
        case 'two-sample': {
          const data1 = parseDataInput(sample1Input);
          const data2 = parseDataInput(sample2Input);
          
          if (data1.length < 2 || data2.length < 2) {
            toast.error("Each sample needs at least 2 values");
            return;
          }
          
          result = twoSampleTTest(data1, data2, alpha, equalVariance);
          break;
        }

        case 'paired': {
          const before = parseDataInput(sample1Input);
          const after = parseDataInput(sample2Input);
          
          if (before.length !== after.length) {
            toast.error("Paired samples must have equal length");
            return;
          }
          if (before.length < 2) {
            toast.error("Need at least 2 pairs of observations");
            return;
          }
          
          result = pairedTTest(before, after, alpha);
          break;
        }

        case 'anova': {
          const groups = parseMatrixInput(groupsInput);
          
          if (groups.length < 2) {
            toast.error("Need at least 2 groups for ANOVA");
            return;
          }
          
          result = oneWayANOVA(groups, alpha);
          break;
        }

        case 'chi-square': {
          const matrix = parseMatrixInput(matrixInput);
          
          if (matrix.length < 2 || matrix[0].length < 2) {
            toast.error("Need at least 2x2 matrix for Chi-Square test");
            return;
          }
          
          result = chiSquareIndependence(matrix, alpha);
          break;
        }
      }

      setResults(result);
      toast.success("Test completed successfully!");
    } catch (error) {
      toast.error("Error running test: " + (error as Error).message);
    }
  };

  /**
   * Render test-specific input fields
   */
  const renderInputFields = () => {
    switch (testType) {
      case 'two-sample':
      case 'paired':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="sample1">
                {testType === 'paired' ? 'Before/Group 1 Data' : 'Sample 1 Data'}
              </Label>
              <Textarea
                id="sample1"
                placeholder="Enter comma-separated values (e.g., 1.2, 3.4, 5.6)"
                value={sample1Input}
                onChange={(e) => setSample1Input(e.target.value)}
                className="font-mono"
              />
            </div>
            
            <div>
              <Label htmlFor="sample2">
                {testType === 'paired' ? 'After/Group 2 Data' : 'Sample 2 Data'}
              </Label>
              <Textarea
                id="sample2"
                placeholder="Enter comma-separated values"
                value={sample2Input}
                onChange={(e) => setSample2Input(e.target.value)}
                className="font-mono"
              />
            </div>

            {testType === 'two-sample' && (
              <div>
                <Label htmlFor="variance">Variance Assumption</Label>
                <Select 
                  value={equalVariance ? 'equal' : 'unequal'}
                  onValueChange={(val) => setEqualVariance(val === 'equal')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Equal Variance (Pooled)</SelectItem>
                    <SelectItem value="unequal">Unequal Variance (Welch's)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case 'anova':
        return (
          <div>
            <Label htmlFor="groups">Group Data (semicolon-separated groups)</Label>
            <Textarea
              id="groups"
              placeholder="Group 1;Group 2;Group 3 (e.g., 1,2,3;4,5,6;7,8,9)"
              value={groupsInput}
              onChange={(e) => setGroupsInput(e.target.value)}
              className="font-mono h-32"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Each group separated by semicolon, values within group separated by commas
            </p>
          </div>
        );

      case 'chi-square':
        return (
          <div>
            <Label htmlFor="matrix">Contingency Table (rows separated by semicolons)</Label>
            <Textarea
              id="matrix"
              placeholder="Row 1;Row 2 (e.g., 10,20,30;15,25,35)"
              value={matrixInput}
              onChange={(e) => setMatrixInput(e.target.value)}
              className="font-mono h-32"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Each row separated by semicolon, values within row separated by commas
            </p>
          </div>
        );
    }
  };

  /**
   * Render test results with color-coded significance
   */
  const renderResults = () => {
    if (!results) return null;

    const isSignificant = results.reject;

    return (
      <Card className="mt-6 border-l-4" style={{ 
        borderLeftColor: isSignificant ? 'hsl(var(--stats-warning))' : 'hsl(var(--stats-success))' 
      }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              {results.testName} Results
            </CardTitle>
            <Badge variant={isSignificant ? "destructive" : "secondary"}>
              {isSignificant ? "Significant" : "Not Significant"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Statistic */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Test Statistic</p>
              <p className="text-2xl font-bold">
                {results.tStatistic?.toFixed(4) || 
                 results.fStatistic?.toFixed(4) || 
                 results.chiSquareStatistic?.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">p-value</p>
              <p className="text-2xl font-bold text-stats-warning">
                {results.pValue?.toFixed(6)}
              </p>
            </div>
          </div>

          {/* Degrees of Freedom */}
          {results.degreesOfFreedom !== undefined && (
            <div>
              <p className="text-sm text-muted-foreground">Degrees of Freedom</p>
              <p className="text-lg font-semibold">{results.degreesOfFreedom.toFixed(2)}</p>
            </div>
          )}

          {/* ANOVA specific */}
          {results.dfBetween !== undefined && (
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">df Between</p>
                <p className="font-semibold">{results.dfBetween}</p>
              </div>
              <div>
                <p className="text-muted-foreground">df Within</p>
                <p className="font-semibold">{results.dfWithin}</p>
              </div>
              <div>
                <p className="text-muted-foreground">df Total</p>
                <p className="font-semibold">{results.dfTotal}</p>
              </div>
            </div>
          )}

          {/* Interpretation Alert */}
          <Alert>
            <div className="flex items-start gap-2">
              {isSignificant ? (
                <AlertCircle className="h-5 w-5 text-stats-warning" />
              ) : (
                <CheckCircle className="h-5 w-5 text-stats-success" />
              )}
              <div>
                <AlertDescription className="font-medium">
                  {results.interpretation}
                </AlertDescription>
                <p className="text-xs text-muted-foreground mt-2">
                  α = {alpha} (significance level)
                </p>
              </div>
            </div>
          </Alert>

          {/* Additional Statistics */}
          {results.meanDifference !== undefined && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Mean Difference</p>
              <p className="text-lg font-bold">{results.meanDifference.toFixed(4)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Test Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-primary" />
            Advanced Hypothesis Tests
          </CardTitle>
          <CardDescription>
            Choose a test and enter your data to perform statistical analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Type Selection */}
          <div>
            <Label htmlFor="testType">Select Test</Label>
            <Select value={testType} onValueChange={(val: any) => setTestType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="two-sample">Two-Sample t-Test (Independent)</SelectItem>
                <SelectItem value="paired">Paired t-Test (Dependent)</SelectItem>
                <SelectItem value="anova">One-Way ANOVA</SelectItem>
                <SelectItem value="chi-square">Chi-Square Independence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Significance Level */}
          <div>
            <Label htmlFor="alpha">Significance Level (α)</Label>
            <Select value={alpha.toString()} onValueChange={(val) => setAlpha(parseFloat(val))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.01">0.01 (99% confidence)</SelectItem>
                <SelectItem value="0.05">0.05 (95% confidence)</SelectItem>
                <SelectItem value="0.10">0.10 (90% confidence)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Input Fields */}
          {renderInputFields()}

          {/* Run Test Button */}
          <Button onClick={runTest} className="w-full" size="lg">
            <TestTube className="h-4 w-4 mr-2" />
            Run Hypothesis Test
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {renderResults()}
    </div>
  );
};
