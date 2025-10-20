import { useEffect } from "react";
import { DatasetComparison } from "@/components/DatasetComparison";
import { Navigation } from "@/components/Navigation";
import { GitCompare } from "lucide-react";

const Comparison = () => {
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
            <GitCompare className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Dataset Comparison</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Compare Multiple Datasets</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare statistical properties and visualize differences between multiple datasets
          </p>
        </div>

        <DatasetComparison />
      </div>
    </div>
  );
};

export default Comparison;
