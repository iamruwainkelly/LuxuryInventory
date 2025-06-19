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
import { generatePDFReport, generateExcelReport, formatCurrency, formatDate } from "@/lib/reportUtils";

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
    },
    {
      id: "2", 
      name: "Financial Summary - Q4 2024",
      type: "financial",
      generatedAt: "2024-12-19 10:15",
      status: "ready",
    },
    {
      id: "3",
      name: "AI Sales Projection - January 2025",
      type: "ai-projection",
      generatedAt: "2024-12-19 09:45",
      status: "ready",
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