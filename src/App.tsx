import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import MagicBackground from "@/components/MagicBackground";
import { Loader2 } from "lucide-react";
import MobileNav from "@/components/MobileNav";

const Index = lazy(() => import("./pages/Index"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const MyCollections = lazy(() => import("./pages/MyCollections"));
const CollectionDetails = lazy(() => import("./pages/CollectionDetails"));
const PromptDetails = lazy(() => import("./pages/PromptDetails"));
const SubmitPrompt = lazy(() => import("./pages/SubmitPrompt"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Suspense fallback={<PageLoader />}>
        <MobileNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/collections" element={<MyCollections />} />
          <Route path="/collections/:id" element={<CollectionDetails />} />
          <Route path="/prompts/:id" element={<PromptDetails />} />
          <Route path="/submit" element={<SubmitPrompt />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </>
);

export default App;
