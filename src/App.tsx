import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Dictionary from "./pages/Dictionary";
import Fundraising from "./pages/Fundraising";
import Store from "./pages/Store";
import News from "./pages/News";
import Guides from "./pages/Guides";
import Services from "./pages/Services";
import CommunityCats from "./pages/CommunityCats";
import Auth from "./pages/Auth";
import CatVerter from "./pages/CatVerter";
import LostFound from "./pages/LostFound";
import Adoptions from "./pages/Adoptions";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/fundraising" element={<Fundraising />} />
              <Route path="/store" element={<Store />} />
              <Route path="/news" element={<News />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/services" element={<Services />} />
              <Route path="/community-cats" element={<CommunityCats />} />
              <Route path="/cat-verter" element={<CatVerter />} />
              <Route path="/lost-found" element={<LostFound />} />
              <Route path="/adoptions" element={<Adoptions />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
