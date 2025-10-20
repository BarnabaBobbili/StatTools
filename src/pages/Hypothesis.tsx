import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HypothesisTest } from "@/components/HypothesisTest";
import { AdvancedHypothesisTest } from "@/components/AdvancedHypothesisTest";
import { Navigation } from "@/components/Navigation";
import { TestTube } from "lucide-react";

const Hypothesis = () => {
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
            <TestTube className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Hypothesis Testing</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Statistical Hypothesis Tests</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Perform various statistical tests including t-tests, chi-square, ANOVA, and non-parametric tests
          </p>
        </div>

        <Tabs defaultValue="basic" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="basic">Basic Tests</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <HypothesisTest />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedHypothesisTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Hypothesis;
