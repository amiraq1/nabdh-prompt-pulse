import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AuthPage from "./pages/AuthPage";
import Settings from "./pages/Settings";
import MagicBackground from "@/components/MagicBackground";
import Bookmarks from "./pages/Bookmarks";

// Eager load the main page for LCP
import Index from "./pages/Index";

// Lazy load admin and auth routes (not on critical path)
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CreatePromptPage = lazy(() => import("./pages/admin/CreatePromptPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogPage"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Minimal loading fallback for admin routes
const AdminFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <>
    {import.meta.env.PROD &&
      typeof window !== "undefined" &&
      !["localhost", "127.0.0.1"].includes(window.location.hostname) && (
        <SpeedInsights />
      )}
    <Toaster />
    <Sonner />
    <MagicBackground />
    <BrowserRouter>
      <Routes>
        {/* Main page - eagerly loaded */}
        <Route path="/" element={<Index />} />

        {/* Auth page - lazy loaded */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/bookmarks" element={<Bookmarks />} />

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

          <Route path="submissions" element={<AdminSubmissions />} />
        </Route>

        {/* 404 - lazy loaded */}
        <Route path="*" element={
          <Suspense fallback={<AdminFallback />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;


