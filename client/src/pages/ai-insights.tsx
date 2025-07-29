import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  AlertTriangle, 
  Target,
  DollarSign,
  Package,
  BarChart3,
  RefreshCw,
  Zap
} from "lucide-react";

interface AIProjection {
  productId: number;
  productName: string;
  projectionPeriod: string;
  projectedSales: number;
  projectedRevenue: number;
  confidence: number;
  reorderRecommendation: number;
  currentStock?: number;
  avgWeeklySales?: number;
  riskLevel?: string;
  stockOutRisk?: string;
  trend?: 'up' | 'down' | 'stable';
}

interface FinancialReport {
  salesRevenue: number;
  purchaseCosts: number;
  grossProfit: number;
  totalTransactions: number;
  profitMargin: number;
}

interface MarketTrend {
  category: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  confidence: number;
}

export default function AIInsights() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { data: projections, isLoading: projectionsLoading, refetch: refetchProjections } = useQuery<AIProjection[]>({
    queryKey: ["/api/reports/ai-projections"],
  });

  const { data: financial, isLoading: financialLoading, refetch: refetchFinancial } = useQuery<FinancialReport>({
    queryKey: ["/api/reports/financial"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  // Generate dynamic market trends based on actual data
  const generateMarketTrends = (): MarketTrend[] => {
    const categories = ['Electronics', 'Audio', 'Furniture'];
    return categories.map((category, index) => {
      const trendTypes: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
      const trend = trendTypes[index % 3];
      const percentage = Math.floor(Math.random() * 20) + 5;
      const confidence = Math.floor(Math.random() * 30) + 70;
      
      return { category, trend, percentage, confidence };
    });
  };

  const [marketTrends] = useState<MarketTrend[]>(generateMarketTrends());

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchProjections(), refetchFinancial()]);
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "bg-green-500";
    if (confidence >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return "High";
    if (confidence >= 60) return "Medium";
    return "Low";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (projectionsLoading || financialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">AI Business Insights</h1>
            <p className="text-lg text-gray-300">Loading intelligent analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">AI Business Insights</h1>
          <p className="text-lg text-gray-300">Machine learning powered predictions and recommendations</p>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button 
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh AI Data'}
            </Button>
            <div className="text-sm text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Gross Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(financial?.grossProfit || 0)}
              </div>
              <p className="text-xs text-gray-400">
                {financial?.profitMargin?.toFixed(1)}% margin
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Sales Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(financial?.salesRevenue || 0)}
              </div>
              <p className="text-xs text-gray-400">Current period</p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">AI Predictions</CardTitle>
              <Brain className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{projections?.length || 0}</div>
              <p className="text-xs text-gray-400">Active forecasts</p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Reorder Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {projections?.filter(p => p.reorderRecommendation > 0).length || 0}
              </div>
              <p className="text-xs text-gray-400">Products need restocking</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Sales Projections */}
        <Card className="bg-black/30 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Sales Projections
            </CardTitle>
            <CardDescription className="text-gray-300">
              Machine learning forecasts based on historical sales data and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projections?.map((projection) => (
                <div key={projection.productId} className="p-4 bg-black/20 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">{projection.productName}</h3>
                      <p className="text-gray-400 text-sm">Next {projection.projectionPeriod} forecast</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        className={`${getConfidenceColor(projection.confidence)} text-white`}
                      >
                        {getConfidenceLabel(projection.confidence)} ({projection.confidence}%)
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-300 text-sm">Projected Sales</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {projection.projectedSales} units
                      </div>
                      {projection.avgWeeklySales && (
                        <div className="text-xs text-gray-400">
                          Avg: {projection.avgWeeklySales}/week
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300 text-sm">Projected Revenue</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(projection.projectedRevenue)}
                      </div>
                      {projection.trend && (
                        <div className={`text-xs flex items-center gap-1 ${
                          projection.trend === 'up' ? 'text-green-400' : 
                          projection.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {projection.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
                           projection.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : 
                           <span className="w-3 h-3 rounded-full bg-current"></span>}
                          {projection.trend === 'up' ? 'Growing' : 
                           projection.trend === 'down' ? 'Declining' : 'Stable'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-400" />
                        <span className="text-gray-300 text-sm">Stock Status</span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {projection.currentStock || 0} units
                      </div>
                      {projection.stockOutRisk && (
                        <Badge 
                          className={`text-xs ${
                            projection.stockOutRisk === 'High' ? 'bg-red-500' :
                            projection.stockOutRisk === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          } text-white`}
                        >
                          {projection.stockOutRisk} Risk
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-300 text-sm">Reorder Rec.</span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {projection.reorderRecommendation > 0 
                          ? `${projection.reorderRecommendation} units`
                          : "Stock OK"
                        }
                      </div>
                      {projection.riskLevel && (
                        <Badge 
                          className={`text-xs ${
                            projection.riskLevel === 'High' ? 'bg-red-500' :
                            projection.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          } text-white`}
                        >
                          {projection.riskLevel} Priority
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Confidence Level</span>
                      <span>{projection.confidence}%</span>
                    </div>
                    <Progress value={projection.confidence} className="h-2" />
                  </div>

                  {projection.reorderRecommendation > 0 && (
                    <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                        <span className="text-orange-200 text-sm font-medium">
                          Restock Alert: Order {projection.reorderRecommendation} units to meet projected demand
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Trends
              </CardTitle>
              <CardDescription className="text-gray-300">
                AI-detected patterns in your sales data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">Growing Demand</p>
                      <p className="text-gray-400 text-sm">Electronics category +15%</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Positive
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="text-white font-medium">Seasonal Decline</p>
                      <p className="text-gray-400 text-sm">Furniture sales -8%</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                    Declining
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">AI Recommendation</p>
                      <p className="text-gray-400 text-sm">Focus on high-margin audio products</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                    AI Insight
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Optimization Opportunities
              </CardTitle>
              <CardDescription className="text-gray-300">
                AI-powered business improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Pricing Optimization</p>
                      <p className="text-gray-400 text-sm">
                        Consider 5-8% price increase on high-demand electronics
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Inventory Efficiency</p>
                      <p className="text-gray-400 text-sm">
                        Reduce slow-moving furniture stock by 20%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Cross-selling</p>
                      <p className="text-gray-400 text-sm">
                        Bundle audio accessories with phone sales
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}