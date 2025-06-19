import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Calendar, Package, CreditCard } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/reportUtils";

interface ClientHistoryModalProps {
  clientId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientHistoryModal({ clientId, isOpen, onClose }: ClientHistoryModalProps) {
  const { data: clientHistory, isLoading } = useQuery({
    queryKey: [`/api/clients/${clientId}/history`],
    enabled: !!clientId && isOpen,
  });

  if (!clientId) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            {clientHistory?.client?.name || 'Client'} - Transaction History
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Complete client history, orders, and spending patterns
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white">Loading client history...</div>
          </div>
        ) : clientHistory ? (
          <div className="space-y-6">
            {/* Client Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(clientHistory.metrics.totalSpent)}
                  </div>
                  <p className="text-xs text-gray-400">
                    Avg: {formatCurrency(clientHistory.metrics.avgOrderValue)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {clientHistory.metrics.totalOrders}
                  </div>
                  <p className="text-xs text-gray-400">
                    {clientHistory.metrics.completedOrders} completed
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {clientHistory.metrics.completionRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-400">Order success rate</p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Recent Activity</CardTitle>
                  <Calendar className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(clientHistory.metrics.recentSpending)}
                  </div>
                  <p className="text-xs text-gray-400">Last 12 months</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/20 backdrop-blur-sm">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Overview</TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-white/10">Order History</TabsTrigger>
                <TabsTrigger value="spending" className="data-[state=active]:bg-white/10">Spending Pattern</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Client Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Name:</span>
                        <p className="text-white font-medium">{clientHistory.client.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <p className="text-white">{clientHistory.client.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Phone:</span>
                        <p className="text-white">{clientHistory.client.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Address:</span>
                        <p className="text-white">{clientHistory.client.address}</p>
                      </div>
                    </div>
                    
                    {clientHistory.client.notes && (
                      <div className="mt-4 p-3 bg-black/20 rounded border border-white/10">
                        <span className="text-gray-400 text-sm">Notes:</span>
                        <p className="text-white text-sm mt-1">{clientHistory.client.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Orders</CardTitle>
                    <CardDescription className="text-gray-300">
                      Last 10 orders from this client
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {clientHistory.recentOrders.map((order: any) => (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{order.orderNumber}</span>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="text-sm text-gray-400">
                                {formatDate(order.orderDate || order.createdAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium">
                                {formatCurrency(order.totalAmount)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Complete Order History</CardTitle>
                    <CardDescription className="text-gray-300">
                      All orders from this client
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {clientHistory.orders.map((order: any) => (
                          <div key={order.id} className="p-4 bg-black/20 rounded border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Package className="h-4 w-4 text-blue-400" />
                                <div>
                                  <span className="text-white font-medium">{order.orderNumber}</span>
                                  <div className="text-sm text-gray-400">
                                    {formatDate(order.orderDate || order.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {getStatusBadge(order.status)}
                                <div className="text-white font-medium">
                                  {formatCurrency(order.totalAmount)}
                                </div>
                              </div>
                            </div>
                            
                            {order.notes && (
                              <div className="text-sm text-gray-300 mt-2">
                                <span className="text-gray-400">Notes:</span> {order.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="spending" className="space-y-4">
                <Card className="bg-black/30 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Spending Pattern</CardTitle>
                    <CardDescription className="text-gray-300">
                      Client spending over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={clientHistory.monthlySpending}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="period" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F9FAFB'
                          }}
                          formatter={(value: any) => [formatCurrency(value), 'Spending']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#8B5CF6" 
                          strokeWidth={2} 
                          name="Monthly Spending" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">No client history found</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}