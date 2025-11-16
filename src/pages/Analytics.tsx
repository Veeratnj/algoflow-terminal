import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
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
              <div className="text-3xl font-bold text-profit">68.5%</div>
              <p className="text-sm text-muted-foreground mt-1">45 wins / 66 trades</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Win</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹2,845</div>
              <p className="text-sm text-muted-foreground mt-1">Per winning trade</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-loss">₹1,234</div>
              <p className="text-sm text-muted-foreground mt-1">Per losing trade</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Max Drawdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">-8.2%</div>
              <p className="text-sm text-muted-foreground mt-1">Peak to trough</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart visualization will be added here
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
