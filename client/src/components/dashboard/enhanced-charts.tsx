import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Package, DollarSign, Filter } from "lucide-react";

export default function EnhancedCharts() {
  const [period, setPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [useCustomDates, setUseCustomDates] = useState(false);

  const { data: historicalData = [], isLoading } = useQuery({
    queryKey: [`/api/analytics/historical?period=${period}&year=${selectedYear}${
      useCustomDates && startDate && endDate ? `&startDate=${startDate}&endDate=${endDate}` : ''
    }`],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: movements = [] } = useQuery({
    queryKey: ["/api/stock/movements"],
  });

  const formatChartData = (data: any[]) => {
    return data.map(item => ({
      period: item.period,
      revenue: item.salesRevenue || 0,
      expenses: item.purchaseCosts || 0,
      profit: item.grossProfit || 0,
      orders: item.salesOrdersCount || 0,
      stockIn: item.stockMovementsIn || 0,
      stockOut: item.stockMovementsOut || 0,
    }));
  };

  const getStockByCategory = () => {
    const categoryStock = categories.map((category: any) => {
      const categoryProducts = products.filter((p: any) => p.categoryId === category.id);
      const totalStock = categoryProducts.reduce((sum: number, p: any) => sum + (p.currentStock || 0), 0);
      return {
        name: category.name,
        value: totalStock,
      };
    });
    return categoryStock.filter(item => item.value > 0);
  };

  const getStockMovements = () => {
    if (!useCustomDates || !startDate || !endDate) {
      return movements.slice(-30); // Last 30 movements
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return movements.filter((m: any) => {
      const moveDate = new Date(m.createdAt);
      return moveDate >= start && moveDate <= end;
    });
  };

  const chartData = formatChartData(historicalData);
  const stockByCategory = getStockByCategory();
  const filteredMovements = getStockMovements();
  
  const movementsByDay = filteredMovements.reduce((acc: any, movement: any) => {
    const date = new Date(movement.createdAt).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, stockIn: 0, stockOut: 0 };
    }
    if (movement.movementType === 'in') {
      acc[date].stockIn += movement.quantity;
    } else {
      acc[date].stockOut += movement.quantity;
    }
    return acc;
  }, {});

  const movementChartData = Object.values(movementsByDay).slice(-14); // Last 14 days

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      {/* Date Selection Controls */}
      <Card className="bg-black/30 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Analytics Period Selection
          </CardTitle>
          <CardDescription className="text-gray-300">
            Select time period and date ranges for detailed analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Period Type</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Year Filter</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear} disabled={useCustomDates}>
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setUseCustomDates(true);
                }}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setUseCustomDates(true);
                }}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setUseCustomDates(false);
                setStartDate("");
                setEndDate("");
              }}
              className="border-white/10"
            >
              Reset to Defaults
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Revenue & Financial Trends */}
      <Card className="bg-black/30 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Revenue & Financial Trends</CardTitle>
          <CardDescription className="text-gray-300">
            {useCustomDates && startDate && endDate 
              ? `Custom period: ${startDate} to ${endDate}`
              : `${period.charAt(0).toUpperCase() + period.slice(1)} view for ${selectedYear === 'all' ? 'all years' : selectedYear}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-white">Loading financial data...</div>
              </div>
            ) : chartData.length > 0 ? (
              <LineChart data={chartData}>
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
                  formatter={(value: any, name: string) => [
                    typeof value === 'number' ? `$${value.toLocaleString()}` : value,
                    name
                  ]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} name="Expenses" />
                <Line type="monotone" dataKey="profit" stroke="#8B5CF6" strokeWidth={3} name="Profit" />
              </LineChart>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400">No financial data available for selected period</div>
              </div>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stock Movement Analysis */}
      <Card className="bg-black/30 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Stock Movement Analysis</CardTitle>
          <CardDescription className="text-gray-300">
            Inventory movements over time - showing last 14 days of activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={movementChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: any, name: string) => [
                  `${value} units`,
                  name === 'stockIn' ? 'Stock In' : 'Stock Out'
                ]}
              />
              <Bar dataKey="stockIn" fill="#10B981" name="Stock In" />
              <Bar dataKey="stockOut" fill="#EF4444" name="Stock Out" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stock by Category */}
      <Card className="bg-black/30 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Stock Distribution by Category</CardTitle>
          <CardDescription className="text-gray-300">
            Current inventory levels across product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {stockByCategory.length > 0 ? (
              <PieChart>
                <Pie
                  data={stockByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: any) => [`${value} units`, 'Stock']}
                />
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400">No stock data available</div>
              </div>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}