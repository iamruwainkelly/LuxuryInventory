import ClientTable from "@/components/clients/client-table";

export default function Clients() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Client Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your client relationships, contact information, and order history.
        </p>
      </div>
      
      <ClientTable />
    </div>
  );
}
