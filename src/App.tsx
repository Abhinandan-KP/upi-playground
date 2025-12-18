import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UPIProvider } from "@/context/UPIContext";
import Index from "./pages/Index";

import ScanPage from "./pages/ScanPage";
import PayContactsPage from "./pages/PayContactsPage";
import SelfTransferPage from "./pages/SelfTransferPage";
import BalancePage from "./pages/BalancePage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UPIProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="max-w-md mx-auto min-h-screen bg-background shadow-xl">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/pay" element={<PayContactsPage />} />
              <Route path="/transfer" element={<SelfTransferPage />} />
              <Route path="/balance" element={<BalancePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </UPIProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
