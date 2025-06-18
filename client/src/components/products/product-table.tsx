import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus, Smartphone, Laptop, Headphones, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "./product-form";
import type { Product } from "@shared/schema";

interface ProductTableProps {
  isDashboard?: boolean;
}

const iconMap = {
  1: Smartphone, // Electronics
  2: Package,    // Furniture  
  3: Headphones, // Audio
};

export default function ProductTable({ isDashboard }: ProductTableProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Success", description: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { label: "Critical", color: "bg-red-500/20 text-red-400" };
    if (current <= min * 1.5) return { label: "Low Stock", color: "bg-yellow-500/20 text-yellow-400" };
    return { label: "In Stock", color: "bg-green-500/20 text-green-400" };
  };

  const getProductIcon = (categoryId: number | null) => {
    const IconComponent = iconMap[categoryId as keyof typeof iconMap] || Package;
    return IconComponent;
  };

  const filteredProducts = products?.filter(product => 
    categoryFilter === "all" || product.categoryId?.toString() === categoryFilter
  ) || [];

  const displayProducts = isDashboard ? filteredProducts.slice(0, 4) : filteredProducts;

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
          <h3 className="text-xl font-semibold">
            {isDashboard ? "Product Management" : "Products"}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Filter:</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white/10 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <ProductForm onSuccess={() => setIsAddModalOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-4 font-medium text-gray-300">SKU</th>
              <th className="text-left p-4 font-medium text-gray-300">Product Name</th>
              <th className="text-left p-4 font-medium text-gray-300">Category</th>
              <th className="text-left p-4 font-medium text-gray-300">Stock</th>
              <th className="text-left p-4 font-medium text-gray-300">Price</th>
              <th className="text-left p-4 font-medium text-gray-300">Status</th>
              <th className="text-left p-4 font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayProducts.map((product) => {
              const stockStatus = getStockStatus(product.currentStock, product.minStockLevel);
              const IconComponent = getProductIcon(product.categoryId);
              const category = categories?.find((c: any) => c.id === product.categoryId);
              
              return (
                <tr key={product.id} className="table-row border-b border-white/10">
                  <td className="p-4 text-gray-300">{product.sku}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-400">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{category?.name || "N/A"}</td>
                  <td className="p-4">
                    <Badge className={stockStatus.color}>
                      {product.currentStock} units
                    </Badge>
                  </td>
                  <td className="p-4 text-gray-300">${product.sellingPrice}</td>
                  <td className="p-4">
                    <Badge className={stockStatus.color}>
                      {stockStatus.label}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-white/10 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                          </DialogHeader>
                          {editingProduct && (
                            <ProductForm 
                              product={editingProduct} 
                              onSuccess={() => setEditingProduct(null)} 
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {!isDashboard && (
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing 1-{displayProducts.length} of {filteredProducts.length} products
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20">
              Previous
            </Button>
            <Button size="sm" className="bg-primary">
              1
            </Button>
            <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20">
              2
            </Button>
            <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20">
              3
            </Button>
            <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
