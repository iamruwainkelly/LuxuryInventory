import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ArrowUp, ArrowDown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StockMovementForm from "./stock-movement-form";
import type { StockMovement } from "@shared/schema";

export default function StockMovementTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [movementFilter, setMovementFilter] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: movements, isLoading } = useQuery<StockMovement[]>({
    queryKey: ["/api/stock/movements"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const getMovementIcon = (type: string) => {
    return type === "in" ? ArrowUp : ArrowDown;
  };

  const getMovementColor = (type: string) => {
    return type === "in" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400";
  };

  const filteredMovements = movements?.filter(movement => 
    movementFilter === "all" || movement.movementType === movementFilter
  ) || [];

  const recentMovements = filteredMovements.slice(0, 10);

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
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
          <h3 className="text-xl font-semibold">Recent Stock Movements</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Type:</label>
              <Select value={movementFilter} onValueChange={setMovementFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="in">In</SelectItem>
                  <SelectItem value="out">Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Movement
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Stock Movement</DialogTitle>
                </DialogHeader>
                <StockMovementForm onSuccess={() => setIsAddModalOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-4 font-medium text-gray-300">Product</th>
              <th className="text-left p-4 font-medium text-gray-300">Type</th>
              <th className="text-left p-4 font-medium text-gray-300">Quantity</th>
              <th className="text-left p-4 font-medium text-gray-300">Reason</th>
              <th className="text-left p-4 font-medium text-gray-300">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentMovements.map((movement) => {
              const IconComponent = getMovementIcon(movement.movementType);
              const movementColor = getMovementColor(movement.movementType);
              const product = products?.find((p: any) => p.id === movement.productId);
              
              return (
                <tr key={movement.id} className="table-row border-b border-white/10">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">{product?.name || "Unknown Product"}</p>
                        <p className="text-xs text-gray-400">{product?.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={movementColor}>
                      <IconComponent className="w-3 h-3 mr-1" />
                      {movement.movementType.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-300 font-medium">
                    {movement.movementType === "in" ? "+" : "-"}{movement.quantity}
                  </td>
                  <td className="p-4 text-gray-300">
                    {movement.reason || "No reason specified"}
                  </td>
                  <td className="p-4 text-gray-300">
                    {movement.createdAt ? new Date(movement.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <p className="text-sm text-gray-400">
          Showing last {recentMovements.length} movements
        </p>
      </div>
    </div>
  );
}