import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Sigma, 
  BarChart3, 
  Calculator, 
  TestTube, 
  TrendingUp, 
  GitCompare, 
  Target, 
  Dices,
  ArrowRight,
  Sparkles,
  Zap,
  Shield
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Distribution Analysis",
      description: "Visualize and analyze Normal, Binomial, Poisson, Student's t, Uniform, and Exponential distributions with interactive charts."
    },
    {
      icon: TrendingUp,
      title: "Statistical Analysis",
      description: "Calculate descriptive statistics, correlation, regression analysis with comprehensive data visualizations."
    },
    {
      icon: TestTube,
      title: "Hypothesis Testing",
      description: "Perform t-tests, chi-square, ANOVA, Mann-Whitney U, and other statistical tests with detailed results."
    },
    {
      icon: Calculator,
      title: "Probability Calculator",
      description: "Calculate probabilities, quantiles, and cumulative distribution functions for various distributions."
    },
    {
      icon: GitCompare,
      title: "Dataset Comparison",
      description: "Compare multiple datasets side-by-side with visual analysis and statistical comparisons."
    },
    {
      icon: Target,
      title: "Confidence Intervals",
      description: "Calculate confidence intervals for means, proportions, and differences with customizable confidence levels."
    },
    {
      icon: Dices,
      title: "Monte Carlo Simulations",
      description: "Run simulations for Central Limit Theorem, hypothesis testing, and custom probability experiments."
    }
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: "No Installation Required",
      description: "Run directly in your browser"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Real-time calculations and visualizations"
    },
    {
      icon: Shield,
      title: "Professional Grade",
      description: "Accurate statistical computations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-muted">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sigma className="h-5 w-5" />
              <span className="text-sm font-medium">Professional Statistical Analysis Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Statistical Analysis Made
              <br />
              <span className="text-primary-glow">Simple & Powerful</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Everything you need for statistical computations, distribution analysis, hypothesis testing, 
              and data visualization - all in your browser, no setup required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/tools">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-elegant">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center space-y-2">
                  <benefit.icon className="h-8 w-8 mx-auto text-primary-glow" />
                  <h3 className="font-semibold text-sm">{benefit.title}</h3>
                  <p className="text-xs text-primary-foreground/70">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Comprehensive Statistical Toolkit
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From basic descriptive statistics to advanced hypothesis testing and simulations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-card/50 border-y">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Perfect For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold">Students</h3>
              <p className="text-muted-foreground">
                Learn and verify statistical concepts with interactive visualizations
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-xl font-semibold">Researchers</h3>
              <p className="text-muted-foreground">
                Conduct rigorous statistical analysis for your research projects
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold">Data Analysts</h3>
              <p className="text-muted-foreground">
                Quick statistical insights and hypothesis testing for data-driven decisions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-primary text-primary-foreground shadow-elegant">
          <CardContent className="py-16 px-8 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Analysis?
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Access all statistical tools instantly - no account or installation needed
            </p>
            <Link to="/tools">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-elegant">
                Launch StatTools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-2">
              <Sigma className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">StatTools</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Professional statistical analysis and probability tools for researchers, students, and analysts.
              Built with modern web technologies for speed, accuracy, and ease of use.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge variant="outline">React</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">Chart.js</Badge>
              <Badge variant="outline">jStat</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
