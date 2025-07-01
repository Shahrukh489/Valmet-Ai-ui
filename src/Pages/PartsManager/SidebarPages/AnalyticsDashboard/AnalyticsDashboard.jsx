import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  PackageCheck,
  DollarSign,
  PieChart as PieIcon,
} from "lucide-react";


const AnalyticsDashboard = () => {
  const totalSales = 12540;
  const totalOrders = 320;
  const totalRevenue = 25000;

  const topSellingParts = [
    { name: "Screwdriver Bit", sales: 75 },
    { name: "Torque Wrench", sales: 60 },
    { name: "Drill Bit", sales: 50 },
    { name: "Hex Key Set", sales: 40 },
  ];

const salesTrend = [
  { date: "Mar 1", revenue: 1200 },
  { date: "Mar 2", revenue: 1500 },
  { date: "Mar 3", revenue: 1700 },
  { date: "Mar 4", revenue: 1100 },
  { date: "Mar 5", revenue: 1900 },
];
  const categoryDistribution = [
    { category: "Tools", value: 40 },
    { category: "Fasteners", value: 30 },
    { category: "Machinery", value: 20 },
    { category: "Electrical", value: 10 },
  ];

  const pastInvoices = [
    { id: "INV-1001", customer: "Acme Corp", amount: 1280, date: "2024-04-01" },
    {
      id: "INV-1002",
      customer: "Tech Solutions",
      amount: 940,
      date: "2024-04-02",
    },
    { id: "INV-1003", customer: "BuildCo", amount: 1875, date: "2024-04-03" },
    { id: "INV-1004", customer: "MechWorks", amount: 1620, date: "2024-04-04" },
    {
      id: "INV-1005",
      customer: "NextGen Tools",
      amount: 1430,
      date: "2024-04-05",
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Monitor your business performance and key metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border hover:bg-accent/50 transition-colors duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold text-card-foreground">${totalSales.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp size={24} className="text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:bg-accent/50 transition-colors duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quotations</p>
                <p className="text-2xl font-bold text-card-foreground">{totalOrders}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <PackageCheck size={24} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:bg-accent/50 transition-colors duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-card-foreground">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <DollarSign size={24} className="text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:bg-accent/50 transition-colors duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category Distribution</p>
                <p className="text-xs text-muted-foreground mt-1">As of April 5, 2024</p>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <PieIcon size={24} className="text-purple-500" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={40}
                  innerRadius={20}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Analytics + Top Selling Parts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Sales Trend</h3>
              <span className="text-sm text-muted-foreground">Last 5 Days</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesTrend}>
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-6">Top Selling Parts</h3>
            <div className="space-y-4">
              {topSellingParts.map((part, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                    <span className="font-medium text-card-foreground">{part.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-card-foreground">{part.sales}</span>
                    <span className="text-sm text-muted-foreground ml-1">units</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Past Invoices */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">Recent Quotes</h3>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
            {pastInvoices.map((inv, idx) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200 border border-border/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">#{idx + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-card-foreground">{inv.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {inv.customer} • {new Date(inv.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-card-foreground">${inv.amount.toLocaleString()}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/30"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
