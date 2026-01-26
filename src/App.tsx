import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Eager load the main page for LCP
import Index from "./pages/Index";

// Lazy load admin and auth routes (not on critical path)
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CreatePromptPage = lazy(() => import("./pages/admin/CreatePromptPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient with caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Minimal loading fallback for admin routes
const AdminFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <SpeedInsights />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main page - eagerly loaded */}
            <Route path="/" element={<Index />} />

            {/* Auth page - lazy loaded */}
            <Route path="/auth" element={
              <Suspense fallback={<AdminFallback />}>
                <AuthPage />
              </Suspense>
            } />

            {/* Admin Routes - lazy loaded and protected */}
            <Route path="/admin" element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            }>
              <Route index element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="create" element={
                <Suspense fallback={<AdminFallback />}>
                  <CreatePromptPage />
                </Suspense>
              } />
              <Route path="settings" element={
                <Suspense fallback={<AdminFallback />}>
                  <SettingsPage />
                </Suspense>
              } />

              <Route path="users" element={
                <Suspense fallback={<AdminFallback />}>
                  <UsersPage />
                </Suspense>
              } />

              <Route path="audit" element={
                <Suspense fallback={<AdminFallback />}>
                  <AuditLogsPage />
                </Suspense>
              } />
            </Route>

            {/* 404 - lazy loaded */}
            <Route path="*" element={
              <Suspense fallback={<AdminFallback />}>
                <NotFound />
              </Suspense>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
