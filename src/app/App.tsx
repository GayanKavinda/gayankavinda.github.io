import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ReactLenis } from 'lenis/react';
import { TooltipProvider } from "@shared/components/ui/tooltip";
import CustomCursor from "@shared/components/layout/CustomCursor";
import { ThemeProvider } from "@app/providers/theme-provider";
import { ChatBot } from '@/features/agent';

// ── Pages ─────────────────────────────────────────────────────────────────────
import Home from "@pages/Home";
import AllProjects from "@pages/AllProjects";
import ProjectDetail from "@pages/ProjectDetail";   // NEW
import { Now } from "@pages/NowAndUses";       // NEW
import { Uses } from "@pages/NowAndUses";       // NEW
import NotFound from "@pages/NotFound";

import { PreLoader } from "@shared/components/layout/PreLoader";
import { CacheConsent } from "@shared/components/layout/CacheConsent";
import ScrollToTop from "@shared/components/layout/ScrollToTop";

const queryClient = new QueryClient();

import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Core */}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />

        {/* Redirects for direct section access — ensures /experience etc don't 404 */}
        <Route path="/experience" element={<Navigate to="/#experience" replace />} />
        <Route path="/about" element={<Navigate to="/#about" replace />} />
        <Route path="/contact" element={<Navigate to="/#contact" replace />} />
        <Route path="/skills" element={<Navigate to="/#skills" replace />} />

        {/* Personal pages */}
        <Route path="/now" element={<Now />} />
        <Route path="/uses" element={<Uses />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="gy-theme">
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* <PreLoader> */}
          <CustomCursor />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ScrollToTop />
            <AnimatedRoutes />

            {/* Portfolio Agent - Chatbot */}
            <ChatBot />
            <CacheConsent />
          </BrowserRouter>
          {/* </PreLoader> */}
        </TooltipProvider>
      </QueryClientProvider>
    </ReactLenis>
  </ThemeProvider>
);

export default App;


