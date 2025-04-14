
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Journal from "./pages/Journal";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import ZoneOutPage from "./pages/ZoneOutPage";
import MoodTrackingPage from "./pages/MoodTrackingPage";
import Settings from "./pages/Settings";
import Feedback from "./pages/Feedback";
import About from "./pages/About";
import History from "./pages/History";
import { MoodProvider } from "@/contexts/MoodContext";

const queryClient = new QueryClient();

const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
      setIsMobile(isMobileDevice);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MoodProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/talk" element={<Index />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/zoneout" element={<ZoneOutPage />} />
              <Route path="/mood-tracking" element={<MoodTrackingPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/about" element={<About />} />
              <Route path="/history" element={<History />} />
              {/* Redirect any other path to landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MoodProvider>
    </QueryClientProvider>
  );
};

export default App;
