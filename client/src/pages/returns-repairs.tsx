import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingUp,
  FileText,
  Download
} from "lucide-react";
import { generatePDFReport, generateExcelReport, formatCurrency, formatDate } from "@/lib/reportUtils";

export default function ReturnsRepairs() {
  const { data: repairs = [], isLoading: repairsLoading } = useQuery({
    queryKey: ["/api/repairs"],
  });

  const { data: returns = [], isLoading: returnsLoading } = useQuery({
    queryKey: ["/api/returns"],
  });

  const { data: deviceReplacements = [], isLoading: replacementsLoading } = useQuery({
    queryKey: ["/api/device-replacements"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-400" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleExportRepairs = () => {
    const reportData = {
      title: 'Repairs Report',
      data: repairs.map((repair: any) => ({
        id: repair.id,
        productId: repair.productId,
        clientId: repair.clientId,
        issue: repair.issueDescription,
        status: repair.repairStatus,
        estimatedCost: repair.estimatedCost || 'N/A',
        actualCost: repair.actualCost || 'N/A',
        warranty: repair.warrantyRepair ? 'Yes' : 'No',
        dateReceived: formatDate(repair.dateReceived),
        dateCompleted: repair.dateCompleted ? formatDate(repair.dateCompleted) : 'Pending',
      })),
      columns: [
        { header: 'Repair ID', dataKey: 'id' },
        { header: 'Product ID', dataKey: 'productId' },
        { header: 'Client ID', dataKey: 'clientId' },
        { header: 'Issue', dataKey: 'issue' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Estimated Cost', dataKey: 'estimatedCost' },
        { header: 'Actual Cost', dataKey: 'actualCost' },
        { header: 'Warranty', dataKey: 'warranty' },
        { header: 'Date Received', dataKey: 'dateReceived' },
        { header: 'Date Completed', dataKey: 'dateCompleted' },
      ],
    };
    generatePDFReport(reportData);
  };

  const handleExportReturns = () => {
    const reportData = {
      title: 'Returns Report',
      data: returns.map((returnItem: any) => ({
        id: returnItem.id,
        orderId: returnItem.orderId,
        productId: returnItem.productId,
        quantity: returnItem.quantity,
        reason: returnItem.reason,
        condition: returnItem.condition,
        refundAmount: returnItem.refundAmount || 'N/A',
        restockable: returnItem.restockable ? 'Yes' : 'No',
        dateCreated: formatDate(returnItem.createdAt),
      })),
      columns: [
        { header: 'Return ID', dataKey: 'id' },
        { header: 'Order ID', dataKey: 'orderId' },
        { header: 'Product ID', dataKey: 'productId' },
        { header: 'Quantity', dataKey: 'quantity' },
        { header: 'Reason', dataKey: 'reason' },
        { header: 'Condition', dataKey: 'condition' },
        { header: 'Refund Amount', dataKey: 'refundAmount' },
        { header: 'Restockable', dataKey: 'restockable' },
        { header: 'Date Created', dataKey: 'dateCreated' },
      ],
    };
    generatePDFReport(reportData);
  };

  if (repairsLoading || returnsLoading || replacementsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">Returns & Repairs</h1>
            <p className="text-lg text-gray-300">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalRepairs = repairs.length;
  const completedRepairs = repairs.filter((r: any) => r.repairStatus === 'completed').length;
  const warrantyRepairs = repairs.filter((r: any) => r.warrantyRepair).length;
  const totalReturns = returns.length;
  const restockableReturns = returns.filter((r: any) => r.restockable).length;

  const totalRepairCosts = repairs.reduce((sum: number, repair: any) => {
    return sum + parseFloat(repair.actualCost || repair.estimatedCost || "0");
  }, 0);

  const totalRefunds = returns.reduce((sum: number, returnItem: any) => {
    return sum + parseFloat(returnItem.refundAmount || "0");
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Returns & Repairs Management</h1>
          <p className="text-lg text-gray-300">Track product returns, repairs, and warranty claims</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Repairs</CardTitle>
              <Wrench className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalRepairs}</div>
              <p className="text-xs text-gray-400">
                {completedRepairs} completed ({totalRepairs > 0 ? Math.round((completedRepairs / totalRepairs) * 100) : 0}%)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Warranty Repairs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{warrantyRepairs}</div>
              <p className="text-xs text-gray-400">
                {totalRepairs > 0 ? Math.round((warrantyRepairs / totalRepairs) * 100) : 0}% of total repairs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Returns</CardTitle>
              <Package className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalReturns}</div>
              <p className="text-xs text-gray-400">
                {restockableReturns} restockable ({totalReturns > 0 ? Math.round((restockableReturns / totalReturns) * 100) : 0}%)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Financial Impact</CardTitle>
              <DollarSign className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(totalRepairCosts + totalRefunds)}
              </div>
              <p className="text-xs text-gray-400">Costs + Refunds</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="repairs" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="repairs" className="data-[state=active]:bg-white/10">Repairs</TabsTrigger>
            <TabsTrigger value="returns" className="data-[state=active]:bg-white/10">Returns</TabsTrigger>
            <TabsTrigger value="replacements" className="data-[state=active]:bg-white/10">Replacements</TabsTrigger>
          </TabsList>

          <TabsContent value="repairs" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Repair Orders
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Track repair status and warranty claims
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleExportRepairs}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repairs.length > 0 ? (
                    repairs.map((repair: any) => (
                      <div key={repair.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(repair.repairStatus)}
                            <div>
                              <h3 className="text-white font-medium">Repair #{repair.id}</h3>
                              <p className="text-gray-400 text-sm">Product ID: {repair.productId}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {repair.warrantyRepair && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                Warranty
                              </Badge>
                            )}
                            {getStatusBadge(repair.repairStatus)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Issue:</span>
                            <p className="text-white">{repair.issueDescription}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Cost:</span>
                            <p className="text-white">
                              {repair.actualCost 
                                ? formatCurrency(repair.actualCost)
                                : repair.estimatedCost 
                                  ? `Est. ${formatCurrency(repair.estimatedCost)}`
                                  : 'TBD'
                              }
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">Date Received:</span>
                            <p className="text-white">{formatDate(repair.dateReceived)}</p>
                          </div>
                        </div>
                        
                        {repair.technicianNotes && (
                          <div className="mt-3 p-3 bg-black/30 rounded border border-white/5">
                            <span className="text-gray-400 text-sm">Technician Notes:</span>
                            <p className="text-white text-sm mt-1">{repair.technicianNotes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No repair orders found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="returns" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Product Returns
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage returned items and refunds
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleExportReturns}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {returns.length > 0 ? (
                    returns.map((returnItem: any) => (
                      <div key={returnItem.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white font-medium">Return #{returnItem.id}</h3>
                            <p className="text-gray-400 text-sm">Order: {returnItem.orderId} • Product: {returnItem.productId}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {returnItem.restockable && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                Restockable
                              </Badge>
                            )}
                            <Badge className={`${
                              returnItem.condition === 'new' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                              returnItem.condition === 'used' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                            }`}>
                              {returnItem.condition}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Quantity:</span>
                            <p className="text-white">{returnItem.quantity}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Reason:</span>
                            <p className="text-white">{returnItem.reason}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Refund:</span>
                            <p className="text-white">
                              {returnItem.refundAmount ? formatCurrency(returnItem.refundAmount) : 'Pending'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">Date:</span>
                            <p className="text-white">{formatDate(returnItem.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No returns found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="replacements" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Device Replacements
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Track warranty replacements and upgrades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceReplacements.length > 0 ? (
                    deviceReplacements.map((replacement: any) => (
                      <div key={replacement.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="text-white font-medium">Replacement #{replacement.id}</h3>
                            <p className="text-gray-400 text-sm">
                              {replacement.originalProductId} → {replacement.replacementProductId}
                            </p>
                          </div>
                          <Badge className={`${
                            replacement.replacementType === 'warranty' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                            replacement.replacementType === 'upgrade' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          }`}>
                            {replacement.replacementType}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Reason:</span>
                            <p className="text-white">{replacement.reason}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Cost Difference:</span>
                            <p className="text-white">
                              {replacement.costDifference ? formatCurrency(replacement.costDifference) : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">Date:</span>
                            <p className="text-white">{formatDate(replacement.createdAt)}</p>
                          </div>
                        </div>
                        
                        {replacement.notes && (
                          <div className="mt-3 p-3 bg-black/30 rounded border border-white/5">
                            <span className="text-gray-400 text-sm">Notes:</span>
                            <p className="text-white text-sm mt-1">{replacement.notes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No device replacements found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}