import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DistributionChart } from "@/components/DistributionChart";
import { DistributionSelector } from "@/components/DistributionSelector";
import { StatisticalAnalysis } from "@/components/StatisticalAnalysis";
import { ProbabilityCalculator } from "@/components/ProbabilityCalculator";
import { HypothesisTest } from "@/components/HypothesisTest";
import { DatasetComparison } from "@/components/DatasetComparison";
import { AdvancedHypothesisTest } from "@/components/AdvancedHypothesisTest";
import { ConfidenceIntervals } from "@/components/ConfidenceIntervals";
import { SimulationTools } from "@/components/SimulationTools";
import { RegressionVisualization } from "@/components/RegressionVisualization";
import { SpreadsheetDataEntry } from "@/components/SpreadsheetDataEntry";
import { DistributionType, DistributionParams } from "@/lib/statistical";
import { BarChart3, Calculator, TestTube, TrendingUp, Sigma, GitCompare, Target, Dices } from "lucide-react";

const Tools = () => {
  const [distribution, setDistribution] = useState<DistributionType>("normal");
  const [params, setParams] = useState<DistributionParams[DistributionType]>({
    mean: 0,
    std: 1
  } as DistributionParams["normal"]);

  // Load jStat library dynamically
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
    
    // Set default parameters for the selected distribution
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
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sigma className="h-4 w-4" />
              <span className="text-sm font-medium">Statistical Analysis Tools</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Statistical Analysis &
              <br />
              <span className="text-primary-glow">Probability Tools</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Powerful statistical computations, distribution analysis, and hypothesis testing 
              with beautiful visualizations - all in your browser.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <BarChart3 className="h-4 w-4 mr-2" />
                Distribution Analysis
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Calculator className="h-4 w-4 mr-2" />
                Probability Calculations
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <TestTube className="h-4 w-4 mr-2" />
                Hypothesis Testing
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                Data Analysis
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="distributions" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 lg:w-fit mx-auto">
            <TabsTrigger value="distributions" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Distributions</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              <span className="hidden sm:inline">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="probability" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Probability</span>
            </TabsTrigger>
            <TabsTrigger value="hypothesis" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="intervals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Intervals</span>
            </TabsTrigger>
            <TabsTrigger value="simulations" className="flex items-center gap-2">
              <Dices className="h-4 w-4" />
              <span className="hidden sm:inline">Simulations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="distributions" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="analysis">
            <StatisticalAnalysis />
          </TabsContent>

          <TabsContent value="compare">
            <DatasetComparison />
          </TabsContent>

          <TabsContent value="probability">
            <ProbabilityCalculator />
          </TabsContent>

          <TabsContent value="hypothesis">
            <HypothesisTest />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedHypothesisTest />
          </TabsContent>

          <TabsContent value="intervals">
            <ConfidenceIntervals />
          </TabsContent>

          <TabsContent value="simulations">
            <SimulationTools />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-2">
              <Sigma className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">StatTools</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional statistical analysis and probability tools for researchers, students, and analysts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Tools;
