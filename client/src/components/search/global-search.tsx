import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Package, Users, Truck, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
    enabled: query.length > 0,
  });

  const { data: clients } = useQuery({
    queryKey: ["/api/clients"],
    enabled: query.length > 0,
  });

  const { data: suppliers } = useQuery({
    queryKey: ["/api/suppliers"],
    enabled: query.length > 0,
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
    enabled: query.length > 0,
  });

  const filteredResults = {
    products: products?.filter((item: any) => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.sku.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3) || [],
    clients: clients?.filter((item: any) => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.email?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3) || [],
    suppliers: suppliers?.filter((item: any) => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.contactEmail?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3) || [],
    orders: orders?.filter((item: any) => 
      item.orderNumber.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3) || [],
  };

  const handleNavigate = (type: string, id?: number) => {
    switch (type) {
      case "products":
        setLocation("/products");
        break;
      case "clients":
        setLocation("/clients");
        break;
      case "suppliers":
        setLocation("/suppliers");
        break;
      case "orders":
        setLocation("/orders");
        break;
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Global Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Search products, clients, suppliers, orders..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white/10 border-white/20 focus:ring-primary"
            autoFocus
          />

          {query.length > 0 && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Products */}
              {filteredResults.products.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Products
                  </h3>
                  <div className="space-y-2">
                    {filteredResults.products.map((product: any) => (
                      <div
                        key={product.id}
                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                        onClick={() => handleNavigate("products", product.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-400">{product.sku}</p>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {product.currentStock} units
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clients */}
              {filteredResults.clients.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Clients
                  </h3>
                  <div className="space-y-2">
                    {filteredResults.clients.map((client: any) => (
                      <div
                        key={client.id}
                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                        onClick={() => handleNavigate("clients", client.id)}
                      >
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-400">{client.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suppliers */}
              {filteredResults.suppliers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Suppliers
                  </h3>
                  <div className="space-y-2">
                    {filteredResults.suppliers.map((supplier: any) => (
                      <div
                        key={supplier.id}
                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                        onClick={() => handleNavigate("suppliers", supplier.id)}
                      >
                        <div>
                          <p className="font-medium">{supplier.name}</p>
                          <p className="text-sm text-gray-400">{supplier.contactEmail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders */}
              {filteredResults.orders.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Orders
                  </h3>
                  <div className="space-y-2">
                    {filteredResults.orders.map((order: any) => (
                      <div
                        key={order.id}
                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                        onClick={() => handleNavigate("orders", order.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{order.orderNumber}</p>
                            <p className="text-sm text-gray-400 capitalize">{order.orderType} Order</p>
                          </div>
                          <Badge className="bg-purple-500/20 text-purple-400">
                            ${order.totalAmount}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {Object.values(filteredResults).every(arr => arr.length === 0) && (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No results found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}