import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Activity } from "lucide-react";

const strategies = [
  {
    id: 1,
    name: "Straddle Strategy",
    description: "Buy both CE and PE at ATM when IV is low",
    index: "NIFTY",
    status: "ACTIVE",
    conditions: "IV < 15, Market Open",
    isActive: true,
  },
  {
    id: 2,
    name: "Iron Condor",
    description: "Sell OTM options on both sides for premium collection",
    index: "BANKNIFTY",
    status: "ACTIVE",
    conditions: "Sideways market, High IV",
    isActive: true,
  },
  {
    id: 3,
    name: "Bull Call Spread",
    description: "Long call + Short higher strike call",
    index: "FINNIFTY",
    status: "PAUSED",
    conditions: "Bullish trend, Low volatility",
    isActive: false,
  },
];

const Strategies = () => {
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
                  <Switch checked={strategy.isActive} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Index</span>
                  <Badge variant="outline">{strategy.index}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={strategy.isActive ? "default" : "secondary"}>
                    {strategy.status}
                  </Badge>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Trigger Conditions</p>
                  <p className="text-sm mt-1">{strategy.conditions}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Strategies;
