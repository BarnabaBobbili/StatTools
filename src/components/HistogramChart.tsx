import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { stats } from "@/lib/statistical";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HistogramChartProps {
  data: number[];
  bins?: number;
  title?: string;
}

export function HistogramChart({ data, bins = 10, title = "Data Distribution" }: HistogramChartProps) {
  const chartRef = useRef<ChartJS<"bar", number[], string>>(null);

  const handleExport = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.download = 'histogram.png';
      link.href = url;
      link.click();
    }
  };

  const histogramData = stats.histogram(data, bins);

  const chartData = {
    labels: histogramData.map(item => item.bin),
    datasets: [
      {
        label: "Frequency",
        data: histogramData.map(item => item.count),
        backgroundColor: "hsl(var(--stats-chart-1) / 0.7)",
        borderColor: "hsl(var(--stats-chart-1))",
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
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
        backgroundColor: "hsl(var(--popover))",
        titleColor: "hsl(var(--popover-foreground))",
        bodyColor: "hsl(var(--popover-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const frequency = (context.raw / data.length * 100).toFixed(1);
            return `Count: ${context.raw} (${frequency}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Value Range',
          color: "hsl(var(--muted-foreground))"
        },
        grid: {
          color: "hsl(var(--border) / 0.5)"
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          maxRotation: 45
        }
      },
      y: {
        title: {
          display: true,
          text: 'Frequency',
          color: "hsl(var(--muted-foreground))"
        },
        grid: {
          color: "hsl(var(--border) / 0.5)"
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          stepSize: 1
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
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
}