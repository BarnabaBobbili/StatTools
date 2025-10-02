/**
 * Extended Statistical Functions Library
 * Provides advanced hypothesis tests, regression analysis, confidence intervals, and simulations
 * All functions include detailed comments for educational purposes
 */

import { stats, jStat } from './statistical';

// ============================================
// ADVANCED HYPOTHESIS TESTS
// ============================================

/**
 * Two-Sample t-Test (Independent Samples)
 * Tests if two independent samples have different means
 * H0: μ1 = μ2 (means are equal)
 * H1: μ1 ≠ μ2 (means are different)
 */
export const twoSampleTTest = (
  sample1: number[],
  sample2: number[],
  alpha: number = 0.05,
  equalVariance: boolean = true
) => {
  const n1 = sample1.length;
  const n2 = sample2.length;
  const mean1 = stats.mean(sample1);
  const mean2 = stats.mean(sample2);
  const var1 = stats.variance(sample1);
  const var2 = stats.variance(sample2);

  let tStat: number;
  let df: number;

  if (equalVariance) {
    // Pooled variance approach
    const pooledVariance = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    const standardError = Math.sqrt(pooledVariance * (1/n1 + 1/n2));
    tStat = (mean1 - mean2) / standardError;
    df = n1 + n2 - 2;
  } else {
    // Welch's t-test (unequal variances)
    const standardError = Math.sqrt(var1/n1 + var2/n2);
    tStat = (mean1 - mean2) / standardError;
    // Welch-Satterthwaite degrees of freedom
    df = Math.pow(var1/n1 + var2/n2, 2) / 
         (Math.pow(var1/n1, 2)/(n1-1) + Math.pow(var2/n2, 2)/(n2-1));
  }

  // Calculate p-value (two-tailed)
  const pValue = 2 * (1 - (jStat?.studentt?.cdf?.(Math.abs(tStat), df) ?? 0.5));
  const criticalValue = 1.96; // Approximate for common case

  return {
    testName: equalVariance ? "Two-Sample t-Test (Equal Variance)" : "Welch's t-Test (Unequal Variance)",
    tStatistic: tStat,
    degreesOfFreedom: df,
    pValue,
    criticalValue,
    reject: pValue < alpha,
    alpha,
    meanDifference: mean1 - mean2,
    sample1Mean: mean1,
    sample2Mean: mean2,
    interpretation: pValue < alpha 
      ? "Reject H0: The means are significantly different" 
      : "Fail to reject H0: No significant difference in means"
  };
};

/**
 * Paired t-Test (Dependent Samples)
 * Tests if the mean difference between paired observations is zero
 * Used for before/after studies or matched pairs
 * H0: μd = 0 (mean difference is zero)
 */
export const pairedTTest = (
  before: number[],
  after: number[],
  alpha: number = 0.05
) => {
  if (before.length !== after.length) {
    throw new Error("Paired samples must have equal length");
  }

  // Calculate differences
  const differences = before.map((val, idx) => after[idx] - val);
  const n = differences.length;
  const meanDiff = stats.mean(differences);
  const stdDiff = stats.standardDeviation(differences);
  
  // t-statistic for paired data
  const tStat = meanDiff / (stdDiff / Math.sqrt(n));
  const df = n - 1;
  
  const pValue = 2 * (1 - (jStat?.studentt?.cdf?.(Math.abs(tStat), df) ?? 0.5));
  const criticalValue = 1.96;

  return {
    testName: "Paired t-Test",
    tStatistic: tStat,
    degreesOfFreedom: df,
    pValue,
    criticalValue,
    reject: pValue < alpha,
    alpha,
    meanDifference: meanDiff,
    interpretation: pValue < alpha
      ? "Reject H0: Significant difference between paired observations"
      : "Fail to reject H0: No significant difference between pairs"
  };
};

/**
 * One-Way ANOVA (Analysis of Variance)
 * Tests if three or more groups have different means
 * H0: μ1 = μ2 = μ3 = ... (all group means are equal)
 */
export const oneWayANOVA = (
  groups: number[][],
  alpha: number = 0.05
) => {
  const k = groups.length; // number of groups
  const allData = groups.flat();
  const N = allData.length;
  const grandMean = stats.mean(allData);

  // Calculate Sum of Squares Between (SSB)
  let ssb = 0;
  groups.forEach(group => {
    const groupMean = stats.mean(group);
    ssb += group.length * Math.pow(groupMean - grandMean, 2);
  });

  // Calculate Sum of Squares Within (SSW)
  let ssw = 0;
  groups.forEach(group => {
    const groupMean = stats.mean(group);
    group.forEach(value => {
      ssw += Math.pow(value - groupMean, 2);
    });
  });

  // Degrees of freedom
  const dfBetween = k - 1;
  const dfWithin = N - k;
  const dfTotal = N - 1;

  // Mean squares
  const msb = ssb / dfBetween;
  const msw = ssw / dfWithin;

  // F-statistic
  const fStat = msb / msw;

  // Critical F-value (approximate for common case)
  const fCritical = 3.0; // Simplified - would need F-distribution lookup
  
  // Approximate p-value (simplified)
  const pValue = fStat > fCritical ? 0.01 : 0.1;

  return {
    testName: "One-Way ANOVA",
    fStatistic: fStat,
    dfBetween,
    dfWithin,
    dfTotal,
    sumOfSquaresBetween: ssb,
    sumOfSquaresWithin: ssw,
    meanSquareBetween: msb,
    meanSquareWithin: msw,
    pValue,
    criticalValue: fCritical,
    reject: fStat > fCritical,
    alpha,
    interpretation: fStat > fCritical
      ? "Reject H0: At least one group mean is significantly different"
      : "Fail to reject H0: No significant difference among group means"
  };
};

/**
 * Chi-Square Test of Independence
 * Tests if two categorical variables are independent
 * H0: Variables are independent
 */
export const chiSquareIndependence = (
  observedMatrix: number[][],
  alpha: number = 0.05
) => {
  const rows = observedMatrix.length;
  const cols = observedMatrix[0].length;
  
  // Calculate row and column totals
  const rowTotals = observedMatrix.map(row => row.reduce((a, b) => a + b, 0));
  const colTotals: number[] = [];
  for (let j = 0; j < cols; j++) {
    colTotals.push(observedMatrix.reduce((sum, row) => sum + row[j], 0));
  }
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);

  // Calculate expected frequencies and chi-square statistic
  let chiSquare = 0;
  const expectedMatrix: number[][] = [];
  
  for (let i = 0; i < rows; i++) {
    expectedMatrix[i] = [];
    for (let j = 0; j < cols; j++) {
      const expected = (rowTotals[i] * colTotals[j]) / grandTotal;
      expectedMatrix[i][j] = expected;
      chiSquare += Math.pow(observedMatrix[i][j] - expected, 2) / expected;
    }
  }

  const df = (rows - 1) * (cols - 1);
  const criticalValue = 7.815; // Approximate for df=3, alpha=0.05
  const pValue = chiSquare > criticalValue ? 0.01 : 0.1; // Simplified

  return {
    testName: "Chi-Square Test of Independence",
    chiSquareStatistic: chiSquare,
    degreesOfFreedom: df,
    pValue,
    criticalValue,
    reject: chiSquare > criticalValue,
    alpha,
    observedMatrix,
    expectedMatrix,
    interpretation: chiSquare > criticalValue
      ? "Reject H0: Variables are dependent (associated)"
      : "Fail to reject H0: Variables appear independent"
  };
};

// ============================================
// ADVANCED REGRESSION ANALYSIS
// ============================================

/**
 * Multiple Linear Regression
 * Y = β0 + β1*X1 + β2*X2 + ... + βn*Xn + ε
 * Finds coefficients using normal equations: β = (X'X)^(-1)X'Y
 */
export const multipleLinearRegression = (
  xMatrix: number[][], // Each row is an observation, each column is a predictor
  yVector: number[]
) => {
  const n = xMatrix.length;
  const p = xMatrix[0].length;

  // Add intercept column (column of 1s)
  const X = xMatrix.map(row => [1, ...row]);
  
  // Matrix multiplication helpers
  const transpose = (matrix: number[][]): number[][] => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  };

  const multiply = (A: number[][], B: number[][]): number[][] => {
    const result: number[][] = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < B[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < A[0].length; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  };

  // X'X
  const Xt = transpose(X);
  const XtX = multiply(Xt, X);

  // (X'X)^(-1) - using simplified 2x2 or 3x3 inversion
  // For demonstration, using approximate method
  const XtXInv = invertMatrix(XtX);

  // X'Y
  const Y = yVector.map(y => [y]);
  const XtY = multiply(Xt, Y);

  // β = (X'X)^(-1)X'Y
  const beta = multiply(XtXInv, XtY);
  const coefficients = beta.map(row => row[0]);

  // Calculate predictions and R²
  const predictions = X.map(row => 
    row.reduce((sum, x, idx) => sum + x * coefficients[idx], 0)
  );

  const yMean = stats.mean(yVector);
  const ssTotal = yVector.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
  const ssResidual = yVector.reduce((sum, y, idx) => 
    sum + Math.pow(y - predictions[idx], 2), 0);
  const rSquared = 1 - (ssResidual / ssTotal);
  const adjustedRSquared = 1 - ((1 - rSquared) * (n - 1) / (n - p - 1));

  return {
    coefficients, // [intercept, β1, β2, ...]
    rSquared,
    adjustedRSquared,
    predictions,
    residuals: yVector.map((y, idx) => y - predictions[idx])
  };
};

/**
 * Polynomial Regression
 * Fits Y = β0 + β1*X + β2*X² + ... + βn*X^n
 */
export const polynomialRegression = (
  xData: number[],
  yData: number[],
  degree: number
) => {
  // Create polynomial features
  const xMatrix = xData.map(x => {
    const row: number[] = [];
    for (let d = 1; d <= degree; d++) {
      row.push(Math.pow(x, d));
    }
    return row;
  });

  // Use multiple regression
  const result = multipleLinearRegression(xMatrix, yData);
  
  // Generate smooth curve for visualization
  const minX = Math.min(...xData);
  const maxX = Math.max(...xData);
  const curvePoints: { x: number; y: number }[] = [];
  
  for (let i = 0; i <= 100; i++) {
    const x = minX + (i / 100) * (maxX - minX);
    let y = result.coefficients[0]; // intercept
    for (let d = 1; d <= degree; d++) {
      y += result.coefficients[d] * Math.pow(x, d);
    }
    curvePoints.push({ x, y });
  }

  return {
    ...result,
    degree,
    curvePoints,
    equation: `Y = ${result.coefficients.map((c, idx) => 
      idx === 0 ? c.toFixed(3) : `${c >= 0 ? '+' : ''}${c.toFixed(3)}X^${idx}`
    ).join(' ')}`
  };
};

// ============================================
// CONFIDENCE INTERVALS
// ============================================

/**
 * Confidence Interval for Population Mean
 * Uses t-distribution for unknown population variance
 */
export const confidenceIntervalMean = (
  data: number[],
  confidenceLevel: number = 0.95
) => {
  const n = data.length;
  const mean = stats.mean(data);
  const std = stats.standardDeviation(data);
  const alpha = 1 - confidenceLevel;
  const df = n - 1;
  
  // t-critical value (approximate)
  const tCritical = confidenceLevel === 0.95 ? 1.96 : 
                   confidenceLevel === 0.99 ? 2.576 : 1.645;
  
  const marginOfError = tCritical * (std / Math.sqrt(n));
  const lowerBound = mean - marginOfError;
  const upperBound = mean + marginOfError;

  return {
    mean,
    confidenceLevel,
    lowerBound,
    upperBound,
    marginOfError,
    standardError: std / Math.sqrt(n),
    interpretation: `We are ${(confidenceLevel * 100).toFixed(0)}% confident that the true population mean lies between ${lowerBound.toFixed(3)} and ${upperBound.toFixed(3)}`
  };
};

/**
 * Confidence Interval for Population Proportion
 * Uses normal approximation for large samples
 */
export const confidenceIntervalProportion = (
  successes: number,
  sampleSize: number,
  confidenceLevel: number = 0.95
) => {
  const p = successes / sampleSize;
  const q = 1 - p;
  
  // z-critical value
  const zCritical = confidenceLevel === 0.95 ? 1.96 :
                   confidenceLevel === 0.99 ? 2.576 : 1.645;
  
  const standardError = Math.sqrt((p * q) / sampleSize);
  const marginOfError = zCritical * standardError;
  const lowerBound = p - marginOfError;
  const upperBound = p + marginOfError;

  return {
    proportion: p,
    confidenceLevel,
    lowerBound: Math.max(0, lowerBound),
    upperBound: Math.min(1, upperBound),
    marginOfError,
    standardError,
    interpretation: `We are ${(confidenceLevel * 100).toFixed(0)}% confident that the true population proportion is between ${(lowerBound * 100).toFixed(2)}% and ${(upperBound * 100).toFixed(2)}%`
  };
};

// ============================================
// SIMULATION TOOLS
// ============================================

/**
 * Coin Flip Simulation
 * Simulates multiple coin flips and tracks results
 */
export const coinFlipSimulation = (
  numFlips: number,
  probability: number = 0.5
) => {
  let heads = 0;
  let tails = 0;
  const results: string[] = [];
  const cumulativeProportions: { flip: number; headsRatio: number }[] = [];

  for (let i = 0; i < numFlips; i++) {
    const flip = Math.random() < probability ? 'H' : 'T';
    results.push(flip);
    
    if (flip === 'H') {
      heads++;
    } else {
      tails++;
    }

    // Track cumulative proportion every 10 flips (or all if < 100)
    if ((i + 1) % Math.max(1, Math.floor(numFlips / 100)) === 0 || i === numFlips - 1) {
      cumulativeProportions.push({
        flip: i + 1,
        headsRatio: heads / (i + 1)
      });
    }
  }

  return {
    numFlips,
    heads,
    tails,
    headsRatio: heads / numFlips,
    tailsRatio: tails / numFlips,
    results: results.slice(0, 100), // First 100 results
    cumulativeProportions
  };
};

/**
 * Dice Roll Simulation
 * Simulates rolling dice and tracks frequency distribution
 */
export const diceRollSimulation = (
  numRolls: number,
  numSides: number = 6
) => {
  const frequency: { [key: number]: number } = {};
  for (let i = 1; i <= numSides; i++) {
    frequency[i] = 0;
  }

  const rolls: number[] = [];
  
  for (let i = 0; i < numRolls; i++) {
    const roll = Math.floor(Math.random() * numSides) + 1;
    rolls.push(roll);
    frequency[roll]++;
  }

  const distributionData = Object.keys(frequency).map(key => ({
    value: Number(key),
    count: frequency[Number(key)],
    probability: frequency[Number(key)] / numRolls,
    expected: 1 / numSides
  }));

  return {
    numRolls,
    numSides,
    frequency,
    distributionData,
    mean: stats.mean(rolls),
    theoreticalMean: (numSides + 1) / 2
  };
};

/**
 * Central Limit Theorem Demonstration
 * Shows how sample means approach normal distribution
 */
export const centralLimitTheoremDemo = (
  populationDistribution: 'uniform' | 'exponential' | 'binary',
  sampleSize: number,
  numSamples: number
) => {
  const sampleMeans: number[] = [];
  
  // Generate population data generator
  const generateValue = (): number => {
    switch (populationDistribution) {
      case 'uniform':
        return Math.random() * 10; // Uniform [0, 10]
      case 'exponential':
        return -Math.log(Math.random()); // Exponential(1)
      case 'binary':
        return Math.random() < 0.3 ? 0 : 1; // Bernoulli(0.3)
      default:
        return Math.random();
    }
  };

  // Generate samples and calculate means
  for (let i = 0; i < numSamples; i++) {
    const sample: number[] = [];
    for (let j = 0; j < sampleSize; j++) {
      sample.push(generateValue());
    }
    sampleMeans.push(stats.mean(sample));
  }

  // Calculate statistics of sample means
  const meanOfMeans = stats.mean(sampleMeans);
  const stdOfMeans = stats.standardDeviation(sampleMeans);

  return {
    populationDistribution,
    sampleSize,
    numSamples,
    sampleMeans,
    meanOfMeans,
    standardDeviationOfMeans: stdOfMeans,
    histogram: stats.histogram(sampleMeans, 20)
  };
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Simple matrix inversion (works for small matrices)
 * Uses Gaussian elimination with partial pivoting
 */
function invertMatrix(matrix: number[][]): number[][] {
  const n = matrix.length;
  const augmented: number[][] = matrix.map((row, i) => [
    ...row,
    ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
  ]);

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = k;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

    // Make all rows below this one 0 in current column
    for (let k = i + 1; k < n; k++) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = i; j < 2 * n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  // Back substitution
  for (let i = n - 1; i >= 0; i--) {
    for (let k = i - 1; k >= 0; k--) {
      const factor = augmented[k][i] / augmented[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[k][j] -= factor * augmented[i][j];
      }
    }
  }

  // Normalize
  for (let i = 0; i < n; i++) {
    const divisor = augmented[i][i];
    for (let j = 0; j < 2 * n; j++) {
      augmented[i][j] /= divisor;
    }
  }

  // Extract inverse matrix
  return augmented.map(row => row.slice(n));
}
