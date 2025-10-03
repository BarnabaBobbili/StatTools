import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { generatePDFData, DistributionType, DistributionParams } from "@/lib/statistical";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DistributionChartProps {
  distribution: DistributionType;
  params: DistributionParams[DistributionType];
  title?: string;
  showArea?: boolean;
  xMin?: number;
  xMax?: number;
  // P-value visualization: show shaded rejection region
  pValue?: number;
  alpha?: number; // Significance level (e.g., 0.05)
  testType?: 'two-tailed' | 'left-tailed' | 'right-tailed';
}

export function DistributionChart({
  distribution,
  params,
  title = "Probability Density Function",
  showArea = false,
  xMin = -4,
  xMax = 4,
  pValue,
  alpha = 0.05,
  testType = 'two-tailed'
}: DistributionChartProps) {
  const chartRef = useRef<ChartJS<"line", { x: number; y: number }[], unknown>>(null);

  const handleExport = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.download = `${distribution}_distribution.png`;
      link.href = url;
      link.click();
    }
  };

  // Adjust x range based on distribution
  const getXRange = () => {
    switch (distribution) {
      case 'normal':
        const normalParams = params as DistributionParams['normal'];
        return {
          min: normalParams.mean - 4 * normalParams.std,
          max: normalParams.mean + 4 * normalParams.std
        };
      case 'exponential':
        return { min: 0, max: 5 };
      case 'uniform':
        const uniformParams = params as DistributionParams['uniform'];
        return {
          min: uniformParams.min - 1,
          max: uniformParams.max + 1
        };
      default:
        return { min: xMin, max: xMax };
    }
  };

  const { min, max } = getXRange();
  const data = generatePDFData(distribution, params, min, max, 200);

  // Calculate critical values for p-value shading if provided
  let criticalValues: { left?: number; right?: number } = {};
  if (pValue !== undefined && distribution === 'normal') {
    const normalParams = params as DistributionParams['normal'];
    const mean = normalParams.mean;
    const std = normalParams.std;
    
    // Calculate z-scores for alpha level
    if (testType === 'two-tailed') {
      const zCritical = 1.96; // For alpha=0.05
      criticalValues.left = mean - zCritical * std;
      criticalValues.right = mean + zCritical * std;
    } else if (testType === 'left-tailed') {
      const zCritical = -1.645; // For alpha=0.05
      criticalValues.left = mean + zCritical * std;
    } else if (testType === 'right-tailed') {
      const zCritical = 1.645; // For alpha=0.05
      criticalValues.right = mean + zCritical * std;
    }
  }

  // Prepare datasets with rejection regions
  const datasets: any[] = [
    {
      label: "Probability Density",
      data: data.map(point => ({ x: point.x, y: point.y })),
      borderColor: "hsl(var(--stats-chart-1))",
      backgroundColor: showArea ? "hsl(var(--stats-chart-1) / 0.1)" : undefined,
      fill: showArea,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      borderWidth: 2,
    }
  ];

  // Add rejection region shading if p-value visualization is enabled
  if (pValue !== undefined && (criticalValues.left || criticalValues.right)) {
    if (testType === 'two-tailed' && criticalValues.left && criticalValues.right) {
      // Left tail rejection region
      datasets.push({
        label: `Rejection Region (α=${alpha})`,
        data: data.filter(p => p.x <= criticalValues.left!).map(point => ({ x: point.x, y: point.y })),
        borderColor: "hsl(var(--destructive))",
        backgroundColor: "hsl(var(--destructive) / 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 0,
      });
      // Right tail rejection region
      datasets.push({
        label: '',
        data: data.filter(p => p.x >= criticalValues.right!).map(point => ({ x: point.x, y: point.y })),
        borderColor: "hsl(var(--destructive))",
        backgroundColor: "hsl(var(--destructive) / 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 0,
      });
    } else if (testType === 'left-tailed' && criticalValues.left) {
      datasets.push({
        label: `Rejection Region (α=${alpha})`,
        data: data.filter(p => p.x <= criticalValues.left!).map(point => ({ x: point.x, y: point.y })),
        borderColor: "hsl(var(--destructive))",
        backgroundColor: "hsl(var(--destructive) / 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 0,
      });
    } else if (testType === 'right-tailed' && criticalValues.right) {
      datasets.push({
        label: `Rejection Region (α=${alpha})`,
        data: data.filter(p => p.x >= criticalValues.right!).map(point => ({ x: point.x, y: point.y })),
        borderColor: "hsl(var(--destructive))",
        backgroundColor: "hsl(var(--destructive) / 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 0,
      });
    }
  }

  const chartData = {
    labels: data.map(point => point.x.toFixed(2)),
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        color: "hsl(var(--foreground))"
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        display: true,
        title: {
          display: true,
          text: 'Value',
          color: "hsl(var(--muted-foreground))"
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
        display: true,
        title: {
          display: true,
          text: 'Density',
          color: "hsl(var(--muted-foreground))"
        },
        grid: {
          color: "hsl(var(--border) / 0.5)"
        },
        ticks: {
          color: "hsl(var(--muted-foreground))"
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  return (
    <div className="space-y-4">
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
      <div className="h-64 w-full">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}