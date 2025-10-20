import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DistributionChart } from "@/components/DistributionChart";
import { DistributionSelector } from "@/components/DistributionSelector";
import { DistributionType, DistributionParams } from "@/lib/statistical";
import { Navigation } from "@/components/Navigation";
import { BarChart3 } from "lucide-react";

const Distributions = () => {
  const [distribution, setDistribution] = useState<DistributionType>("normal");
  const [params, setParams] = useState<DistributionParams[DistributionType]>({
    mean: 0,
    std: 1
  } as DistributionParams["normal"]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleDistributionChange = (newDistribution: DistributionType) => {
    setDistribution(newDistribution);
    
    switch (newDistribution) {
      case 'normal':
        setParams({ mean: 0, std: 1 } as DistributionParams['normal']);
        break;
      case 'binomial':
        setParams({ n: 10, p: 0.5 } as DistributionParams['binomial']);
        break;
      case 'poisson':
        setParams({ lambda: 3 } as DistributionParams['poisson']);
        break;
      case 'studentt':
        setParams({ df: 10 } as DistributionParams['studentt']);
        break;
      case 'uniform':
        setParams({ min: 0, max: 1 } as DistributionParams['uniform']);
        break;
      case 'exponential':
        setParams({ rate: 1 } as DistributionParams['exponential']);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-muted">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Distribution Analysis</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Probability Distributions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualize and analyze different probability distributions with interactive parameters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <DistributionSelector
              distribution={distribution}
              params={params}
              onDistributionChange={handleDistributionChange}
              onParamsChange={setParams}
            />
          </div>
          
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Distribution Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <DistributionChart
                  distribution={distribution}
                  params={params}
                  showArea={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Distributions;
