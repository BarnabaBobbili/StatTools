import { useEffect } from "react";
import { ConfidenceIntervals } from "@/components/ConfidenceIntervals";
import { Navigation } from "@/components/Navigation";
import { Target } from "lucide-react";

const Confidence = () => {
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
            <Target className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Confidence Intervals</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Confidence Interval Calculator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate confidence intervals for means, proportions, and differences with customizable confidence levels
          </p>
        </div>

        <ConfidenceIntervals />
      </div>
    </div>
  );
};

export default Confidence;
