import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { TooltipProvider } from "@shared/components/ui/tooltip";
import CustomCursor from "@shared/components/layout/CustomCursor";
import ResumeButton from "@shared/components/common/ResumeButton";
import { ThemeProvider } from "@app/providers/theme-provider";
import { ChatBot } from '@/features/agent';

// ── Pages ─────────────────────────────────────────────────────────────────────
import Home          from "@pages/Home";
import AllProjects   from "@pages/AllProjects";
import ProjectDetail from "@pages/ProjectDetail";   // NEW
import BlogList      from "@pages/BlogList";         // NEW
import BlogPost      from "@pages/BlogPost";         // NEW
import { Now }       from "@pages/NowAndUses";       // NEW
import { Uses }      from "@pages/NowAndUses";       // NEW
import NotFound      from "@pages/NotFound";

import { PreLoader } from "@shared/components/layout/PreLoader";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="gy-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PreLoader>
          <CustomCursor />
          <ResumeButton />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              {/* Core */}
              <Route path="/"                       element={<Home />} />
              <Route path="/projects"               element={<AllProjects />} />
              <Route path="/projects/:slug"         element={<ProjectDetail />} />

              {/* Redirects for direct section access — ensures /experience etc don't 404 */}
              <Route path="/experience"             element={<Navigate to="/#experience" replace />} />
              <Route path="/about"                  element={<Navigate to="/#about"      replace />} />
              <Route path="/contact"                element={<Navigate to="/#contact"    replace />} />
              <Route path="/skills"                 element={<Navigate to="/#skills"     replace />} />

              {/* Blog */}
              <Route path="/blog"                   element={<BlogList />} />
              <Route path="/blog/:slug"             element={<BlogPost />} />

              {/* Personal pages */}
              <Route path="/now"                    element={<Now />} />
              <Route path="/uses"                   element={<Uses />} />

              {/* Catch-all */}
              <Route path="*"                       element={<NotFound />} />
            </Routes>
            
            {/* Portfolio Agent - Chatbot */}
            <ChatBot />
          </BrowserRouter>
        </PreLoader>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;


