import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ReactLenis } from 'lenis/react';
import { TooltipProvider } from "@components/ui/tooltip";
import CustomCursor from "@components/layout/CustomCursor";
import { ThemeProvider } from "@app/providers/theme-provider";
import StickyResumeCTA from "@components/layout/StickyResumeCTA";


import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';

// ── Pages (Lazy Loaded) ────────────────────────────────────────────────────────
const Home = lazy(() => import("@pages/Home"));
const AllProjects = lazy(() => import("@pages/AllProjects"));
const ProjectDetail = lazy(() => import("@pages/ProjectDetail"));
const Now = lazy(() => import("@pages/NowAndUses").then(m => ({ default: m.Now })));
const Uses = lazy(() => import("@pages/NowAndUses").then(m => ({ default: m.Uses })));
const NotFound = lazy(() => import("@pages/NotFound"));

import { PreLoader } from "@components/layout/PreLoader";
import { CacheConsent } from "@components/layout/CacheConsent";
import SmartScroll from "@components/layout/SmartScroll";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
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
    );
  };

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="gy-theme">
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <PreLoader>
            <CustomCursor />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <SmartScroll />
<Suspense fallback={
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <div className="w-12 h-[1px] bg-gold animate-pulse" />
          </div>
        }>
                <AnimatedRoutes />
              </Suspense>


              <CacheConsent />
              <StickyResumeCTA />
            </BrowserRouter>
          </PreLoader>
        </TooltipProvider>
      </QueryClientProvider>
    </ReactLenis>
  </ThemeProvider>
);

export default App;


