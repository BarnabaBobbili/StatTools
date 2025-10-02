/**
 * Confidence Intervals Component
 * Calculate and visualize confidence intervals for means and proportions
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TrendingUp, Target } from "lucide-react";
import { confidenceIntervalMean, confidenceIntervalProportion } from "@/lib/statisticalExtended";

export const ConfidenceIntervals = () => {
  // State for interval type
  const [intervalType, setIntervalType] = useState<'mean' | 'proportion'>('mean');
  const [confidenceLevel, setConfidenceLevel] = useState(0.95);
  
  // Mean interval inputs
  const [dataInput, setDataInput] = useState("");
  
  // Proportion interval inputs
  const [successes, setSuccesses] = useState(0);
  const [sampleSize, setSampleSize] = useState(0);
  
  // Results
  const [results, setResults] = useState<any>(null);

  /**
   * Parse comma-separated data values
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
   * Calculate confidence interval based on selected type
   */
  const calculateInterval = () => {
    try {
      let result;

      if (intervalType === 'mean') {
        const data = parseDataInput(dataInput);
        
        if (data.length < 2) {
          toast.error("Need at least 2 data points");
          return;
        }
        
        result = confidenceIntervalMean(data, confidenceLevel);
      } else {
        if (sampleSize === 0) {
          toast.error("Sample size must be greater than 0");
          return;
        }
        if (successes > sampleSize) {
          toast.error("Successes cannot exceed sample size");
          return;
        }
        
        result = confidenceIntervalProportion(successes, sampleSize, confidenceLevel);
      }

      setResults(result);
      toast.success("Confidence interval calculated!");
    } catch (error) {
      toast.error("Error calculating interval: " + (error as Error).message);
    }
  };

  /**
   * Render interval visualization as a horizontal bar
   */
  const renderIntervalVisualization = () => {
    if (!results) return null;

    const { lowerBound, upperBound, mean, proportion } = results;
    const pointEstimate = mean ?? proportion;
    
    // Calculate positions for visualization (0-100 scale)
    const range = upperBound - lowerBound;
    const padding = range * 0.2;
    const minVal = lowerBound - padding;
    const maxVal = upperBound + padding;
    const scale = 100 / (maxVal - minVal);
    
    const lowerPos = (lowerBound - minVal) * scale;
    const upperPos = (upperBound - minVal) * scale;
    const pointPos = (pointEstimate - minVal) * scale;

    return (
      <div className="space-y-4 mt-6">
        <div className="relative h-16 bg-muted rounded-lg overflow-hidden">
          {/* Confidence interval bar */}
          <div
            className="absolute h-full bg-gradient-to-r from-secondary/20 via-secondary/40 to-secondary/20 border-y-2 border-secondary"
            style={{
              left: `${lowerPos}%`,
              width: `${upperPos - lowerPos}%`,
            }}
          />
          
          {/* Point estimate marker */}
          <div
            className="absolute h-full w-1 bg-primary"
            style={{ left: `${pointPos}%` }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold whitespace-nowrap">
              {pointEstimate.toFixed(4)}
            </div>
          </div>

          {/* Lower bound marker */}
          <div
            className="absolute h-full w-0.5 bg-secondary"
            style={{ left: `${lowerPos}%` }}
          >
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
              {lowerBound.toFixed(4)}
            </div>
          </div>

          {/* Upper bound marker */}
          <div
            className="absolute h-full w-0.5 bg-secondary"
            style={{ left: `${upperPos}%` }}
          >
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
              {upperBound.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary" />
            <span>Point Estimate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary/40 border border-secondary" />
            <span>{(confidenceLevel * 100).toFixed(0)}% Confidence Interval</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Confidence Interval Calculator
          </CardTitle>
          <CardDescription>
            Estimate population parameters with confidence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interval Type Selection */}
          <div>
            <Label htmlFor="intervalType">Interval Type</Label>
            <Select value={intervalType} onValueChange={(val: any) => setIntervalType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mean">Confidence Interval for Mean</SelectItem>
                <SelectItem value="proportion">Confidence Interval for Proportion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Confidence Level */}
          <div>
            <Label htmlFor="confidence">Confidence Level</Label>
            <Select 
              value={confidenceLevel.toString()} 
              onValueChange={(val) => setConfidenceLevel(parseFloat(val))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.90">90%</SelectItem>
                <SelectItem value="0.95">95%</SelectItem>
                <SelectItem value="0.99">99%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Input Fields */}
          {intervalType === 'mean' ? (
            <div>
              <Label htmlFor="data">Sample Data</Label>
              <Textarea
                id="data"
                placeholder="Enter comma-separated values (e.g., 12.5, 14.3, 13.8)"
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                className="font-mono"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="successes">Number of Successes</Label>
                <Input
                  id="successes"
                  type="number"
                  min="0"
                  value={successes}
                  onChange={(e) => setSuccesses(parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="sampleSize">Sample Size</Label>
                <Input
                  id="sampleSize"
                  type="number"
                  min="1"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <Button onClick={calculateInterval} className="w-full" size="lg">
            <TrendingUp className="h-4 w-4 mr-2" />
            Calculate Interval
          </Button>
        </CardContent>
      </Card>

      {/* Results Card */}
      {results && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Lower Bound</p>
                <p className="text-xl font-bold text-secondary">
                  {results.lowerBound.toFixed(4)}
                </p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Point Estimate</p>
                <p className="text-xl font-bold text-primary">
                  {(results.mean ?? results.proportion).toFixed(4)}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Upper Bound</p>
                <p className="text-xl font-bold text-secondary">
                  {results.upperBound.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Visualization */}
            {renderIntervalVisualization()}

            {/* Additional Statistics */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Margin of Error</p>
                <p className="font-semibold">{results.marginOfError.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Standard Error</p>
                <p className="font-semibold">{results.standardError.toFixed(4)}</p>
              </div>
            </div>

            {/* Interpretation */}
            <div className="bg-accent/10 border-l-4 border-accent p-4 rounded">
              <p className="text-sm font-medium text-accent-foreground">
                {results.interpretation}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
