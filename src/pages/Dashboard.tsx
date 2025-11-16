import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { marketApi, alertsApi, strategiesApi } from "@/lib/api";

interface MarketIndex {
  id: number;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

interface PnlData {
  id: number;
  period: string;
  value: number;
  isPositive: boolean;
  description: string;
}

interface Strategy {
  id: number;
  name: string;
  index: string;
  status: string;
}

interface Alert {
  id: number;
  message: string;
  time: string;
  type: string;
}

const Dashboard = () => {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [pnlData, setPnlData] = useState<PnlData[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [indicesData, pnlDataResponse, strategiesData, alertsData] = await Promise.all([
          marketApi.getIndices(),
          marketApi.getPnl(),
          strategiesApi.getAll(),
          alertsApi.getAll(),
        ]);
        
        setIndices(indicesData);
        setPnlData(pnlDataResponse);
        setStrategies(strategiesData);
        setAlerts(alertsData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
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

        {error && (
          <div className="p-4 bg-loss/10 border border-loss/20 rounded-lg text-loss">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Market Indices */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {indices.map((index) => (
                <Card key={index.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {index.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{index.value.toLocaleString()}</div>
                      <div className="flex items-center gap-2">
                        {index.isPositive ? (
                          <TrendingUp className="h-4 w-4 text-profit" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-loss" />
                        )}
                        <span className={index.isPositive ? "text-profit" : "text-loss"}>
                          {index.isPositive ? "+" : ""}{index.change} ({index.isPositive ? "+" : ""}{index.changePercent}%)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* PnL Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pnlData.map((pnl) => (
                <Card key={pnl.id} className="bg-gradient-to-br from-card to-secondary border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground capitalize">
                      {pnl.period}'s P&L
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${pnl.isPositive ? "text-profit" : "text-loss"}`}>
                      ₹{pnl.value.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{pnl.description}</p>
                  </CardContent>
                </Card>
              ))}
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
                    {strategies.slice(0, 3).map((strategy) => (
                      <div key={strategy.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
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
                    {alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex gap-3 p-3 rounded-lg bg-secondary">
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
