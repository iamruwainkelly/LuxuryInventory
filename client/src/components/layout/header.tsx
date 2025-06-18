import { useState } from "react";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="glass-card-light border-b border-white/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-400">Welcome back, John. Here's your inventory overview.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border-white/20 focus:ring-primary focus:border-transparent backdrop-blur-sm"
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
    </header>
  );
}
