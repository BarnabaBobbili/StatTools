/**
 * Simulation Tools Component
 * Interactive simulations for coin flips, dice rolls, and CLT demonstration
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Dices, Coins, TrendingUp } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { coinFlipSimulation, diceRollSimulation, centralLimitTheoremDemo } from "@/lib/statisticalExtended";

export const SimulationTools = () => {
  const [simType, setSimType] = useState<'coin' | 'dice' | 'clt'>('coin');
  const [numTrials, setNumTrials] = useState(100);
  const [probability, setProbability] = useState(0.5);
  const [numSides, setNumSides] = useState(6);
  const [sampleSize, setSampleSize] = useState(30);
  const [distribution, setDistribution] = useState<'uniform' | 'exponential' | 'binary'>('uniform');
  const [results, setResults] = useState<any>(null);

  const runSimulation = () => {
    try {
      let result;
      
      if (simType === 'coin') {
        result = coinFlipSimulation(numTrials, probability);
      } else if (simType === 'dice') {
        result = diceRollSimulation(numTrials, numSides);
      } else {
        result = centralLimitTheoremDemo(distribution, sampleSize, numTrials);
      }
      
      setResults(result);
      toast.success("Simulation complete!");
    } catch (error) {
      toast.error("Error: " + (error as Error).message);
    }
  };

  const renderChart = () => {
    if (!results) return null;

    if (simType === 'coin' && results.cumulativeProportions) {
      return (
        <Bar
          data={{
            labels: results.cumulativeProportions.map((d: any) => d.flip),
            datasets: [{
              label: 'Heads Ratio',
              data: results.cumulativeProportions.map((d: any) => d.headsRatio),
              backgroundColor: 'hsl(var(--primary))',
            }]
          }}
          options={{ responsive: true, plugins: { legend: { display: true } } }}
        />
      );
    }

    if (simType === 'dice' && results.distributionData) {
      return (
        <Bar
          data={{
            labels: results.distributionData.map((d: any) => d.value),
            datasets: [{
              label: 'Frequency',
              data: results.distributionData.map((d: any) => d.count),
              backgroundColor: 'hsl(var(--secondary))',
            }]
          }}
        />
      );
    }

    if (simType === 'clt' && results.histogram) {
      return (
        <Bar
          data={{
            labels: results.histogram.map((d: any) => d.bin),
            datasets: [{
              label: 'Sample Means Distribution',
              data: results.histogram.map((d: any) => d.count),
              backgroundColor: 'hsl(var(--accent))',
            }]
          }}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dices className="h-5 w-5 text-primary" />
            Statistical Simulations
          </CardTitle>
          <CardDescription>Run probability simulations and demonstrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Simulation Type</Label>
            <Select value={simType} onValueChange={(val: any) => setSimType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coin">Coin Flip</SelectItem>
                <SelectItem value="dice">Dice Roll</SelectItem>
                <SelectItem value="clt">Central Limit Theorem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Number of Trials</Label>
            <Input type="number" value={numTrials} onChange={(e) => setNumTrials(parseInt(e.target.value) || 100)} />
          </div>

          {simType === 'coin' && (
            <div>
              <Label>Probability of Heads</Label>
              <Input type="number" step="0.01" min="0" max="1" value={probability} 
                onChange={(e) => setProbability(parseFloat(e.target.value))} />
            </div>
          )}

          {simType === 'dice' && (
            <div>
              <Label>Number of Sides</Label>
              <Input type="number" min="2" value={numSides} onChange={(e) => setNumSides(parseInt(e.target.value) || 6)} />
            </div>
          )}

          {simType === 'clt' && (
            <>
              <div>
                <Label>Sample Size</Label>
                <Input type="number" min="1" value={sampleSize} onChange={(e) => setSampleSize(parseInt(e.target.value) || 30)} />
              </div>
              <div>
                <Label>Population Distribution</Label>
                <Select value={distribution} onValueChange={(val: any) => setDistribution(val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uniform">Uniform</SelectItem>
                    <SelectItem value="exponential">Exponential</SelectItem>
                    <SelectItem value="binary">Binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button onClick={runSimulation} className="w-full" size="lg">
            <TrendingUp className="h-4 w-4 mr-2" />
            Run Simulation
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader><CardTitle>Results</CardTitle></CardHeader>
          <CardContent>{renderChart()}</CardContent>
        </Card>
      )}
    </div>
  );
};
