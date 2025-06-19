import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LowStockAlerts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const lowStockProducts = products?.filter((product: any) => 
    product.currentStock <= product.minStockLevel
  ) || [];

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-xl font-semibold">Low Stock Alerts</h3>
          </div>
          <Badge className="bg-red-500/20 text-red-400">
            {lowStockProducts.length} alerts
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        {lowStockProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No low stock alerts</p>
            <p className="text-sm text-gray-500 mt-1">All products are adequately stocked</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lowStockProducts.map((product: any) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-400 font-medium">
                    {product.currentStock} / {product.minStockLevel} units
                  </p>
                  <Badge className="bg-red-500/20 text-red-400 text-xs mt-1">
                    {product.currentStock === 0 ? "Out of Stock" : "Low Stock"}
                  </Badge>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-white/10">
              <Button className="w-full btn-primary" size="sm">
                Generate Restock Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}