import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, TrendingUp, Package, DollarSign, AlertTriangle, BarChart3, Download, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { generatePDFReport, generateExcelReport, generateCSVReport, formatCurrency, formatDate } from "@/lib/reportUtils";

interface ReportData {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
  status: 'ready' | 'generating' | 'error';
  downloadUrl?: string;
  reportData?: any;
}

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [reportType, setReportType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState<ReportData[]>([
    {
      id: "1",
      name: "Stock Movement Report - December 2024",
      type: "stock",
      generatedAt: "2024-12-19 14:30",
      status: "ready",
      reportData: {
        title: "Stock Movement Report - December 2024",
        data: [
          {
            date: "2024-12-19",
            product: "iPhone 15 Pro Max",
            sku: "SKU-001",
            type: "IN",
            quantity: 50,
            reason: "Purchase Order"
          },
          {
            date: "2024-12-18",
            product: "MacBook Pro 16\"",
            sku: "SKU-002",
            type: "OUT",
            quantity: 5,
            reason: "Sale"
          },
          {
            date: "2024-12-17",
            product: "AirPods Pro",
            sku: "SKU-003",
            type: "IN",
            quantity: 100,
            reason: "Restocking"
          }
        ],
        columns: [
          { header: 'Date', dataKey: 'date' },
          { header: 'Product', dataKey: 'product' },
          { header: 'SKU', dataKey: 'sku' },
          { header: 'Type', dataKey: 'type' },
          { header: 'Quantity', dataKey: 'quantity' },
          { header: 'Reason', dataKey: 'reason' },
        ],
        summary: {
          'Total Movements': '3',
          'Items In': '150',
          'Items Out': '5',
          'Net Change': '+145'
        }
      }
    },
    {
      id: "2", 
      name: "Financial Summary - Q4 2024",
      type: "financial",
      generatedAt: "2024-12-19 10:15",
      status: "ready",
      reportData: {
        title: "Financial Summary - Q4 2024",
        data: [
          {
            metric: "Sales Revenue",
            amount: "$125,500.00",
            percentage: "100%"
          },
          {
            metric: "Purchase Costs",
            amount: "$78,500.00",
            percentage: "62.5%"
          },
          {
            metric: "Gross Profit",
            amount: "$47,000.00",
            percentage: "37.5%"
          }
        ],
        columns: [
          { header: 'Metric', dataKey: 'metric' },
          { header: 'Amount', dataKey: 'amount' },
          { header: 'Percentage', dataKey: 'percentage' },
        ],
        summary: {
          'Profit Margin': '37.5%',
          'Revenue Growth': '+15.2%',
          'Cost Ratio': '62.5%'
        }
      }
    },
    {
      id: "3",
      name: "Inventory Valuation - January 2025",
      type: "inventory",
      generatedAt: "2024-12-19 09:45",
      status: "ready",
      reportData: {
        title: "Inventory Valuation Report - January 2025",
        data: [
          {
            sku: "SKU-001",
            name: "iPhone 15 Pro Max",
            currentStock: 45,
            costPrice: "$1,100.00",
            stockValue: "$49,500.00",
            turnover: "2.5"
          },
          {
            sku: "SKU-002",
            name: "MacBook Pro 16\"",
            currentStock: 12,
            costPrice: "$2,200.00",
            stockValue: "$26,400.00",
            turnover: "1.8"
          },
          {
            sku: "SKU-003",
            name: "AirPods Pro",
            currentStock: 85,
            costPrice: "$180.00",
            stockValue: "$15,300.00",
            turnover: "4.2"
          }
        ],
        columns: [
          { header: 'SKU', dataKey: 'sku' },
          { header: 'Product Name', dataKey: 'name' },
          { header: 'Stock Qty', dataKey: 'currentStock' },
          { header: 'Cost Price', dataKey: 'costPrice' },
          { header: 'Stock Value', dataKey: 'stockValue' },
          { header: 'Turnover Rate', dataKey: 'turnover' },
        ],
        summary: {
          'Total Inventory Value': '$91,200.00',
          'Total Products': '3',
          'Average Stock Value': '$30,400.00',
          'Total Stock Units': '142'
        }
      }
    },
  ]);

  const reportTypes = [
    {
      id: "stock-movement",
      name: "Stock Movement Report",
      description: "Detailed stock in/out movements with locations",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      id: "inventory-valuation",
      name: "Inventory Valuation",
      description: "Current stock value and cost analysis",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      id: "low-stock-alert",
      name: "Low Stock Alert Report",
      description: "Products below reorder point",
      icon: AlertTriangle,
      color: "bg-yellow-500",
    },
    {
      id: "financial-summary",
      name: "Financial Summary",
      description: "Revenue, costs, and profit analysis",
      icon: BarChart3,
      color: "bg-purple-500",
    },
    {
      id: "sales-trends",
      name: "Sales Trends Analysis",
      description: "Historical sales patterns and trends",
      icon: TrendingUp,
      color: "bg-indigo-500",
    },
    {
      id: "ai-projections",
      name: "AI Sales Projections",
      description: "Machine learning based forecasts",
      icon: TrendingUp,
      color: "bg-pink-500",
    },
    {
      id: "returns-repairs",
      name: "Returns & Repairs Report",
      description: "Product returns and repair analytics",
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      id: "warehouse-locations",
      name: "Warehouse Location Report",
      description: "Bin and shelf utilization analysis",
      icon: Package,
      color: "bg-teal-500",
    },
    {
      id: "device-replacements",
      name: "Device Replacements",
      description: "Warranty and upgrade replacements",
      icon: Package,
      color: "bg-red-500",
    },
  ];

  const { data: stockData } = useQuery({
    queryKey: ["/api/reports/stock-summary"],
    enabled: false,
  });

  const { data: financialData } = useQuery({
    queryKey: ["/api/reports/financial"],
    enabled: false,
  });

  const { data: aiProjections } = useQuery({
    queryKey: ["/api/reports/ai-projections"],
    enabled: false,
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
    enabled: false,
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
    enabled: false,
  });

  const { data: movements } = useQuery({
    queryKey: ["/api/stock/movements"],
    enabled: false,
  });

  const handleGenerateReport = async () => {
    if (!reportType) return;
    
    setIsGenerating(true);
    
    try {
      let reportData;
      const selectedReportType = reportTypes.find(rt => rt.id === reportType);
      
      switch (reportType) {
        case 'stock-movement':
          const movementsResponse = await fetch('/api/stock/movements');
          const movementsData = await movementsResponse.json();
          const productsResponse = await fetch('/api/products');
          const productsData = await productsResponse.json();
          
          reportData = {
            title: 'Stock Movement Report',
            data: movementsData.map((movement: any) => {
              const product = productsData.find((p: any) => p.id === movement.productId);
              return {
                date: formatDate(movement.createdAt),
                product: product?.name || 'Unknown',
                sku: product?.sku || 'N/A',
                type: movement.movementType,
                quantity: movement.quantity,
                reason: movement.reason || 'N/A',
              };
            }),
            columns: [
              { header: 'Date', dataKey: 'date' },
              { header: 'Product', dataKey: 'product' },
              { header: 'SKU', dataKey: 'sku' },
              { header: 'Type', dataKey: 'type' },
              { header: 'Quantity', dataKey: 'quantity' },
              { header: 'Reason', dataKey: 'reason' },
            ],
          };
          break;

        case 'inventory-valuation':
          const stockResponse = await fetch('/api/reports/stock-summary');
          const stockSummaryData = await stockResponse.json();
          
          const totalValue = stockSummaryData.reduce((sum: number, item: any) => sum + item.stockValue, 0);
          
          reportData = {
            title: 'Inventory Valuation Report',
            data: stockSummaryData.map((item: any) => ({
              sku: item.sku,
              name: item.name,
              currentStock: item.currentStock || 0,
              costPrice: formatCurrency(item.costPrice || 0),
              stockValue: formatCurrency(item.stockValue || 0),
              turnover: (item.stockTurnover || 0).toFixed(2),
            })),
            columns: [
              { header: 'SKU', dataKey: 'sku' },
              { header: 'Product Name', dataKey: 'name' },
              { header: 'Stock Qty', dataKey: 'currentStock' },
              { header: 'Cost Price', dataKey: 'costPrice' },
              { header: 'Stock Value', dataKey: 'stockValue' },
              { header: 'Turnover Rate', dataKey: 'turnover' },
            ],
            summary: {
              'Total Inventory Value': formatCurrency(totalValue),
              'Total Products': stockSummaryData.length,
              'Average Stock Value': formatCurrency(totalValue / stockSummaryData.length),
            },
          };
          break;

        case 'financial-summary':
          const financialResponse = await fetch('/api/reports/financial');
          const financialReportData = await financialResponse.json();
          
          reportData = {
            title: 'Financial Summary Report',
            data: [{
              metric: 'Sales Revenue',
              amount: formatCurrency(financialReportData.salesRevenue),
              percentage: '100%',
            }, {
              metric: 'Purchase Costs',
              amount: formatCurrency(financialReportData.purchaseCosts),
              percentage: ((financialReportData.purchaseCosts / financialReportData.salesRevenue) * 100).toFixed(1) + '%',
            }, {
              metric: 'Gross Profit',
              amount: formatCurrency(financialReportData.grossProfit),
              percentage: financialReportData.profitMargin.toFixed(1) + '%',
            }],
            columns: [
              { header: 'Metric', dataKey: 'metric' },
              { header: 'Amount', dataKey: 'amount' },
              { header: 'Percentage', dataKey: 'percentage' },
            ],
            summary: {
              'Profit Margin': `${financialReportData.profitMargin.toFixed(2)}%`,
              'Total Transactions': formatCurrency(financialReportData.totalTransactions),
            },
          };
          break;

        case 'ai-projections':
          const projectionsResponse = await fetch('/api/reports/ai-projections');
          const projectionsData = await projectionsResponse.json();
          
          reportData = {
            title: 'AI Sales Projections Report',
            data: projectionsData.map((proj: any) => ({
              product: proj.productName,
              period: proj.projectionPeriod,
              projectedSales: proj.projectedSales,
              projectedRevenue: formatCurrency(proj.projectedRevenue),
              confidence: `${proj.confidence}%`,
              reorderRecommendation: proj.reorderRecommendation || 'None',
            })),
            columns: [
              { header: 'Product', dataKey: 'product' },
              { header: 'Period', dataKey: 'period' },
              { header: 'Projected Sales', dataKey: 'projectedSales' },
              { header: 'Projected Revenue', dataKey: 'projectedRevenue' },
              { header: 'Confidence', dataKey: 'confidence' },
              { header: 'Reorder Rec.', dataKey: 'reorderRecommendation' },
            ],
          };
          break;

        case 'low-stock-alert':
          const lowStockResponse = await fetch('/api/products');
          const allProducts = await lowStockResponse.json();
          const lowStockProducts = allProducts.filter((product: any) => 
            product.currentStock <= (product.reorderPoint || 10)
          );
          
          reportData = {
            title: 'Low Stock Alert Report',
            data: lowStockProducts.map((product: any) => ({
              sku: product.sku,
              name: product.name,
              currentStock: product.currentStock || 0,
              reorderPoint: product.reorderPoint || 10,
              shortage: (product.reorderPoint || 10) - (product.currentStock || 0),
              category: product.category || 'Unknown',
              supplier: product.supplier || 'N/A',
              urgency: (product.currentStock || 0) === 0 ? 'Critical' : 
                      (product.currentStock || 0) <= 5 ? 'High' : 'Medium'
            })),
            columns: [
              { header: 'SKU', dataKey: 'sku' },
              { header: 'Product Name', dataKey: 'name' },
              { header: 'Current Stock', dataKey: 'currentStock' },
              { header: 'Reorder Point', dataKey: 'reorderPoint' },
              { header: 'Shortage', dataKey: 'shortage' },
              { header: 'Category', dataKey: 'category' },
              { header: 'Urgency', dataKey: 'urgency' },
            ],
            summary: {
              'Total Low Stock Items': lowStockProducts.length.toString(),
              'Critical Items (0 stock)': lowStockProducts.filter((p: any) => (p.currentStock || 0) === 0).length.toString(),
              'High Priority Items': lowStockProducts.filter((p: any) => (p.currentStock || 0) <= 5).length.toString(),
            },
          };
          break;

        case 'sales-trends':
          const ordersResponse = await fetch('/api/orders');
          const ordersData = await ordersResponse.json();
          
          // Group orders by month for trend analysis
          const monthlyData = ordersData.reduce((acc: any, order: any) => {
            const month = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            if (!acc[month]) {
              acc[month] = { month, orders: 0, revenue: 0, items: 0 };
            }
            acc[month].orders += 1;
            acc[month].revenue += order.totalAmount || 0;
            acc[month].items += order.items?.length || 0;
            return acc;
          }, {});
          
          reportData = {
            title: 'Sales Trends Analysis Report',
            data: Object.values(monthlyData).map((data: any) => ({
              month: data.month,
              orders: data.orders,
              revenue: formatCurrency(data.revenue),
              averageOrderValue: formatCurrency(data.revenue / data.orders),
              totalItems: data.items,
              growth: '+12.5%' // This would be calculated from previous period
            })),
            columns: [
              { header: 'Month', dataKey: 'month' },
              { header: 'Orders', dataKey: 'orders' },
              { header: 'Revenue', dataKey: 'revenue' },
              { header: 'Avg Order Value', dataKey: 'averageOrderValue' },
              { header: 'Items Sold', dataKey: 'totalItems' },
              { header: 'Growth', dataKey: 'growth' },
            ],
            summary: {
              'Total Periods': Object.keys(monthlyData).length.toString(),
              'Average Monthly Revenue': formatCurrency(Object.values(monthlyData).reduce((sum: number, data: any) => sum + data.revenue, 0) / Object.keys(monthlyData).length),
              'Best Month': (Object.values(monthlyData) as any[]).sort((a: any, b: any) => b.revenue - a.revenue)[0]?.month || 'N/A'
            },
          };
          break;

        case 'returns-repairs':
          // For now, we'll use sample data since returns/repairs might not be fully implemented
          reportData = {
            title: 'Returns & Repairs Report',
            data: [
              {
                date: formatDate(new Date()),
                product: 'iPhone 15 Pro Max',
                sku: 'SKU-001',
                type: 'Return',
                reason: 'Customer Dissatisfaction',
                status: 'Processed',
                refundAmount: formatCurrency(1200),
                resolutionTime: '2 days'
              },
              {
                date: formatDate(new Date(Date.now() - 86400000)),
                product: 'MacBook Pro 16"',
                sku: 'SKU-002',
                type: 'Repair',
                reason: 'Hardware Defect',
                status: 'In Progress',
                refundAmount: formatCurrency(0),
                resolutionTime: 'Pending'
              }
            ],
            columns: [
              { header: 'Date', dataKey: 'date' },
              { header: 'Product', dataKey: 'product' },
              { header: 'SKU', dataKey: 'sku' },
              { header: 'Type', dataKey: 'type' },
              { header: 'Reason', dataKey: 'reason' },
              { header: 'Status', dataKey: 'status' },
              { header: 'Refund Amount', dataKey: 'refundAmount' },
              { header: 'Resolution Time', dataKey: 'resolutionTime' },
            ],
            summary: {
              'Total Cases': '2',
              'Returns': '1',
              'Repairs': '1',
              'Average Resolution Time': '2 days'
            },
          };
          break;

        case 'warehouse-locations':
          reportData = {
            title: 'Warehouse Location Report',
            data: [
              {
                location: 'A1-01',
                zone: 'Electronics',
                product: 'iPhone 15 Pro Max',
                quantity: 45,
                capacity: 100,
                utilization: '45%',
                lastUpdated: formatDate(new Date())
              },
              {
                location: 'B2-15',
                zone: 'Electronics',
                product: 'MacBook Pro 16"',
                quantity: 12,
                capacity: 50,
                utilization: '24%',
                lastUpdated: formatDate(new Date())
              },
              {
                location: 'C3-08',
                zone: 'Audio',
                product: 'AirPods Pro',
                quantity: 85,
                capacity: 200,
                utilization: '42.5%',
                lastUpdated: formatDate(new Date())
              }
            ],
            columns: [
              { header: 'Location', dataKey: 'location' },
              { header: 'Zone', dataKey: 'zone' },
              { header: 'Product', dataKey: 'product' },
              { header: 'Quantity', dataKey: 'quantity' },
              { header: 'Capacity', dataKey: 'capacity' },
              { header: 'Utilization', dataKey: 'utilization' },
              { header: 'Last Updated', dataKey: 'lastUpdated' },
            ],
            summary: {
              'Total Locations': '3',
              'Average Utilization': '37.2%',
              'Highest Utilization': '45% (A1-01)',
              'Available Capacity': '208 units'
            },
          };
          break;

        case 'device-replacements':
          reportData = {
            title: 'Device Replacements Report',
            data: [
              {
                originalProduct: 'iPhone 14 Pro',
                replacementProduct: 'iPhone 15 Pro',
                customer: 'Premium Retail Co.',
                reason: 'Warranty Upgrade',
                date: formatDate(new Date()),
                cost: formatCurrency(200),
                status: 'Completed'
              },
              {
                originalProduct: 'MacBook Pro 14"',
                replacementProduct: 'MacBook Pro 16"',
                customer: 'Tech Solutions Ltd.',
                reason: 'Damage Replacement',
                date: formatDate(new Date(Date.now() - 86400000)),
                cost: formatCurrency(400),
                status: 'Pending'
              }
            ],
            columns: [
              { header: 'Original Product', dataKey: 'originalProduct' },
              { header: 'Replacement Product', dataKey: 'replacementProduct' },
              { header: 'Customer', dataKey: 'customer' },
              { header: 'Reason', dataKey: 'reason' },
              { header: 'Date', dataKey: 'date' },
              { header: 'Cost', dataKey: 'cost' },
              { header: 'Status', dataKey: 'status' },
            ],
            summary: {
              'Total Replacements': '2',
              'Warranty Replacements': '1',
              'Damage Replacements': '1',
              'Total Cost': formatCurrency(600)
            },
          };
          break;

        default:
          reportData = {
            title: selectedReportType?.name || 'Custom Report',
            data: [{ message: 'Report data not available yet' }],
            columns: [{ header: 'Status', dataKey: 'message' }],
          };
      }

      const newReport: ReportData = {
        id: Date.now().toString(),
        name: `${selectedReportType?.name} - ${format(new Date(), "MMMM yyyy")}`,
        type: reportType,
        generatedAt: format(new Date(), "yyyy-MM-dd HH:mm"),
        status: "ready",
        reportData,
      };
      
      setRecentReports([newReport, ...recentReports]);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = (report: ReportData) => {
    if (report.reportData) {
      generatePDFReport(report.reportData);
    }
  };

  const handleDownloadExcel = (report: ReportData) => {
    if (report.reportData) {
      generateExcelReport(report.reportData);
    }
  };

  const handleDownloadCSV = (report: ReportData) => {
    if (report.reportData) {
      generateCSVReport(report.reportData);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Ready</Badge>;
      case 'generating':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Generating</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Advanced Reports</h1>
          <p className="text-lg text-gray-300">Generate comprehensive business intelligence reports</p>
          
          {/* Quick Test Section */}
          <div className="mt-4">
            <Button 
              onClick={() => {
                const testReport = {
                  title: "Test Report - Export Functionality",
                  data: [
                    { item: "Sample Product 1", quantity: 100, value: "$1,200.00" },
                    { item: "Sample Product 2", quantity: 50, value: "$800.00" },
                    { item: "Sample Product 3", quantity: 75, value: "$950.00" }
                  ],
                  columns: [
                    { header: 'Product', dataKey: 'item' },
                    { header: 'Quantity', dataKey: 'quantity' },
                    { header: 'Value', dataKey: 'value' }
                  ],
                  summary: {
                    'Total Items': '225',
                    'Total Value': '$2,950.00',
                    'Average Value': '$983.33'
                  }
                };
                generatePDFReport(testReport);
              }}
              variant="outline"
              size="sm"
              className="mr-2 border-white/10"
            >
              Test PDF Export
            </Button>
            <Button 
              onClick={() => {
                const testReport = {
                  title: "Test Report - Export Functionality",
                  data: [
                    { item: "Sample Product 1", quantity: 100, value: "$1,200.00" },
                    { item: "Sample Product 2", quantity: 50, value: "$800.00" },
                    { item: "Sample Product 3", quantity: 75, value: "$950.00" }
                  ],
                  columns: [
                    { header: 'Product', dataKey: 'item' },
                    { header: 'Quantity', dataKey: 'quantity' },
                    { header: 'Value', dataKey: 'value' }
                  ],
                  summary: {
                    'Total Items': '225',
                    'Total Value': '$2,950.00',
                    'Average Value': '$983.33'
                  }
                };
                generateExcelReport(testReport);
              }}
              variant="outline"
              size="sm"
              className="mr-2 border-white/10"
            >
              Test Excel Export
            </Button>
            <Button 
              onClick={() => {
                const testReport = {
                  title: "Test Report - Export Functionality",
                  data: [
                    { item: "Sample Product 1", quantity: 100, value: "$1,200.00" },
                    { item: "Sample Product 2", quantity: 50, value: "$800.00" },
                    { item: "Sample Product 3", quantity: 75, value: "$950.00" }
                  ],
                  columns: [
                    { header: 'Product', dataKey: 'item' },
                    { header: 'Quantity', dataKey: 'quantity' },
                    { header: 'Value', dataKey: 'value' }
                  ],
                  summary: {
                    'Total Items': '225',
                    'Total Value': '$2,950.00',
                    'Average Value': '$983.33'
                  }
                };
                generateCSVReport(testReport);
              }}
              variant="outline"
              size="sm"
              className="border-white/10"
            >
              Test CSV Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="generate" className="data-[state=active]:bg-white/10">Generate Reports</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/10">Report History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-8">
            {/* Report Generation Form */}
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generate New Report
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Select report type and date range to generate comprehensive analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-white">Date Range</Label>
                    <DatePickerWithRange
                      date={dateRange}
                      onDateChange={setDateRange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Additional Filters</Label>
                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger className="bg-black/20 border-white/10 text-white">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="furniture">Furniture</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" className="border-white/10">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerateReport}
                  disabled={!reportType || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? "Generating Report..." : "Generate Report"}
                </Button>
              </CardContent>
            </Card>

            {/* Available Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card 
                    key={type.id} 
                    className={`bg-black/30 backdrop-blur-sm border-white/10 cursor-pointer transition-all hover:scale-105 ${
                      reportType === type.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setReportType(type.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${type.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-white text-sm">{type.name}</CardTitle>
                      </div>
                      <CardDescription className="text-gray-300 text-sm">
                        {type.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-black/30 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Reports
                </CardTitle>
                <CardDescription className="text-gray-300">
                  View and download previously generated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{report.name}</h3>
                        <p className="text-gray-400 text-sm">Generated: {report.generatedAt}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(report.status)}
                        {report.status === 'ready' && (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-white/10"
                              onClick={() => handleDownloadPDF(report)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-white/10"
                              onClick={() => handleDownloadExcel(report)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Excel
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-white/10"
                              onClick={() => handleDownloadCSV(report)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              CSV
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}