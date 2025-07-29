import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Toaster from "@/components/ui/toaster";
import TooltipProvider from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Products from "@/pages/products";
import Clients from "@/pages/clients";
import Suppliers from "@/pages/suppliers";
import Orders from "@/pages/orders";
import Analytics from "@/pages/analytics";
import Reports from "@/pages/reports";
import Warehouse from "@/pages/warehouse";
import Sales from "@/pages/sales";
import AIInsights from "@/pages/ai-insights";
import ReturnsRepairs from "@/pages/returns-repairs";
import IntegrationSettings from "@/pages/integration-settings";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <div className="gradient-bg min-h-screen text-white">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-8 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed-2"></div>
      </div>

      <div className="flex min-h-screen relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Header />
          <div className="p-6 overflow-y-auto h-[calc(100vh-5rem)]">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/products" component={Products} />
              <Route path="/clients" component={Clients} />
              <Route path="/suppliers" component={Suppliers} />
              <Route path="/orders" component={Orders} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/reports" component={Reports} />
              <Route path="/warehouse" component={Warehouse} />
              <Route path="/sales" component={Sales} />
              <Route path="/ai-insights" component={AIInsights} />
              <Route path="/returns-repairs" component={ReturnsRepairs} />
              <Route path="/integration" component={IntegrationSettings} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
