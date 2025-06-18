import SupplierTable from "@/components/suppliers/supplier-table";

export default function Suppliers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supplier Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your supplier relationships, contact information, and procurement history.
        </p>
      </div>
      
      <SupplierTable />
    </div>
  );
}
