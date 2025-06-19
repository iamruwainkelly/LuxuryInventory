import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, ShoppingCart, Package2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import OrderForm from "./order-form";
import type { Order } from "@shared/schema";

export default function OrderTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      apiRequest("PUT", `/api/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Success", description: "Order status updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update order status", variant: "destructive" });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "confirmed": return "bg-blue-500/20 text-blue-400";
      case "shipped": return "bg-purple-500/20 text-purple-400";
      case "delivered": return "bg-green-500/20 text-green-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getOrderIcon = (orderType: string) => {
    return orderType === "sale" ? ShoppingCart : Package2;
  };

  const filteredOrders = orders?.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  ) || [];

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
          <h3 className="text-xl font-semibold">Orders</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/10 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                </DialogHeader>
                <OrderForm onSuccess={() => setIsAddModalOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-4 font-medium text-gray-300">Order #</th>
              <th className="text-left p-4 font-medium text-gray-300">Type</th>
              <th className="text-left p-4 font-medium text-gray-300">Customer/Supplier</th>
              <th className="text-left p-4 font-medium text-gray-300">Amount</th>
              <th className="text-left p-4 font-medium text-gray-300">Status</th>
              <th className="text-left p-4 font-medium text-gray-300">Date</th>
              <th className="text-left p-4 font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const IconComponent = getOrderIcon(order.orderType);
              const statusColor = getStatusColor(order.status || "pending");
              
              return (
                <tr key={order.id} className="table-row border-b border-white/10">
                  <td className="p-4 text-gray-300 font-medium">{order.orderNumber}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 ${order.orderType === "sale" ? "bg-green-500/20" : "bg-blue-500/20"} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="capitalize text-gray-300">{order.orderType}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">
                    {order.orderType === "sale" ? "Client" : "Supplier"} #{order.clientId || order.supplierId}
                  </td>
                  <td className="p-4 text-gray-300 font-medium">
                    ${order.totalAmount || "0.00"}
                  </td>
                  <td className="p-4">
                    <Select 
                      value={order.status || "pending"} 
                      onValueChange={(status) => updateStatusMutation.mutate({ id: order.id, status })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 w-32">
                        <Badge className={statusColor}>
                          {order.status || "pending"}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4 text-gray-300">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            onClick={() => setEditingOrder(order)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-white/10 max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Edit Order</DialogTitle>
                          </DialogHeader>
                          {editingOrder && (
                            <OrderForm 
                              order={editingOrder} 
                              onSuccess={() => setEditingOrder(null)} 
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing 1-{filteredOrders.length} of {filteredOrders.length} orders
        </p>
      </div>
    </div>
  );
}