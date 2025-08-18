
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
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
import Transcription from "./pages/Transcription";
import VideoTranscription from "./pages/VideoTranscription";
import News from "./pages/News";
import ImageGeneration from "./pages/ImageGeneration";
import Briefing from "./pages/Briefing";
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
      <ErrorBoundary>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
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
                    <Route path="/analytics" element={
                      <ErrorBoundary>
                        <Analytics />
                      </ErrorBoundary>
                    } />
                    <Route path="/users" element={
                      <ErrorBoundary>
                        <Users />
                      </ErrorBoundary>
                    } />
                    <Route path="/settings" element={
                      <ErrorBoundary>
                        <Settings />
                      </ErrorBoundary>
                    } />
                    <Route path="/search" element={
                      <ErrorBoundary>
                        <Search />
                      </ErrorBoundary>
                    } />
                    <Route path="/improve" element={
                      <ErrorBoundary>
                        <Improve />
                      </ErrorBoundary>
                    } />
                    <Route path="/translation" element={
                      <ErrorBoundary>
                        <Translation />
                      </ErrorBoundary>
                    } />
                    <Route path="/transcription" element={
                      <ErrorBoundary>
                        <Transcription />
                      </ErrorBoundary>
                    } />
                    <Route path="/video-transcription" element={
                      <ErrorBoundary>
                        <VideoTranscription />
                      </ErrorBoundary>
                    } />
                    <Route path="/briefing" element={
                      <ErrorBoundary>
                        <Briefing />
                      </ErrorBoundary>
                    } />
                    <Route path="/news" element={
                      <ErrorBoundary>
                        <News />
                      </ErrorBoundary>
                    } />
                    <Route path="/image-generation" element={
                      <ErrorBoundary>
                        <ImageGeneration />
                      </ErrorBoundary>
                    } />
                    <Route path="/simple-image-generation" element={<Navigate to="/image-generation" replace />} />
                  </Route>
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
