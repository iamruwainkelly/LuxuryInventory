import { useQuery } from "@tanstack/react-query";
import MetricCard from "@/components/dashboard/metric-card";
import Charts from "@/components/dashboard/charts";
import RecentActivity from "@/components/dashboard/recent-activity";
import ProductTable from "@/components/products/product-table";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-xl animate-pulse">
              <div className="h-20 bg-muted/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          change="+12% from last month"
          icon="boxes"
          trend="up"
          gradient="from-blue-500 to-purple-500"
        />
        <MetricCard
          title="Total Clients"
          value={stats?.totalClients || 0}
          change="+8% from last month"
          icon="users"
          trend="up"
          gradient="from-green-500 to-emerald-500"
        />
        <MetricCard
          title="Low Stock Alerts"
          value={stats?.lowStockAlerts || 0}
          change="Requires attention"
          icon="exclamation-triangle"
          trend="warning"
          gradient="from-red-500 to-pink-500"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${stats?.monthlyRevenue?.toLocaleString() || 0}`}
          change="+15% from last month"
          icon="dollar-sign"
          trend="up"
          gradient="from-yellow-500 to-orange-500"
          isRevenue
        />
      </div>

      {/* Charts Section */}
      <Charts />

      {/* Category Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Charts showCategoryChart />
        <RecentActivity />
      </div>

      {/* Products Table */}
      <ProductTable isDashboard />
    </div>
  );
}
