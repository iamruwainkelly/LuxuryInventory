import ProductTable from "@/components/products/product-table";

export default function Products() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your inventory, track stock levels, and update product information.
        </p>
      </div>
      
      <ProductTable />
    </div>
  );
}
