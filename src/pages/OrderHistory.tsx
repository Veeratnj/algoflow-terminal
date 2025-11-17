import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { ordersApi } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: string;
  symbol: string;
  orderType: string;
  qty: number;
  price: number;
  status: string;
  timestamp: string;
  executedPrice: number | null;
  executedQty: number;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await ordersApi.getAll();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
        console.error("Orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalPnl = orders.reduce((sum, order) => {
    const pnl = order.executedPrice 
      ? (order.executedPrice - order.price) * order.executedQty 
      : 0;
    return sum + pnl;
  }, 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Order History</h2>
            <p className="text-muted-foreground mt-1">Complete history of your executed orders</p>
          </div>
          <div className="flex items-center gap-3">
            <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Realized P&L</div>
                <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                  ₹{totalPnl.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-loss/10 border border-loss/20 rounded-lg text-loss">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead>Order ID</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Executed Price</TableHead>
                        <TableHead>Executed Qty</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} className="border-border hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{order.id}</TableCell>
                          <TableCell className="font-medium">{order.symbol}</TableCell>
                          <TableCell>
                            <Badge variant={order.orderType === "BUY" ? "default" : "secondary"}>
                              {order.orderType}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.qty}</TableCell>
                          <TableCell>₹{order.price}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                order.status === "COMPLETED" ? "default" :
                                order.status === "CANCELLED" ? "destructive" :
                                "secondary"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>₹{order.executedPrice || "-"}</TableCell>
                          <TableCell>{order.executedQty}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(order.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrderHistory;
