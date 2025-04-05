
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BankProvider } from "@/context/BankContext";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/Transfer";
import QRCode from "./pages/QRCode";
import Receive from "./pages/Receive";
import Transactions from "./pages/Transactions";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Create the QueryClient
const queryClient = new QueryClient();

// Create a wrapper component to ensure all React context is properly established
const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BankProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transfer" element={<Transfer />} />
                <Route path="/qr-pay" element={<QRCode />} />
                <Route path="/receive" element={<Receive />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </BankProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
