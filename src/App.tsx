import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import GenesPage from "./pages/GenesPage";
import DiseasesPage from "./pages/DiseasesPage";
import GeneDetail from "./pages/GeneDetail";
import DiseaseDetail from "./pages/DiseaseDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppHeader />
        <main className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/genes" element={<GenesPage />} />
            <Route path="/diseases" element={<DiseasesPage />} />
            <Route path="/gene/:id" element={<GeneDetail />} />
            <Route path="/disease/:id" element={<DiseaseDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
