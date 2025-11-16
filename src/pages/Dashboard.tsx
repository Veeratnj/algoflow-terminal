import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";

const marketIndices = [
  { name: "NIFTY 50", value: "21,894.50", change: "+125.30", changePercent: "+0.58%", isPositive: true },
  { name: "BANK NIFTY", value: "46,125.80", change: "-89.20", changePercent: "-0.19%", isPositive: false },
  { name: "FINNIFTY", value: "19,543.60", change: "+45.70", changePercent: "+0.23%", isPositive: true },
  { name: "MIDCAP NIFTY", value: "45,672.30", change: "+234.50", changePercent: "+0.52%", isPositive: true },
];

const pnlData = {
  today: { value: "₹12,450", isPositive: true },
  week: { value: "₹45,230", isPositive: true },
  month: { value: "₹1,23,450", isPositive: true },
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your trading overview</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-success">Market Open</span>
            </div>
          </div>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketIndices.map((index) => (
            <Card key={index.name} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {index.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{index.value}</div>
                  <div className="flex items-center gap-2">
                    {index.isPositive ? (
                      <TrendingUp className="h-4 w-4 text-profit" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-loss" />
                    )}
                    <span className={index.isPositive ? "text-profit" : "text-loss"}>
                      {index.change} ({index.changePercent})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PnL Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-profit">{pnlData.today.value}</div>
              <p className="text-sm text-muted-foreground mt-2">+8.5% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-profit">{pnlData.week.value}</div>
              <p className="text-sm text-muted-foreground mt-2">12 winning trades</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-profit">{pnlData.month.value}</div>
              <p className="text-sm text-muted-foreground mt-2">45 total trades</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Strategies & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Active Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Straddle Strategy", index: "NIFTY", status: "ACTIVE" },
                  { name: "Iron Condor", index: "BANKNIFTY", status: "ACTIVE" },
                  { name: "Bull Call Spread", index: "FINNIFTY", status: "PAUSED" },
                ].map((strategy) => (
                  <div key={strategy.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div>
                      <p className="font-medium">{strategy.name}</p>
                      <p className="text-sm text-muted-foreground">{strategy.index}</p>
                    </div>
                    <Badge variant={strategy.status === "ACTIVE" ? "default" : "secondary"}>
                      {strategy.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { message: "Order filled: NIFTY 21900 CE", time: "2 mins ago", type: "success" },
                  { message: "Stop loss triggered on BANKNIFTY", time: "15 mins ago", type: "warning" },
                  { message: "New signal: Iron Condor setup", time: "1 hour ago", type: "info" },
                ].map((alert, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-secondary">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      alert.type === "success" ? "bg-profit" :
                      alert.type === "warning" ? "bg-warning" :
                      "bg-primary"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
