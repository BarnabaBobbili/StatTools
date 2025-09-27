import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DistributionType, DistributionParams } from "@/lib/statistical";

interface DistributionSelectorProps {
  distribution: DistributionType;
  params: DistributionParams[DistributionType];
  onDistributionChange: (distribution: DistributionType) => void;
  onParamsChange: (params: DistributionParams[DistributionType]) => void;
}

export function DistributionSelector({
  distribution,
  params,
  onDistributionChange,
  onParamsChange
}: DistributionSelectorProps) {
  const distributions = [
    { value: 'normal', label: 'Normal Distribution' },
    { value: 'binomial', label: 'Binomial Distribution' },
    { value: 'poisson', label: 'Poisson Distribution' },
    { value: 'studentt', label: 'Student\'s t-Distribution' },
    { value: 'uniform', label: 'Uniform Distribution' },
    { value: 'exponential', label: 'Exponential Distribution' },
  ] as const;

  const renderParameterInputs = () => {
    switch (distribution) {
      case 'normal':
        const normalParams = params as DistributionParams['normal'];
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mean">Mean (μ)</Label>
              <Input
                id="mean"
                type="number"
                value={normalParams.mean}
                onChange={(e) => onParamsChange({
                  ...normalParams,
                  mean: parseFloat(e.target.value) || 0
                })}
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="std">Standard Deviation (σ)</Label>
              <Input
                id="std"
                type="number"
                value={normalParams.std}
                onChange={(e) => onParamsChange({
                  ...normalParams,
                  std: Math.max(0.1, parseFloat(e.target.value) || 1)
                })}
                step="0.1"
                min="0.1"
              />
            </div>
          </div>
        );

      case 'binomial':
        const binomialParams = params as DistributionParams['binomial'];
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="n">Number of Trials (n)</Label>
              <Input
                id="n"
                type="number"
                value={binomialParams.n}
                onChange={(e) => onParamsChange({
                  ...binomialParams,
                  n: Math.max(1, parseInt(e.target.value) || 1)
                })}
                min="1"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p">Probability of Success (p)</Label>
              <Input
                id="p"
                type="number"
                value={binomialParams.p}
                onChange={(e) => onParamsChange({
                  ...binomialParams,
                  p: Math.min(1, Math.max(0, parseFloat(e.target.value) || 0.5))
                })}
                step="0.01"
                min="0"
                max="1"
              />
            </div>
          </div>
        );

      case 'poisson':
        const poissonParams = params as DistributionParams['poisson'];
        return (
          <div className="space-y-2">
            <Label htmlFor="lambda">Rate Parameter (λ)</Label>
            <Input
              id="lambda"
              type="number"
              value={poissonParams.lambda}
              onChange={(e) => onParamsChange({
                lambda: Math.max(0.1, parseFloat(e.target.value) || 1)
              })}
              step="0.1"
              min="0.1"
            />
          </div>
        );

      case 'studentt':
        const tParams = params as DistributionParams['studentt'];
        return (
          <div className="space-y-2">
            <Label htmlFor="df">Degrees of Freedom</Label>
            <Input
              id="df"
              type="number"
              value={tParams.df}
              onChange={(e) => onParamsChange({
                df: Math.max(1, parseInt(e.target.value) || 1)
              })}
              min="1"
              step="1"
            />
          </div>
        );

      case 'uniform':
        const uniformParams = params as DistributionParams['uniform'];
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min">Minimum</Label>
              <Input
                id="min"
                type="number"
                value={uniformParams.min}
                onChange={(e) => {
                  const newMin = parseFloat(e.target.value) || 0;
                  onParamsChange({
                    ...uniformParams,
                    min: newMin,
                    max: Math.max(newMin + 0.1, uniformParams.max)
                  });
                }}
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">Maximum</Label>
              <Input
                id="max"
                type="number"
                value={uniformParams.max}
                onChange={(e) => {
                  const newMax = parseFloat(e.target.value) || 1;
                  onParamsChange({
                    ...uniformParams,
                    max: Math.max(uniformParams.min + 0.1, newMax)
                  });
                }}
                step="0.1"
              />
            </div>
          </div>
        );

      case 'exponential':
        const expParams = params as DistributionParams['exponential'];
        return (
          <div className="space-y-2">
            <Label htmlFor="rate">Rate (λ)</Label>
            <Input
              id="rate"
              type="number"
              value={expParams.rate}
              onChange={(e) => onParamsChange({
                rate: Math.max(0.1, parseFloat(e.target.value) || 1)
              })}
              step="0.1"
              min="0.1"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Distribution Parameters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Distribution Type</Label>
          <Select value={distribution} onValueChange={(value) => onDistributionChange(value as DistributionType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a distribution" />
            </SelectTrigger>
            <SelectContent>
              {distributions.map((dist) => (
                <SelectItem key={dist.value} value={dist.value}>
                  {dist.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {renderParameterInputs()}
      </CardContent>
    </Card>
  );
}