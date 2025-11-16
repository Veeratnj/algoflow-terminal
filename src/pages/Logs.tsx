import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const logs = [
  { time: "14:32:15", type: "INFO", message: "Order executed: NIFTY 21900 CE @ 142.30", source: "Trading Engine" },
  { time: "14:31:48", type: "SUCCESS", message: "WebSocket connection established", source: "Market Data" },
  { time: "14:30:22", type: "WARNING", message: "High volatility detected in BANKNIFTY", source: "Risk Monitor" },
  { time: "14:28:10", type: "ERROR", message: "Order rejected: Insufficient margin", source: "Order Manager" },
  { time: "14:25:05", type: "INFO", message: "Strategy triggered: Iron Condor on FINNIFTY", source: "Strategy Engine" },
];

const Logs = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">System Logs</h2>
          <p className="text-muted-foreground mt-1">Monitor system activity and events</p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Activity Log</span>
              <Badge variant="outline" className="text-profit border-profit/20 bg-profit/10">
                System Online
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-secondary hover:bg-muted transition-colors">
                  <span className="text-xs text-muted-foreground font-mono w-20">{log.time}</span>
                  <Badge 
                    variant={
                      log.type === "ERROR" ? "destructive" :
                      log.type === "WARNING" ? "default" :
                      log.type === "SUCCESS" ? "default" :
                      "secondary"
                    }
                    className={
                      log.type === "SUCCESS" ? "bg-profit/10 text-profit border-profit/20" :
                      log.type === "WARNING" ? "bg-warning/10 text-warning border-warning/20" :
                      ""
                    }
                  >
                    {log.type}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{log.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Logs;
