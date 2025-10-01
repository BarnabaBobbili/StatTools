import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="mean">Mean (μ)</Label>
                <span className="text-sm font-mono text-muted-foreground">{normalParams.mean.toFixed(2)}</span>
              </div>
              <Slider
                id="mean"
                value={[normalParams.mean]}
                onValueChange={([value]) => onParamsChange({
                  ...normalParams,
                  mean: value
                })}
                min={-10}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="std">Standard Deviation (σ)</Label>
                <span className="text-sm font-mono text-muted-foreground">{normalParams.std.toFixed(2)}</span>
              </div>
              <Slider
                id="std"
                value={[normalParams.std]}
                onValueChange={([value]) => onParamsChange({
                  ...normalParams,
                  std: Math.max(0.1, value)
                })}
                min={0.1}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'binomial':
        const binomialParams = params as DistributionParams['binomial'];
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="n">Number of Trials (n)</Label>
                <span className="text-sm font-mono text-muted-foreground">{binomialParams.n}</span>
              </div>
              <Slider
                id="n"
                value={[binomialParams.n]}
                onValueChange={([value]) => onParamsChange({
                  ...binomialParams,
                  n: Math.max(1, Math.round(value))
                })}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="p">Probability of Success (p)</Label>
                <span className="text-sm font-mono text-muted-foreground">{binomialParams.p.toFixed(2)}</span>
              </div>
              <Slider
                id="p"
                value={[binomialParams.p]}
                onValueChange={([value]) => onParamsChange({
                  ...binomialParams,
                  p: Math.min(1, Math.max(0, value))
                })}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'poisson':
        const poissonParams = params as DistributionParams['poisson'];
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="lambda">Rate Parameter (λ)</Label>
              <span className="text-sm font-mono text-muted-foreground">{poissonParams.lambda.toFixed(2)}</span>
            </div>
            <Slider
              id="lambda"
              value={[poissonParams.lambda]}
              onValueChange={([value]) => onParamsChange({
                lambda: Math.max(0.1, value)
              })}
              min={0.1}
              max={20}
              step={0.1}
              className="w-full"
            />
          </div>
        );

      case 'studentt':
        const tParams = params as DistributionParams['studentt'];
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="df">Degrees of Freedom</Label>
              <span className="text-sm font-mono text-muted-foreground">{tParams.df}</span>
            </div>
            <Slider
              id="df"
              value={[tParams.df]}
              onValueChange={([value]) => onParamsChange({
                df: Math.max(1, Math.round(value))
              })}
              min={1}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        );

      case 'uniform':
        const uniformParams = params as DistributionParams['uniform'];
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="min">Minimum</Label>
                <span className="text-sm font-mono text-muted-foreground">{uniformParams.min.toFixed(2)}</span>
              </div>
              <Slider
                id="min"
                value={[uniformParams.min]}
                onValueChange={([value]) => {
                  onParamsChange({
                    ...uniformParams,
                    min: value,
                    max: Math.max(value + 0.1, uniformParams.max)
                  });
                }}
                min={-10}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="max">Maximum</Label>
                <span className="text-sm font-mono text-muted-foreground">{uniformParams.max.toFixed(2)}</span>
              </div>
              <Slider
                id="max"
                value={[uniformParams.max]}
                onValueChange={([value]) => {
                  onParamsChange({
                    ...uniformParams,
                    max: Math.max(uniformParams.min + 0.1, value)
                  });
                }}
                min={-10}
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        );

      case 'exponential':
        const expParams = params as DistributionParams['exponential'];
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="rate">Rate (λ)</Label>
              <span className="text-sm font-mono text-muted-foreground">{expParams.rate.toFixed(2)}</span>
            </div>
            <Slider
              id="rate"
              value={[expParams.rate]}
              onValueChange={([value]) => onParamsChange({
                rate: Math.max(0.1, value)
              })}
              min={0.1}
              max={5}
              step={0.1}
              className="w-full"
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