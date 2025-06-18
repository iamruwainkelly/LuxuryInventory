import { 
  Package, 
  Users, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: string;
  trend: "up" | "down" | "warning";
  gradient: string;
  isRevenue?: boolean;
}

const iconMap = {
  boxes: Package,
  users: Users,
  "exclamation-triangle": AlertTriangle,
  "dollar-sign": DollarSign,
};

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  trend, 
  gradient, 
  isRevenue 
}: MetricCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Package;
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : AlertTriangle;
  
  const trendColor = trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-red-400";

  return (
    <div className="glass-card p-6 rounded-xl metric-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${isRevenue ? "gradient-text" : ""}`}>
            {value}
          </p>
          <p className={`text-sm mt-1 flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {change}
          </p>
        </div>
        <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
