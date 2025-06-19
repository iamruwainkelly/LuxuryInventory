import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlobalSearch from "@/components/search/global-search";

const pageInfo = {
  "/": { title: "Dashboard", subtitle: "Welcome back, John. Here's your inventory overview." },
  "/dashboard": { title: "Dashboard", subtitle: "Welcome back, John. Here's your inventory overview." },
  "/products": { title: "Products", subtitle: "Manage your inventory and track stock levels." },
  "/clients": { title: "Clients", subtitle: "Manage client relationships and contact information." },
  "/suppliers": { title: "Suppliers", subtitle: "Manage supplier relationships and procurement." },
  "/orders": { title: "Orders", subtitle: "Track sales and purchase orders." },
  "/analytics": { title: "Analytics", subtitle: "View comprehensive reports and insights." },
  "/settings": { title: "Settings", subtitle: "Configure your account and system preferences." },
};

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location] = useLocation();
  const currentPage = pageInfo[location as keyof typeof pageInfo] || { title: "Dashboard", subtitle: "Welcome back" };

  return (
    <header className="glass-card-light border-b border-white/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{currentPage.title}</h2>
          <p className="text-gray-400">{currentPage.subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search everything... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => setIsSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || (e.ctrlKey && e.key === 'k')) {
                  e.preventDefault();
                  setIsSearchOpen(true);
                }
              }}
              className="pl-10 pr-4 py-2 bg-white/10 border-white/20 focus:ring-primary focus:border-transparent backdrop-blur-sm cursor-pointer"
              readOnly
            />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2 bg-white/10 hover:bg-white/20">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* Profile */}
          <Button variant="ghost" size="sm" className="flex items-center space-x-2 p-2 bg-white/10 hover:bg-white/20">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
