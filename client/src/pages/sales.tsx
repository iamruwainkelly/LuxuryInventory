import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, TrendingDown, AlertTriangle, DollarSign, Users, Eye, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Sales() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [quantity, setQuantity] = useState("");
  const [saleType, setSaleType] = useState("sale");
  const [notes, setNotes] = useState("");
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
  });

  const { data: movements = [] } = useQuery({
    queryKey: ["/api/stock/movements"],
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/stats/dashboard"],
  });

  const processSaleMutation = useMutation({
    mutationFn: (data: any) => {
      const promises = [];
      
      // Create stock movement
      promises.push(
        apiRequest(`/api/products/${data.productId}/adjust-stock`, {
          method: "POST",
          body: JSON.stringify({
            type: "out",
            quantity: data.quantity,
            reason: data.reason,
          }),
        })
      );
      
      // Create order if it's a sale
      if (data.type === "sale" && data.clientId) {
        const product = products.find((p: any) => p.id === parseInt(data.productId));
        const orderData = {
          orderNumber: `SAL-${Date.now()}`,
          clientId: parseInt(data.clientId),
          orderType: "sale",
          status: "completed",
          totalAmount: (parseFloat(product?.sellingPrice || "0") * data.quantity).toFixed(2),
          notes: data.notes || "Sales team transaction",
        };
        
        promises.push(
          apiRequest("/api/orders", {
            method: "POST",
            body: JSON.stringify(orderData),
          })
        );
      }
      
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: "Transaction Processed",
        description: "Stock movement and order have been recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stock/movements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/dashboard"] });
      setIsSaleModalOpen(false);
      resetForm();
    },
  });

  const handleTransaction = () => {
    if (!selectedProduct || !quantity) {
      toast({
        title: "Missing Information",
        description: "Please select a product and enter quantity",
        variant: "destructive",
      });
      return;
    }

    const product = products.find((p: any) => p.id === parseInt(selectedProduct));
    if (!product) return;

    if (parseInt(quantity) > (product.currentStock || 0)) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.currentStock || 0} units available`,
        variant: "destructive",
      });
      return;
    }

    const reasonMap = {
      sale: "Sale to customer",
      return: "Customer return - damaged/defective", 
      damage: "Damage during handling",
      refund: "Customer refund request",
      transfer: "Transfer to other location",
      theft: "Theft/Loss",
    };

    processSaleMutation.mutate({
      productId: selectedProduct,
      clientId: selectedClient,
      quantity: parseInt(quantity),
      type: saleType,
      reason: reasonMap[saleType as keyof typeof reasonMap],
      notes,
    });
  };

  const resetForm = () => {
    setSelectedProduct("");
    setSelectedClient("");
    setQuantity("");
    setNotes("");
  };

  const getStockStatus = (product: any) => {
    const stock = product.currentStock || 0;
    const minLevel = product.minStockLevel || 0;
    
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-900 text-red-100" };
    if (stock <= minLevel) return { label: "Low Stock", color: "bg-yellow-900 text-yellow-100" };
    return { label: "In Stock", color: "bg-green-900 text-green-100" };
  };

  const recentSales = movements.filter((m: any) => 
    m.movementType === 'out' && 
    ['Sale to customer', 'Customer return - damaged/defective'].includes(m.reason)
  ).slice(0, 10);

  const salesOrders = orders.filter((o: any) => o.orderType === 'sale').slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Sales Management</h1>
            <p className="text-gray-300 mt-2">
              Manage sales, returns, damages, and stock allocation for the sales team
            </p>
          </div>
          
          <Dialog open={isSaleModalOpen} onOpenChange={setIsSaleModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/10 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Process Transaction</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Record sales, returns, damages, or stock allocation
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Transaction Type</Label>
                  <Select value={saleType} onValueChange={setSaleType}>
                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale to Customer</SelectItem>
                      <SelectItem value="return">Customer Return</SelectItem>
                      <SelectItem value="damage">Damage/Defective</SelectItem>
                      <SelectItem value="refund">Customer Refund</SelectItem>
                      <SelectItem value="transfer">Transfer Out</SelectItem>
                      <SelectItem value="theft">Loss/Theft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product: any) => {
                        const status = getStockStatus(product);
                        return (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{product.name}</span>
                              <span className="text-xs ml-2">Stock: {product.currentStock || 0}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {saleType === 'sale' && (
                  <div className="space-y-2">
                    <Label className="text-white">Client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger className="bg-black/20 border-white/10 text-white">
                        <SelectValue placeholder="Select client (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client: any) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-white">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-black/20 border-white/10 text-white"
                    placeholder="Enter quantity"
                  />
                  {selectedProduct && (
                    <p className="text-xs text-gray-400">
                      Available: {products.find((p: any) => p.id === parseInt(selectedProduct))?.currentStock || 0} units
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Notes (Optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-black/20 border-white/10 text-white"
                    placeholder="Add transaction notes..."
                    rows={2}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsSaleModalOpen(false)}
                    className="flex-1 border-white/10"
                    disabled={processSaleMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleTransaction}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                    disabled={processSaleMutation.isPending}
                  >
                    {processSaleMutation.isPending ? "Processing..." : "Process"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sales Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{products.length}</div>
              <p className="text-xs text-gray-400">Available for sale</p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Sales Today</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {recentSales.filter((s: any) => {
                  const today = new Date().toDateString();
                  return new Date(s.createdAt).toDateString() === today;
                }).length}
              </div>
              <p className="text-xs text-gray-400">Transactions processed</p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {products.filter((p: any) => (p.currentStock || 0) <= (p.minStockLevel || 0)).length}
              </div>
              <p className="text-xs text-gray-400">Need restocking</p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{clients.length}</div>
              <p className="text-xs text-gray-400">Available clients</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="inventory" className="data-[state=active]:bg-white/10">Current Inventory</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white/10">Recent Transactions</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-white/10">Sales Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Product Inventory</CardTitle>
                <CardDescription className="text-gray-300">
                  Current stock levels and product information for sales team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product: any) => {
                    const status = getStockStatus(product);
                    return (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-black/20 rounded border border-white/10">
                        <div className="flex items-center gap-4">
                          <Package className="h-8 w-8 text-blue-400" />
                          <div>
                            <div className="text-white font-medium">{product.name}</div>
                            <div className="text-sm text-gray-400">
                              SKU: {product.sku} | Selling Price: ${product.sellingPrice || 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-white font-medium">
                              {product.currentStock || 0} units
                            </div>
                            <div className="text-sm text-gray-400">
                              Min: {product.minStockLevel || 0}
                            </div>
                          </div>
                          
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Sales Transactions</CardTitle>
                <CardDescription className="text-gray-300">
                  Latest sales, returns, and stock movements processed by sales team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSales.map((movement: any) => {
                    const product = products.find((p: any) => p.id === movement.productId);
                    const isReturn = movement.reason.includes('return');
                    return (
                      <div key={movement.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                        <div className="flex items-center gap-3">
                          {isReturn ? (
                            <TrendingDown className="h-4 w-4 text-yellow-400" />
                          ) : (
                            <ShoppingCart className="h-4 w-4 text-green-400" />
                          )}
                          <div>
                            <div className="text-white font-medium">{product?.name || 'Unknown Product'}</div>
                            <div className="text-sm text-gray-400">{movement.reason}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`font-medium ${isReturn ? 'text-yellow-400' : 'text-green-400'}`}>
                            -{movement.quantity} units
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(movement.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Sales Orders</CardTitle>
                <CardDescription className="text-gray-300">
                  Recent customer orders and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {salesOrders.map((order: any) => {
                    const client = clients.find((c: any) => c.id === order.clientId);
                    return (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="h-4 w-4 text-blue-400" />
                          <div>
                            <div className="text-white font-medium">{order.orderNumber}</div>
                            <div className="text-sm text-gray-400">
                              {client ? client.name : 'Walk-in Customer'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-white font-medium">${order.totalAmount}</div>
                          <Badge className={
                            order.status === 'completed' 
                              ? 'bg-green-900 text-green-100'
                              : order.status === 'pending'
                              ? 'bg-yellow-900 text-yellow-100'
                              : 'bg-gray-900 text-gray-100'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}