import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/Layout";

const Index = lazy(() => import("./pages/Index"));
const Dictionary = lazy(() => import("./pages/Dictionary"));
const Fundraising = lazy(() => import("./pages/Fundraising"));
const Store = lazy(() => import("./pages/Store"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const Guides = lazy(() => import("./pages/Guides"));
const GuideDetail = lazy(() => import("./pages/GuideDetail"));
const Services = lazy(() => import("./pages/Services"));
const CommunityCats = lazy(() => import("./pages/CommunityCats"));
const Auth = lazy(() => import("./pages/Auth"));
const CatVerter = lazy(() => import("./pages/CatVerter"));
const LostFound = lazy(() => import("./pages/LostFound"));
const Adoptions = lazy(() => import("./pages/Adoptions"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageLoader = () => (
  <div className="container mx-auto px-4 py-24 text-center">
    <p className="text-4xl animate-paw-bounce">🐱</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/fundraising" element={<Fundraising />} />
              <Route path="/store" element={<Store />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/:slug" element={<GuideDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/community-cats" element={<CommunityCats />} />
              <Route path="/cat-verter" element={<CatVerter />} />
              <Route path="/lost-found" element={<LostFound />} />
              <Route path="/adoptions" element={<Adoptions />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
