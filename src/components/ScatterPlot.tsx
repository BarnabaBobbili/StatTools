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
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { stats } from "@/lib/statistical";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ScatterPlotProps {
  xData: number[];
  yData: number[];
  title?: string;
  showRegression?: boolean;
}

export function ScatterPlot({ 
  xData, 
  yData, 
  title = "Scatter Plot", 
  showRegression = true 
}: ScatterPlotProps) {
  const chartRef = useRef<ChartJS<"scatter", {x: number, y: number}[], unknown>>(null);

  const handleExport = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.download = 'scatter_plot.png';
      link.href = url;
      link.click();
    }
  };

  // Prepare scatter plot data
  const scatterData = xData.map((x, i) => ({ x, y: yData[i] }));

  // Calculate regression line if requested
  let regressionData: {x: number, y: number}[] = [];
  let regressionStats = null;
  
  if (showRegression && xData.length > 1) {
    regressionStats = stats.linearRegression(xData, yData);
    const minX = Math.min(...xData);
    const maxX = Math.max(...xData);
    
    regressionData = [
      { x: minX, y: regressionStats.slope * minX + regressionStats.intercept },
      { x: maxX, y: regressionStats.slope * maxX + regressionStats.intercept }
    ];
  }

  const datasets = [
    {
      label: "Data Points",
      data: scatterData,
      backgroundColor: "hsl(var(--stats-chart-1) / 0.7)",
      borderColor: "hsl(var(--stats-chart-1))",
      pointRadius: 4,
      pointHoverRadius: 6,
    }
  ];

  if (showRegression && regressionData.length > 0) {
    datasets.push({
      label: "Regression Line",
      data: regressionData,
      backgroundColor: "hsl(var(--stats-chart-2))",
      borderColor: "hsl(var(--stats-chart-2))",
      pointRadius: 0,
      pointHoverRadius: 0,
      showLine: true,
      fill: false,
    } as any);
  }

  const chartData = {
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "hsl(var(--foreground))"
        }
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
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'X Values',
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
        title: {
          display: true,
          text: 'Y Values',
          color: "hsl(var(--muted-foreground))"
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
        <Scatter ref={chartRef} data={chartData} options={options} />
      </div>
      
      {regressionStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="font-medium">Slope</p>
            <p className="text-lg">{regressionStats.slope.toFixed(4)}</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="font-medium">Intercept</p>
            <p className="text-lg">{regressionStats.intercept.toFixed(4)}</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="font-medium">R²</p>
            <p className="text-lg">{regressionStats.rSquared.toFixed(4)}</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="font-medium">Correlation</p>
            <p className="text-lg">{regressionStats.correlation.toFixed(4)}</p>
          </div>
        </div>
      )}
    </div>
  );
}