import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import DiscoverPage from "./pages/DiscoverPage";
import DashboardPage from "./pages/DashboardPage";
import GeneDetail from "./pages/GeneDetail";
import DiseaseDetail from "./pages/DiseaseDetail";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppHeader />
          <main className="min-h-[calc(100vh-4rem)]">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/gene/:id" element={<GeneDetail />} />
              <Route path="/disease/:id" element={<DiseaseDetail />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/suggestions" element={<SuggestionsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <AppFooter />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
