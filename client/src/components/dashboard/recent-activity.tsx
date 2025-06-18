import { Plus, Edit, AlertTriangle, ShoppingCart } from "lucide-react";

const activities = [
  {
    id: 1,
    icon: Plus,
    iconBg: "bg-green-500",
    title: "New product added",
    description: "iPhone 15 Pro Max added to inventory",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: Edit,
    iconBg: "bg-blue-500",
    title: "Stock updated",
    description: "MacBook Air stock increased by 15 units",
    time: "4 hours ago",
  },
  {
    id: 3,
    icon: AlertTriangle,
    iconBg: "bg-red-500",
    title: "Low stock alert",
    description: "Samsung Galaxy S24 running low (5 units left)",
    time: "6 hours ago",
  },
  {
    id: 4,
    icon: ShoppingCart,
    iconBg: "bg-purple-500",
    title: "New order received",
    description: "Order #1247 from TechCorp Solutions",
    time: "1 day ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="glass-card p-6 rounded-xl lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Recent Activity</h3>
        <button className="text-primary hover:text-primary/80 text-sm transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
              <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-400">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
