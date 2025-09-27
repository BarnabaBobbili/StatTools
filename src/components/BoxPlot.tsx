import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stats } from "@/lib/statistical";

interface BoxPlotProps {
  data: number[];
  title?: string;
}

export function BoxPlot({ data, title = "Box Plot" }: BoxPlotProps) {
  if (data.length < 5) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Need at least 5 data points for box plot
          </p>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  
  // Calculate quartiles
  const q1Index = Math.floor(n * 0.25);
  const q2Index = Math.floor(n * 0.5);
  const q3Index = Math.floor(n * 0.75);
  
  const min = sorted[0];
  const q1 = sorted[q1Index];
  const median = stats.median(data);
  const q3 = sorted[q3Index];
  const max = sorted[n - 1];
  
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  
  // Find outliers
  const outliers = sorted.filter(val => val < lowerFence || val > upperFence);
  
  // Calculate positions for visualization (scaled 0-100%)
  const range = max - min;
  const getPosition = (value: number) => ((value - min) / range) * 100;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Box plot visualization */}
        <div className="relative h-20 bg-muted/20 rounded-lg p-4">
          {/* Whiskers */}
          <div 
            className="absolute top-8 h-1 bg-stats-chart-1"
            style={{
              left: `${getPosition(min)}%`,
              width: `${getPosition(q1) - getPosition(min)}%`
            }}
          />
          <div 
            className="absolute top-8 h-1 bg-stats-chart-1"
            style={{
              left: `${getPosition(q3)}%`,
              width: `${getPosition(max) - getPosition(q3)}%`
            }}
          />
          
          {/* Box */}
          <div 
            className="absolute top-6 h-4 bg-stats-chart-1/70 border-2 border-stats-chart-1 rounded"
            style={{
              left: `${getPosition(q1)}%`,
              width: `${getPosition(q3) - getPosition(q1)}%`
            }}
          />
          
          {/* Median line */}
          <div 
            className="absolute top-6 h-4 w-0.5 bg-stats-chart-2"
            style={{
              left: `${getPosition(median)}%`
            }}
          />
          
          {/* Min/Max markers */}
          <div 
            className="absolute top-7 w-0.5 h-2 bg-stats-chart-1"
            style={{ left: `${getPosition(min)}%` }}
          />
          <div 
            className="absolute top-7 w-0.5 h-2 bg-stats-chart-1"
            style={{ left: `${getPosition(max)}%` }}
          />
          
          {/* Outliers */}
          {outliers.map((outlier, index) => (
            <div
              key={index}
              className="absolute top-8 w-1 h-1 bg-stats-warning rounded-full"
              style={{ left: `${getPosition(outlier)}%` }}
            />
          ))}
        </div>
        
        {/* Value labels */}
        <div className="grid grid-cols-5 gap-2 text-xs text-center">
          <div>
            <p className="font-medium">Min</p>
            <p className="text-muted-foreground">{min.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Q1</p>
            <p className="text-muted-foreground">{q1.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Median</p>
            <p className="text-muted-foreground">{median.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Q3</p>
            <p className="text-muted-foreground">{q3.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Max</p>
            <p className="text-muted-foreground">{max.toFixed(2)}</p>
          </div>
        </div>
        
        {outliers.length > 0 && (
          <div className="text-sm">
            <p className="font-medium">Outliers detected:</p>
            <p className="text-muted-foreground">
              {outliers.map(o => o.toFixed(2)).join(", ")}
            </p>
          </div>
        )}
        
        <div className="text-sm space-y-1">
          <p><strong>IQR:</strong> {iqr.toFixed(2)}</p>
          <p><strong>Lower Fence:</strong> {lowerFence.toFixed(2)}</p>
          <p><strong>Upper Fence:</strong> {upperFence.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}