import { useEffect } from "react";
import { SimulationTools } from "@/components/SimulationTools";
import { Navigation } from "@/components/Navigation";
import { Dices } from "lucide-react";

const Simulations = () => {
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
            <Dices className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Monte Carlo Simulations</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Statistical Simulations</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Run Monte Carlo simulations for Central Limit Theorem, hypothesis testing, and custom experiments
          </p>
        </div>

        <SimulationTools />
      </div>
    </div>
  );
};

export default Simulations;
