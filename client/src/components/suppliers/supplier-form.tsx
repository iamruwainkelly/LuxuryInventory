import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertSupplierSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { Supplier } from "@shared/schema";
import { z } from "zod";

interface SupplierFormProps {
  supplier?: Supplier;
  onSuccess: () => void;
}

export default function SupplierForm({ supplier, onSuccess }: SupplierFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertSupplierSchema>>({
    resolver: zodResolver(insertSupplierSchema),
    defaultValues: {
      name: supplier?.name || "",
      contactEmail: supplier?.contactEmail || "",
      contactPhone: supplier?.contactPhone || "",
      address: supplier?.address || "",
      notes: supplier?.notes || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof insertSupplierSchema>) => 
      apiRequest("POST", "/api/suppliers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      toast({ title: "Success", description: "Supplier created successfully" });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create supplier", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: z.infer<typeof insertSupplierSchema>) => 
      apiRequest("PUT", `/api/suppliers/${supplier!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      toast({ title: "Success", description: "Supplier updated successfully" });
      onSuccess();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update supplier", variant: "destructive" });
    },
  });

  const onSubmit = (data: z.infer<typeof insertSupplierSchema>) => {
    if (supplier) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter supplier name" 
                  className="bg-white/10 border-white/20 focus:ring-primary"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="supplier@example.com" 
                    className="bg-white/10 border-white/20 focus:ring-primary"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+1-555-0123" 
                    className="bg-white/10 border-white/20 focus:ring-primary"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea 
                  rows={2}
                  placeholder="Enter supplier address"
                  className="bg-white/10 border-white/20 focus:ring-primary"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  rows={3}
                  placeholder="Additional notes about the supplier"
                  className="bg-white/10 border-white/20 focus:ring-primary"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end space-x-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onSuccess}
            className="bg-white/10 hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : supplier ? "Update Supplier" : "Add Supplier"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
