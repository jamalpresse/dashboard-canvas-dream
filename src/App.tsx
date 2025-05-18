
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";

import DashboardLayout from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Improve from "./pages/Improve";
import Translation from "./pages/Translation";
import News from "./pages/News";
import ImageGeneration from "./pages/ImageGeneration";
import Auth from "./pages/Auth";

// Configure Query Client with retries for better network resilience
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      meta: {
        onError: (error: any) => {
          // Global error handling for queries
          console.error('Query error:', error);
        }
      }
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <ErrorBoundary>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public route - auth page */}
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/" element={
                      <ErrorBoundary>
                        <Index />
                      </ErrorBoundary>
                    } />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/improve" element={<Improve />} />
                    <Route path="/translation" element={<Translation />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/image-generation" element={<ImageGeneration />} />
                    <Route path="/simple-image-generation" element={<Navigate to="/image-generation" replace />} />
                  </Route>
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
