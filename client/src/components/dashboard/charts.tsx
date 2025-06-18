import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const stockData = [
  { name: "Jan", stockIn: 65, stockOut: 28 },
  { name: "Feb", stockIn: 59, stockOut: 48 },
  { name: "Mar", stockIn: 80, stockOut: 40 },
  { name: "Apr", stockIn: 81, stockOut: 19 },
  { name: "May", stockIn: 56, stockOut: 86 },
  { name: "Jun", stockIn: 55, stockOut: 27 },
];

const valueData = [
  { name: "Jan", value: 12000 },
  { name: "Feb", value: 19000 },
  { name: "Mar", value: 15000 },
  { name: "Apr", value: 25000 },
  { name: "May", value: 22000 },
  { name: "Jun", value: 30000 },
];

const categoryData = [
  { name: "Electronics", value: 45, color: "hsl(243, 75%, 59%)" },
  { name: "Furniture", value: 25, color: "hsl(151, 55%, 41.5%)" },
  { name: "Clothing", value: 15, color: "hsl(48, 96%, 53%)" },
  { name: "Books", value: 10, color: "hsl(0, 72%, 51%)" },
  { name: "Sports", value: 5, color: "hsl(280, 87%, 65%)" },
];

interface ChartsProps {
  showCategoryChart?: boolean;
}

export default function Charts({ showCategoryChart }: ChartsProps) {
  if (showCategoryChart) {
    return (
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-6">Stock by Category</h3>
        <ResponsiveContainer width="100%" height={264}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(224, 64%, 16%)", 
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "white"
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-300">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stock Movement Chart */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Stock Movement</h3>
          <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm">
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={264}>
          <BarChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            />
            <YAxis 
              tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(224, 64%, 16%)", 
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "white"
              }} 
            />
            <Bar dataKey="stockIn" fill="hsl(243, 75%, 59%)" />
            <Bar dataKey="stockOut" fill="hsl(0, 72%, 51%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Value Chart */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Inventory Value</h3>
          <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm">
            <option>This year</option>
            <option>Last year</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={264}>
          <LineChart data={valueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            />
            <YAxis 
              tick={{ fill: "rgba(255, 255, 255, 0.6)" }}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(224, 64%, 16%)", 
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "white"
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(151, 55%, 41.5%)" 
              strokeWidth={2}
              dot={{ fill: "hsl(151, 55%, 41.5%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
