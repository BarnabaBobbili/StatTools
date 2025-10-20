import { useEffect } from "react";
import { StatisticalAnalysis } from "@/components/StatisticalAnalysis";
import { Navigation } from "@/components/Navigation";
import { TrendingUp } from "lucide-react";

const Analysis = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-muted">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Statistical Analysis</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Data Analysis & Statistics</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate descriptive statistics, correlation, and regression analysis with comprehensive visualizations
          </p>
        </div>

        <StatisticalAnalysis />
      </div>
    </div>
  );
};

export default Analysis;
