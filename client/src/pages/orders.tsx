import OrderTable from "@/components/orders/order-table";

export default function Orders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage sales and purchase orders, track order status, and view order history.
        </p>
      </div>
      
      <OrderTable />
    </div>
  );
}