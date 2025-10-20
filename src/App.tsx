import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Distributions from "./pages/Distributions";
import Analysis from "./pages/Analysis";
import Comparison from "./pages/Comparison";
import Probability from "./pages/Probability";
import Hypothesis from "./pages/Hypothesis";
import Confidence from "./pages/Confidence";
import Simulations from "./pages/Simulations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toast notifications with custom positioning for mobile */}
      <Toaster />
      <Sonner 
        position="top-center"
        expand={true}
        richColors
        closeButton
        toastOptions={{
          style: {
            fontSize: '14px',
          },
          className: 'toast-mobile-friendly',
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/distributions" element={<Distributions />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/probability" element={<Probability />} />
          <Route path="/hypothesis" element={<Hypothesis />} />
          <Route path="/confidence" element={<Confidence />} />
          <Route path="/simulations" element={<Simulations />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
