import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatCard } from "./StatCard";
import { jStat } from "@/lib/statistical";
import { Calculator, Target, Info } from "lucide-react";

export function ProbabilityCalculator() {
  const [distribution, setDistribution] = useState<"normal" | "studentt">("normal");
  const [params, setParams] = useState({
    normal: { mean: 0, std: 1 },
    studentt: { df: 10 }
  });
  const [xValue, setXValue] = useState<number>(0);
  const [results, setResults] = useState<{
    pdf: number;
    cdf: number;
    survivalFunction: number;
  } | null>(null);

  const calculate = () => {
    let pdf = 0;
    let cdf = 0;

    if (distribution === "normal") {
      const { mean, std } = params.normal;
      pdf = jStat.normal.pdf(xValue, mean, std);
      cdf = jStat.normal.cdf(xValue, mean, std);
    } else if (distribution === "studentt") {
      const { df } = params.studentt;
      pdf = jStat.studentt.pdf(xValue, df);
      cdf = jStat.studentt.cdf ? jStat.studentt.cdf(xValue, df) : 0.5; // Fallback
    }

    setResults({
      pdf,
      cdf,
      survivalFunction: 1 - cdf
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Probability Calculator
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Calculate PDF, CDF, and survival functions for probability distributions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Distribution</Label>
              <Select value={distribution} onValueChange={(value: "normal" | "studentt") => setDistribution(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal Distribution</SelectItem>
                  <SelectItem value="studentt">Student's t-Distribution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="xvalue">X Value</Label>
              <Input
                id="xvalue"
                type="number"
                value={xValue}
                onChange={(e) => setXValue(parseFloat(e.target.value) || 0)}
                step="0.1"
              />
            </div>
          </div>

          {distribution === "normal" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mean">Mean (μ)</Label>
                <Input
                  id="mean"
                  type="number"
                  value={params.normal.mean}
                  onChange={(e) => setParams({
                    ...params,
                    normal: { ...params.normal, mean: parseFloat(e.target.value) || 0 }
                  })}
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="std">Standard Deviation (σ)</Label>
                <Input
                  id="std"
                  type="number"
                  value={params.normal.std}
                  onChange={(e) => setParams({
                    ...params,
                    normal: { ...params.normal, std: Math.max(0.1, parseFloat(e.target.value) || 1) }
                  })}
                  step="0.1"
                  min="0.1"
                />
              </div>
            </div>
          )}

          {distribution === "studentt" && (
            <div className="space-y-2">
              <Label htmlFor="df">Degrees of Freedom</Label>
              <Input
                id="df"
                type="number"
                value={params.studentt.df}
                onChange={(e) => setParams({
                  ...params,
                  studentt: { df: Math.max(1, parseInt(e.target.value) || 1) }
                })}
                min="1"
                step="1"
              />
            </div>
          )}

          <Button onClick={calculate} variant="stats" className="w-full">
            Calculate Probabilities
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="PDF"
              value={results.pdf.toFixed(6)}
              description="Probability Density Function"
              icon={<Target />}
              variant="info"
            />
            <StatCard
              title="CDF"
              value={results.cdf.toFixed(6)}
              description="Cumulative Distribution Function"
              icon={<Calculator />}
              variant="success"
            />
            <StatCard
              title="Survival Function"
              value={results.survivalFunction.toFixed(6)}
              description="1 - CDF"
              variant="warning"
            />
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Interpretation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">PDF (Probability Density Function):</p>
                <p className="text-muted-foreground">
                  The likelihood of the random variable taking exactly the value {xValue}.
                </p>
              </div>
              <div>
                <p className="font-medium">CDF (Cumulative Distribution Function):</p>
                <p className="text-muted-foreground">
                  The probability that the random variable is less than or equal to {xValue}.
                </p>
              </div>
              <div>
                <p className="font-medium">Survival Function:</p>
                <p className="text-muted-foreground">
                  The probability that the random variable is greater than {xValue}.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}