import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { analyticsApi } from "@/lib/api";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, ResponsiveContainer
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface AnalyticsData {
  winRate: number;
  avgWin: number;
  avgLoss: number;
  maxDrawdown: number;
  totalTrades: number;
  winCount: number;
  lossCount: number;
  date?: string;
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsHistory, setAnalyticsHistory] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsApi.getAll();
        if (data && data.length > 0) {
          setAnalytics(data[0]);
          setAnalyticsHistory(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Analytics</h2>
            <p className="text-muted-foreground mt-1">Detailed performance metrics and insights</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Analytics</h2>
          </div>
          <Card className="border-loss/50 bg-loss/10">
            <CardContent className="pt-6">
              <p className="text-loss">{error}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Analytics</h2>
          </div>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No analytics data available</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Analytics</h2>
          <p className="text-muted-foreground mt-1">Detailed performance metrics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-profit">{analytics.winRate.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground mt-1">{analytics.winCount} wins / {analytics.totalTrades} trades</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Win</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{analytics.avgWin.toLocaleString('en-IN')}</div>
              <p className="text-sm text-muted-foreground mt-1">Per winning trade</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-loss">₹{analytics.avgLoss.toLocaleString('en-IN')}</div>
              <p className="text-sm text-muted-foreground mt-1">Per losing trade</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Max Drawdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{analytics.maxDrawdown.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground mt-1">Peak to trough</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Donut Chart: Win vs Loss */}
          <Card>
            <CardHeader>
              <CardTitle>Win vs Loss (Donut)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Wins', value: analytics.winCount },
                      { name: 'Losses', value: analytics.lossCount || (analytics.totalTrades - analytics.winCount) }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    <Cell key="win" fill="#22c55e" />
                    <Cell key="loss" fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart: Win vs Loss (Standard Pie) */}
          <Card>
            <CardHeader>
              <CardTitle>Win vs Loss (Pie)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Wins', value: analytics.winCount },
                      { name: 'Losses', value: analytics.lossCount || (analytics.totalTrades - analytics.winCount) }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    <Cell key="win" fill="#22c55e" />
                    <Cell key="loss" fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart: Win/Loss/Drawdown by Date */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analyticsHistory} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="winCount" fill="#22c55e" name="Wins" />
                  <Bar dataKey="lossCount" fill="#ef4444" name="Losses" />
                  <Bar dataKey="maxDrawdown" fill="#f59e42" name="Drawdown (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Line Chart: Win Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Win Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analyticsHistory} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="winRate" stroke="#22c55e" name="Win Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
