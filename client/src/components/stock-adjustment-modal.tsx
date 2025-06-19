import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Minus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface StockAdjustmentModalProps {
  productId: number | null;
  productName: string;
  currentStock: number;
  isOpen: boolean;
  onClose: () => void;
}

export function StockAdjustmentModal({ 
  productId, 
  productName, 
  currentStock, 
  isOpen, 
  onClose 
}: StockAdjustmentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    type: "in",
    quantity: "",
    reason: "",
  });

  const adjustStockMutation = useMutation({
    mutationFn: (data: { type: string; quantity: number; reason: string }) =>
      apiRequest(`/api/products/${productId}/adjust-stock`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      toast({
        title: "Stock Adjusted",
        description: `Stock ${formData.type === 'in' ? 'added' : 'removed'} successfully. New stock: ${data.newStock}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stock/movements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/dashboard"] });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to adjust stock. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quantity = parseInt(formData.quantity);
    if (!quantity || quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.reason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for this stock adjustment.",
        variant: "destructive",
      });
      return;
    }

    // Check if removing stock would result in negative inventory
    if (formData.type === 'out' && quantity > currentStock) {
      toast({
        title: "Insufficient Stock",
        description: `Cannot remove ${quantity} units. Only ${currentStock} units available.`,
        variant: "destructive",
      });
      return;
    }

    adjustStockMutation.mutate({
      type: formData.type,
      quantity,
      reason: formData.reason,
    });
  };

  const handleClose = () => {
    setFormData({
      type: "in",
      quantity: "",
      reason: "",
    });
    onClose();
  };

  const predefinedReasons = {
    in: [
      "Supplier delivery",
      "Purchase order received",
      "Inventory recount - increase",
      "Return to stock",
      "Manufacturing completion",
      "Transfer from other location",
    ],
    out: [
      "Sale to customer",
      "Damaged goods",
      "Quality control rejection",
      "Internal use",
      "Promotional giveaway",
      "Transfer to other location",
      "Inventory recount - decrease",
    ],
  };

  const newStock = formData.type === 'in' 
    ? currentStock + (parseInt(formData.quantity) || 0)
    : currentStock - (parseInt(formData.quantity) || 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Package className="h-5 w-5" />
            Adjust Stock
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {productName} - Current Stock: {currentStock} units
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Adjustment Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value, reason: "" })}
            >
              <SelectTrigger className="bg-black/20 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-green-400" />
                    Add Stock (Stock In)
                  </div>
                </SelectItem>
                <SelectItem value="out">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-red-400" />
                    Remove Stock (Stock Out)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Quantity</Label>
            <Input
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="bg-black/20 border-white/10 text-white"
              required
            />
            {formData.quantity && (
              <div className="text-sm text-gray-300">
                New stock level will be: {newStock} units
                {newStock < 0 && (
                  <span className="text-red-400 ml-2">⚠ Negative stock!</span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white">Reason</Label>
            <Select 
              value={formData.reason} 
              onValueChange={(value) => setFormData({ ...formData, reason: value })}
            >
              <SelectTrigger className="bg-black/20 border-white/10 text-white">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {predefinedReasons[formData.type as keyof typeof predefinedReasons].map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom reason...</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.reason === "custom" && (
              <Textarea
                placeholder="Enter custom reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="bg-black/20 border-white/10 text-white mt-2"
                rows={3}
                required
              />
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-white/10"
              disabled={adjustStockMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${
                formData.type === 'in' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                  : 'bg-gradient-to-r from-red-600 to-rose-600'
              }`}
              disabled={adjustStockMutation.isPending}
            >
              {adjustStockMutation.isPending ? (
                "Processing..."
              ) : (
                <>
                  {formData.type === 'in' ? (
                    <Plus className="h-4 w-4 mr-2" />
                  ) : (
                    <Minus className="h-4 w-4 mr-2" />
                  )}
                  {formData.type === 'in' ? 'Add Stock' : 'Remove Stock'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}