import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download, TrendingUp } from "lucide-react";
import { showSuccess, showError } from "@/lib/errorHandling";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { stats } from "@/lib/statistical";
import { multipleLinearRegression, polynomialRegression } from "@/lib/statisticalExtended";
import { 
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RegressionVisualizationProps {
  xData: number[];
  yData: number[];
  xData2?: number[]; // For multiple regression
}

export function RegressionVisualization({ xData, yData, xData2 }: RegressionVisualizationProps) {
  const chartRef = useRef<ChartJS<"scatter", {x: number, y: number}[], unknown>>(null);
  // Regression type: linear, polynomial, or multiple
  const [regressionType, setRegressionType] = useState<'linear' | 'polynomial' | 'multiple'>('linear');
  // Polynomial degree (2-5)
  const [degree, setDegree] = useState<number>(2);

  // Handle PNG export with error handling
  const handleExport = () => {
    try {
      if (chartRef.current) {
        const url = chartRef.current.toBase64Image();
        const link = document.createElement('a');
        link.download = `${regressionType}_regression.png`;
        link.href = url;
        link.click();
        showSuccess("Chart exported successfully");
      }
    } catch (error) {
      showError("Failed to export chart", 'file');
    }
  };

  // Prepare scatter data
  const scatterData = xData.map((x, i) => ({ x, y: yData[i] }));

  let regressionData: {x: number, y: number}[] = [];
  let regressionStats: any = null;

  try {
    if (regressionType === 'linear') {
      // Simple linear regression
      regressionStats = stats.linearRegression(xData, yData);
      const minX = Math.min(...xData);
      const maxX = Math.max(...xData);
      
      // Generate 50 points for smooth line
      const step = (maxX - minX) / 50;
      for (let x = minX; x <= maxX; x += step) {
        const y = regressionStats.slope * x + regressionStats.intercept;
        regressionData.push({ x, y });
      }
    } else if (regressionType === 'polynomial') {
      // Polynomial regression
      const polyResult = polynomialRegression(xData, yData, degree);
      regressionStats = polyResult;
      
      const minX = Math.min(...xData);
      const maxX = Math.max(...xData);
      const step = (maxX - minX) / 100;
      
      // Generate smooth polynomial curve
      for (let x = minX; x <= maxX; x += step) {
        let y = 0;
        polyResult.coefficients.forEach((coef, i) => {
          y += coef * Math.pow(x, i);
        });
        regressionData.push({ x, y });
      }
    } else if (regressionType === 'multiple' && xData2 && xData2.length === xData.length) {
      // Multiple linear regression (2 predictors)
      const multipleResult = multipleLinearRegression([xData, xData2], yData);
      regressionStats = multipleResult;
      
      // For visualization, we'll show predicted vs actual (since we can't show 3D easily)
      const predictedY = xData.map((x1, i) => {
        const x2 = xData2[i];
        return multipleResult.coefficients[0] + 
               multipleResult.coefficients[1] * x1 + 
               multipleResult.coefficients[2] * x2;
      });
      
      // Show actual Y vs predicted Y
      regressionData = yData.map((actual, i) => ({ 
        x: actual, 
        y: predictedY[i] 
      }));
      
      // Also create perfect fit line for reference
      const minY = Math.min(...yData);
      const maxY = Math.max(...yData);
    }
  } catch (error) {
    showError(
      "Unable to compute regression. Please check your data.",
      'calculation'
    );
    console.error("Regression error:", error);
  }

  const datasets: any[] = [
    {
      label: regressionType === 'multiple' ? "Actual Y" : "Data Points",
      data: regressionType === 'multiple' ? regressionData : scatterData,
      backgroundColor: "hsl(var(--stats-chart-1) / 0.7)",
      borderColor: "hsl(var(--stats-chart-1))",
      pointRadius: 5,
      pointHoverRadius: 7,
      showLine: false,
    }
  ];

  if (regressionType !== 'multiple' && regressionData.length > 0) {
    datasets.push({
      label: `${regressionType === 'polynomial' ? `Polynomial (degree ${degree})` : 'Linear'} Fit`,
      data: regressionData,
      backgroundColor: "hsl(var(--stats-chart-2))",
      borderColor: "hsl(var(--stats-chart-2))",
      pointRadius: 0,
      pointHoverRadius: 0,
      showLine: true,
      fill: false,
      borderWidth: 3,
    });
  } else if (regressionType === 'multiple') {
    // Add perfect fit reference line for multiple regression
    const minVal = Math.min(...yData);
    const maxVal = Math.max(...yData);
    datasets.push({
      label: 'Perfect Fit',
      data: [{ x: minVal, y: minVal }, { x: maxVal, y: maxVal }],
      backgroundColor: "hsl(var(--muted-foreground) / 0.3)",
      borderColor: "hsl(var(--muted-foreground) / 0.5)",
      pointRadius: 0,
      showLine: true,
      borderDash: [5, 5],
      borderWidth: 2,
    });
  }

  const chartData = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "hsl(var(--foreground))",
          padding: 15,
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: regressionType === 'multiple' 
          ? 'Multiple Regression (Actual vs Predicted)' 
          : `${regressionType === 'polynomial' ? 'Polynomial' : 'Linear'} Regression Analysis`,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        color: "hsl(var(--foreground))"
      },
      tooltip: {
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `(${context.parsed.x.toFixed(3)}, ${context.parsed.y.toFixed(3)})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: regressionType === 'multiple' ? 'Actual Y' : 'X Values',
          color: "hsl(var(--muted-foreground))",
          font: { size: 13 }
        },
        grid: {
          color: "hsl(var(--border) / 0.5)"
        },
        ticks: {
          color: "hsl(var(--muted-foreground))"
        }
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: regressionType === 'multiple' ? 'Predicted Y' : 'Y Values',
          color: "hsl(var(--muted-foreground))",
          font: { size: 13 }
        },
        grid: {
          color: "hsl(var(--border) / 0.5)"
        },
        ticks: {
          color: "hsl(var(--muted-foreground))"
        }
      }
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Advanced Regression Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Regression Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Regression Type</Label>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Select value={regressionType} onValueChange={(val: any) => setRegressionType(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear Regression</SelectItem>
                      <SelectItem value="polynomial">Polynomial Regression</SelectItem>
                      <SelectItem value="multiple" disabled={!xData2}>
                        Multiple Regression {!xData2 && "(Need 2nd X variable)"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Linear: y = mx + b | Polynomial: y = a₀ + a₁x + ... | Multiple: y = b₀ + b₁x₁ + b₂x₂</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>

          {/* Polynomial Degree Slider (only for polynomial) */}
          {regressionType === 'polynomial' && (
            <div className="space-y-2">
              <Label>Polynomial Degree: {degree}</Label>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Slider
                      value={[degree]}
                      onValueChange={(val) => setDegree(val[0])}
                      min={2}
                      max={5}
                      step={1}
                      className="mt-2"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Higher degrees fit more complex curves but risk overfitting</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export PNG
          </Button>
        </div>

        {/* Chart */}
        <div className="h-80 w-full">
          <Scatter ref={chartRef} data={chartData} options={options} />
        </div>

        {/* Regression Statistics */}
        {regressionStats && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-lg">Regression Statistics</h4>
            
            {regressionType === 'linear' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-muted/30 p-3 rounded-lg cursor-help">
                        <p className="font-medium text-muted-foreground">Slope (m)</p>
                        <p className="text-lg font-semibold">{regressionStats.slope.toFixed(4)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rate of change: for every 1-unit increase in X, Y changes by this amount</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-muted/30 p-3 rounded-lg cursor-help">
                        <p className="font-medium text-muted-foreground">Intercept (b)</p>
                        <p className="text-lg font-semibold">{regressionStats.intercept.toFixed(4)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Predicted Y value when X = 0</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-muted/30 p-3 rounded-lg cursor-help">
                        <p className="font-medium text-muted-foreground">R²</p>
                        <p className="text-lg font-semibold">{regressionStats.rSquared.toFixed(4)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Proportion of variance explained by the model (0 to 1, higher is better)</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-muted/30 p-3 rounded-lg cursor-help">
                        <p className="font-medium text-muted-foreground">Correlation (r)</p>
                        <p className="text-lg font-semibold">{regressionStats.correlation.toFixed(4)}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Linear relationship strength (-1 to 1, closer to ±1 is stronger)</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
            )}

            {regressionType === 'polynomial' && (
              <div className="space-y-3">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="font-medium mb-2">Equation:</p>
                  <p className="font-mono text-sm">
                    y = {regressionStats.coefficients.map((c: number, i: number) => 
                      `${c >= 0 && i > 0 ? '+' : ''}${c.toFixed(4)}${i > 0 ? `x^${i}` : ''}`
                    ).join(' ')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-muted/30 p-3 rounded-lg cursor-help">
                          <p className="font-medium text-muted-foreground">R²</p>
                          <p className="text-lg font-semibold">{regressionStats.rSquared.toFixed(4)}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Model fit quality (0 to 1, higher means better fit)</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>

                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="font-medium text-muted-foreground">Degree</p>
                    <p className="text-lg font-semibold">{degree}</p>
                  </div>
                </div>
              </div>
            )}

            {regressionType === 'multiple' && (
              <div className="space-y-3">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="font-medium mb-2">Equation:</p>
                  <p className="font-mono text-sm">
                    y = {regressionStats.coefficients[0].toFixed(4)} + 
                    {regressionStats.coefficients[1].toFixed(4)}·X₁ + 
                    {regressionStats.coefficients[2].toFixed(4)}·X₂
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-muted/30 p-3 rounded-lg cursor-help">
                          <p className="font-medium text-muted-foreground">R²</p>
                          <p className="text-lg font-semibold">{regressionStats.rSquared.toFixed(4)}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Proportion of variance explained by both predictors</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>

                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="font-medium text-muted-foreground">Predictors</p>
                    <p className="text-lg font-semibold">2 (X₁, X₂)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
