// Sample datasets for quick testing and demonstration

export const sampleDatasets = {
  heights: {
    name: "Heights (cm)",
    description: "Sample heights of 20 adults",
    data: [165, 170, 168, 172, 175, 169, 171, 173, 167, 176, 164, 178, 169, 172, 170, 174, 168, 171, 173, 177],
  },
  testScores: {
    name: "Test Scores",
    description: "Student exam scores (0-100)",
    data: [78, 85, 92, 88, 76, 95, 82, 89, 91, 87, 84, 90, 86, 83, 88, 94, 79, 85, 92, 88],
  },
  temperatures: {
    name: "Daily Temperatures (°C)",
    description: "Average daily temperatures",
    data: [22, 24, 23, 25, 26, 24, 23, 27, 28, 26, 25, 24, 22, 23, 25, 26, 27, 25, 24, 23],
  },
  salesData: {
    name: "Sales Data",
    description: "Monthly sales in thousands",
    data: [45, 52, 48, 55, 61, 58, 63, 59, 67, 72, 68, 75],
  },
  normalDist: {
    name: "Normal Distribution",
    description: "Data following normal distribution",
    data: [98, 102, 100, 105, 95, 103, 99, 101, 97, 104, 100, 98, 102, 99, 103, 101, 96, 104, 100, 102],
  },
  skewedData: {
    name: "Right-Skewed Data",
    description: "Positively skewed distribution",
    data: [10, 12, 11, 13, 15, 14, 20, 25, 18, 16, 30, 12, 13, 11, 14, 35, 15, 40, 22, 28],
  },
};

export const sampleRegressionData = {
  linearPositive: {
    name: "Linear Positive",
    description: "Strong positive correlation",
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [2.1, 4.3, 5.8, 8.2, 10.1, 11.9, 14.3, 15.8, 18.2, 20.1],
  },
  linearNegative: {
    name: "Linear Negative",
    description: "Strong negative correlation",
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [20, 18, 16, 14, 12, 10, 8, 6, 4, 2],
  },
  studyHours: {
    name: "Study Hours vs Grades",
    description: "Study time and test scores",
    x: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    y: [65, 68, 72, 75, 78, 82, 85, 88, 92, 95],
  },
};

export type SampleDatasetKey = keyof typeof sampleDatasets;
export type SampleRegressionKey = keyof typeof sampleRegressionData;
