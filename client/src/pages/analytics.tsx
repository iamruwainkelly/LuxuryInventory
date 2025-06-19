import { useQuery } from "@tanstack/react-query";
import Charts from "@/components/dashboard/charts";
import StockMovementTable from "@/components/analytics/stock-movement-table";
import LowStockAlerts from "@/components/analytics/low-stock-alerts";

export default function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats/dashboard"],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-2">
          View comprehensive analytics, stock movements, and generate reports.
        </p>
      </div>

      {/* Charts Section */}
      <Charts />

      {/* Stock Movements & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockMovementTable />
        <LowStockAlerts />
      </div>
    </div>
  );
}