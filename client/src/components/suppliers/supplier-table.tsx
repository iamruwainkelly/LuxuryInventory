import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus, Truck, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SupplierForm from "./supplier-form";
import type { Supplier } from "@shared/schema";

export default function SupplierTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: suppliers, isLoading } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/suppliers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      toast({ title: "Success", description: "Supplier deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete supplier", variant: "destructive" });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      deleteMutation.mutate(id);
    }
  };

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
          <h3 className="text-xl font-semibold">Suppliers</h3>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <SupplierForm onSuccess={() => setIsAddModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-4 font-medium text-gray-300">Name</th>
              <th className="text-left p-4 font-medium text-gray-300">Email</th>
              <th className="text-left p-4 font-medium text-gray-300">Phone</th>
              <th className="text-left p-4 font-medium text-gray-300">Address</th>
              <th className="text-left p-4 font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers?.map((supplier) => (
              <tr key={supplier.id} className="table-row border-b border-white/10">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <p className="text-sm text-gray-400">{supplier.notes || "No notes"}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{supplier.contactEmail || "N/A"}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{supplier.contactPhone || "N/A"}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-300 max-w-xs truncate">
                  {supplier.address || "N/A"}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                          onClick={() => setEditingSupplier(supplier)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-white/10 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Supplier</DialogTitle>
                        </DialogHeader>
                        {editingSupplier && (
                          <SupplierForm 
                            supplier={editingSupplier} 
                            onSuccess={() => setEditingSupplier(null)} 
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      onClick={() => handleDelete(supplier.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing 1-{suppliers?.length || 0} of {suppliers?.length || 0} suppliers
        </p>
      </div>
    </div>
  );
}
