export interface DashboardStats {
  totalProducts: number;
  totalClients: number;
  lowStockAlerts: number;
  monthlyRevenue: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ActivityItem {
  id: number;
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}
