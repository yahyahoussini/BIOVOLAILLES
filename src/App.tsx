import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Cooperatives from "@/pages/Cooperatives";
import Flocks from "@/pages/Flocks";
import PackagingBatches from "@/pages/PackagingBatches";
import SlaughterBatches from "@/pages/SlaughterBatches";
import NotFound from "@/pages/NotFound";
import TraceBatch from "@/pages/TraceBatch";
import UserManagement from "@/pages/UserManagement";
import Livestock from "@/pages/Livestock";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/trace/:batchRef" element={<TraceBatch />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cooperatives" element={<Cooperatives />} />
              <Route path="/flocks" element={<Flocks />} />
              <Route path="/packaging" element={<PackagingBatches />} />
              <Route path="/slaughter" element={<SlaughterBatches />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/livestock" element={<Livestock />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
