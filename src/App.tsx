import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import MagicBackground from "@/components/MagicBackground";

// Eager load the main page for LCP
import Index from "./pages/Index";

// Lazy load routes (not on critical path)
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Profile = lazy(() => import("./pages/Profile"));
const MyCollections = lazy(() => import("./pages/MyCollections"));
const CollectionDetails = lazy(() => import("./pages/CollectionDetails"));

const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CreatePromptPage = lazy(() => import("./pages/admin/CreatePromptPage"));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const AuditLogsPage = lazy(() => import("./pages/admin/AuditLogPage"));
const AdminSubmissions = lazy(() => import("./pages/admin/AdminSubmissions"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Minimal loading fallback
const PageFallback = () => (
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

        {/* Public pages - lazy loaded */}
        <Route
          path="/auth"
          element={
            <Suspense fallback={<PageFallback />}>
              <AuthPage />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<PageFallback />}>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <Suspense fallback={<PageFallback />}>
              <Bookmarks />
            </Suspense>
          }
        />
        <Route
          path="/collections"
          element={
            <Suspense fallback={<PageFallback />}>
              <MyCollections />
            </Suspense>
          }
        />
        <Route
          path="/collections/:id"
          element={
            <Suspense fallback={<PageFallback />}>
              <CollectionDetails />
            </Suspense>
          }
        />
        <Route
          path="/user/:id"
          element={
            <Suspense fallback={<PageFallback />}>
              <Profile />
            </Suspense>
          }
        />

        {/* Admin Routes - lazy loaded and protected */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<PageFallback />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="create"
            element={
              <Suspense fallback={<PageFallback />}>
                <CreatePromptPage />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageFallback />}>
                <SettingsPage />
              </Suspense>
            }
          />

          <Route
            path="users"
            element={
              <Suspense fallback={<PageFallback />}>
                <UsersPage />
              </Suspense>
            }
          />

          <Route
            path="audit"
            element={
              <Suspense fallback={<PageFallback />}>
                <AuditLogsPage />
              </Suspense>
            }
          />

          <Route
            path="submissions"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminSubmissions />
              </Suspense>
            }
          />
        </Route>

        {/* 404 - lazy loaded */}
        <Route
          path="*"
          element={
            <Suspense fallback={<PageFallback />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
