import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Truck, 
  ClipboardList, 
  BarChart3,
  FileText,
  Brain,
  Building,
  Settings,
  User
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Suppliers", href: "/suppliers", icon: Truck },
  { name: "Orders", href: "/orders", icon: ClipboardList },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "AI Insights", href: "/ai-insights", icon: Brain },
  { name: "Warehouse", href: "/warehouse", icon: Building },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 glass-card border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold gradient-text">LuxInventory</h1>
        <p className="text-sm text-gray-400 mt-1">Premium Management</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href || (location === "/" && item.href === "/dashboard");
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={`sidebar-nav flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                isActive 
                  ? "active text-white bg-primary/20 border-l-3 border-primary" 
                  : "text-gray-300 hover:text-white"
              }`}>
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
