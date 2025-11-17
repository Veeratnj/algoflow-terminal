import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { strategiesApi } from "@/lib/api";

interface Strategy {
  id: number;
  name: string;
  index: string;
  status: string;
  description: string;
  entryDate: string;
  profitTarget: number;
  stopLoss: number;
  currentPnl: number;
  trades: number;
  winRate: number;
}

const Strategies = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setLoading(true);
        const data = await strategiesApi.getAll();
        setStrategies(data);
      } catch (err: any) {
        setError(err.message || "Failed to load strategies");
        console.error("Strategies fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Strategy Monitor</h2>
            <p className="text-muted-foreground mt-1">Manage and monitor your trading strategies</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">
            Add New Strategy
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-loss/10 border border-loss/20 rounded-lg text-loss">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading strategies...</p>
          </div>
        ) : strategies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No strategies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <CardTitle className="text-xl">{strategy.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
                      </div>
                    </div>
                    <Switch checked={strategy.status === "ACTIVE"} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Index</span>
                    <Badge variant="outline">{strategy.index}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={strategy.status === "ACTIVE" ? "default" : "secondary"}>
                      {strategy.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Profit Target</p>
                      <p className="text-sm font-medium">₹{strategy.profitTarget}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Stop Loss</p>
                      <p className="text-sm font-medium">₹{strategy.stopLoss}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current P&L</p>
                      <p className={`text-sm font-medium ${strategy.currentPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                        ₹{strategy.currentPnl}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Trades</p>
                      <p className="text-sm font-medium">{strategy.trades}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                      <p className="text-sm font-medium">{strategy.winRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Strategies;
