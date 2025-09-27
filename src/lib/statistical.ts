// Statistical computation utilities
declare global {
  interface Window {
    jStat: any;
  }
}

// Import jStat if available, otherwise provide fallback implementations
export const jStat = typeof window !== 'undefined' && window.jStat 
  ? window.jStat 
  : {
    normal: {
      pdf: (x: number, mean: number = 0, std: number = 1) => {
        const coefficient = 1 / (std * Math.sqrt(2 * Math.PI));
        const exponent = -0.5 * Math.pow((x - mean) / std, 2);
        return coefficient * Math.exp(exponent);
      },
      cdf: (x: number, mean: number = 0, std: number = 1) => {
        return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
      }
    },
    studentt: {
      pdf: (x: number, df: number) => {
        const gamma1 = gamma((df + 1) / 2);
        const gamma2 = gamma(df / 2);
        const coefficient = gamma1 / (Math.sqrt(df * Math.PI) * gamma2);
        return coefficient * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
      }
    }
  };

// Helper functions for statistical calculations
function erf(x: number): number {
  // Approximation of error function
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

function gamma(z: number): number {
  // Stirling's approximation for gamma function
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  z -= 1;
  let x = 0.99999999999980993;
  const g = 7;
  const c = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7
  ];

  for (let i = 0; i < c.length; i++) {
    x += c[i] / (z + i + 1);
  }

  const t = z + g + 0.5;
  const sqrt2pi = Math.sqrt(2 * Math.PI);
  return sqrt2pi * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// Basic statistical functions
export const stats = {
  mean: (data: number[]): number => {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  },

  median: (data: number[]): number => {
    const sorted = [...data].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];
  },

  mode: (data: number[]): number[] => {
    const frequency: { [key: number]: number } = {};
    data.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);
  },

  min: (data: number[]): number => Math.min(...data),
  
  max: (data: number[]): number => Math.max(...data),
  
  range: (data: number[]): number => Math.max(...data) - Math.min(...data),

  variance: (data: number[]): number => {
    const mean = stats.mean(data);
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
  },

  standardDeviation: (data: number[]): number => {
    return Math.sqrt(stats.variance(data));
  },

  skewness: (data: number[]): number => {
    const mean = stats.mean(data);
    const std = stats.standardDeviation(data);
    const n = data.length;
    const skew = data.reduce((sum, val) => sum + Math.pow((val - mean) / std, 3), 0);
    return (n / ((n - 1) * (n - 2))) * skew;
  },

  kurtosis: (data: number[]): number => {
    const mean = stats.mean(data);
    const std = stats.standardDeviation(data);
    const n = data.length;
    const kurt = data.reduce((sum, val) => sum + Math.pow((val - mean) / std, 4), 0);
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * kurt - (3 * (n - 1) * (n - 1)) / ((n - 2) * (n - 3));
  },

  // Frequency distribution for histograms
  histogram: (data: number[], bins: number = 10): { bin: string; count: number; frequency: number }[] => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    
    const binCounts = new Array(bins).fill(0);
    const binLabels: string[] = [];
    
    // Create bin labels
    for (let i = 0; i < bins; i++) {
      const start = min + i * binWidth;
      const end = min + (i + 1) * binWidth;
      binLabels.push(`${start.toFixed(1)}-${end.toFixed(1)}`);
    }
    
    // Count data points in each bin
    data.forEach(value => {
      let binIndex = Math.floor((value - min) / binWidth);
      if (binIndex === bins) binIndex = bins - 1; // Handle edge case
      binCounts[binIndex]++;
    });
    
    return binLabels.map((label, index) => ({
      bin: label,
      count: binCounts[index],
      frequency: binCounts[index] / data.length
    }));
  },

  // Linear regression
  linearRegression: (xData: number[], yData: number[]): {
    slope: number;
    intercept: number;
    rSquared: number;
    correlation: number;
  } => {
    const n = xData.length;
    const sumX = xData.reduce((a, b) => a + b, 0);
    const sumY = yData.reduce((a, b) => a + b, 0);
    const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
    const sumXX = xData.reduce((sum, x) => sum + x * x, 0);
    const sumYY = yData.reduce((sum, y) => sum + y * y, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate correlation coefficient
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    const rSquared = correlation * correlation;
    
    return { slope, intercept, rSquared, correlation };
  }
};

// Distribution types
export interface DistributionParams {
  normal: { mean: number; std: number };
  binomial: { n: number; p: number };
  poisson: { lambda: number };
  uniform: { min: number; max: number };
  exponential: { rate: number };
  studentt: { df: number };
}

export type DistributionType = keyof DistributionParams;

// Generate probability density function data for plotting
export const generatePDFData = (
  distribution: DistributionType,
  params: DistributionParams[DistributionType],
  xMin: number,
  xMax: number,
  points: number = 100
): { x: number; y: number }[] => {
  const data: { x: number; y: number }[] = [];
  const step = (xMax - xMin) / points;

  for (let i = 0; i <= points; i++) {
    const x = xMin + i * step;
    let y = 0;

    switch (distribution) {
      case 'normal':
        const normalParams = params as DistributionParams['normal'];
        y = jStat.normal.pdf(x, normalParams.mean, normalParams.std);
        break;
      case 'binomial':
        const binomialParams = params as DistributionParams['binomial'];
        // For binomial, x should be integers
        const k = Math.round(x);
        if (k >= 0 && k <= binomialParams.n) {
          y = binomialPMF(k, binomialParams.n, binomialParams.p);
        }
        break;
      case 'poisson':
        const poissonParams = params as DistributionParams['poisson'];
        const kPoisson = Math.round(x);
        if (kPoisson >= 0) {
          y = poissonPMF(kPoisson, poissonParams.lambda);
        }
        break;
      case 'studentt':
        const tParams = params as DistributionParams['studentt'];
        y = jStat.studentt.pdf(x, tParams.df);
        break;
      case 'uniform':
        const uniformParams = params as DistributionParams['uniform'];
        y = (x >= uniformParams.min && x <= uniformParams.max) 
          ? 1 / (uniformParams.max - uniformParams.min) 
          : 0;
        break;
      case 'exponential':
        const expParams = params as DistributionParams['exponential'];
        y = x >= 0 ? expParams.rate * Math.exp(-expParams.rate * x) : 0;
        break;
    }

    data.push({ x, y });
  }

  return data;
};

// Helper functions for discrete distributions
function binomialPMF(k: number, n: number, p: number): number {
  if (k < 0 || k > n) return 0;
  return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function poissonPMF(k: number, lambda: number): number {
  if (k < 0) return 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function combination(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Hypothesis testing
export const hypothesisTests = {
  oneSampleTTest: (data: number[], mu0: number, alpha: number = 0.05) => {
    const n = data.length;
    const mean = stats.mean(data);
    const std = stats.standardDeviation(data);
    const tStat = (mean - mu0) / (std / Math.sqrt(n));
    const df = n - 1;
    
    // Critical value approximation
    const tCritical = 1.96; // Simplified for demo
    
    return {
      tStatistic: tStat,
      degreesOfFreedom: df,
      pValue: 2 * (1 - jStat.studentt.cdf ? jStat.studentt.cdf(Math.abs(tStat), df) : 0.5),
      criticalValue: tCritical,
      reject: Math.abs(tStat) > tCritical,
      alpha
    };
  },

  zTest: (data: number[], mu0: number, sigma: number, alpha: number = 0.05) => {
    const n = data.length;
    const mean = stats.mean(data);
    const zStat = (mean - mu0) / (sigma / Math.sqrt(n));
    
    // Critical value for two-tailed test
    const zCritical = 1.96;
    const pValue = 2 * (1 - normalCDF(Math.abs(zStat)));
    
    return {
      zStatistic: zStat,
      degreesOfFreedom: 0, // Z-test doesn't use degrees of freedom
      pValue,
      criticalValue: zCritical,
      reject: Math.abs(zStat) > zCritical,
      alpha
    };
  },

  chiSquareGoodnessOfFit: (observed: number[], expected: number[], alpha: number = 0.05) => {
    if (observed.length !== expected.length) {
      throw new Error("Observed and expected arrays must have the same length");
    }
    
    let chiSquare = 0;
    for (let i = 0; i < observed.length; i++) {
      if (expected[i] > 0) {
        chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
      }
    }
    
    const df = observed.length - 1;
    const criticalValue = 7.815; // Chi-square critical value for df=3, alpha=0.05 (simplified)
    
    return {
      chiSquareStatistic: chiSquare,
      degreesOfFreedom: df,
      criticalValue,
      reject: chiSquare > criticalValue,
      alpha
    };
  }
};

// Helper function for normal CDF approximation
function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}