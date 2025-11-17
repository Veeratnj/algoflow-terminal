import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { logsApi } from "@/lib/api";

interface Log {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  category: string;
  source: string;
}

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await logsApi.getAll();
        setLogs(data);
      } catch (err: any) {
        setError(err.message || "Failed to load logs");
        console.error("Logs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "INFO":
        return "bg-blue-500/10 text-blue-500";
      case "SUCCESS":
        return "bg-profit/10 text-profit";
      case "WARNING":
        return "bg-warning/10 text-warning";
      case "ERROR":
        return "bg-loss/10 text-loss";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold">System Logs</h2>
          <p className="text-muted-foreground mt-1">View and monitor system events and activities</p>
        </div>

        {error && (
          <div className="p-4 bg-loss/10 border border-loss/20 rounded-lg text-loss">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No logs found</p>
          </div>
        ) : (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg border border-border/50 hover:bg-secondary/50 transition-all">
                    <Badge className={`${getLevelColor(log.level)} whitespace-nowrap`}>
                      {log.level}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{log.message}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{log.source}</span>
                        <span>•</span>
                        <span>{log.category}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Logs;
