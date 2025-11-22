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
  id: number;
  user_id: number;
  strategy_id: number | null;
  position_id: number | null;
  symbol: string;
  underlying: string;
  order_type: string;
  product_type: string;
  qty: number;
  price: number;
  avg_price: number;
  trigger_price: number | null;
  status: string;
  order_id: string;
  executed_qty: number;
  pending_qty: number | null;
  cancelled_qty: number;
  avg_executed_price: number | null;
  exit_price: number | null;
  broker_order_id: string;
  exchange_order_id: string | null;
  exchange: string;
  rejection_reason: string | null;
  status_message: string | null;
  timestamp: string;
  placed_at: string;
  executed_at: string | null;
  updated_at: string;
  created_at: string;
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
    // Calculate P&L based on order type and exit price
    if (order.exit_price && order.status === "EXECUTED") {
      // For SELL orders: P&L = (Entry Price - Exit Price) * Qty
      // For BUY orders: P&L = (Exit Price - Entry Price) * Qty
      const pnl = order.order_type === "SELL" 
        ? (order.avg_price - order.exit_price) * order.qty
        : (order.exit_price - order.avg_price) * order.qty;
      return sum + pnl;
    }
    return sum;
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
                  {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-sm ${totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {totalPnl >= 0 ? 'Profit' : 'Loss'}
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
                        <TableHead>Underlying</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Entry Price</TableHead>
                        <TableHead>Exit Price</TableHead>
                        <TableHead>P&L</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Exchange</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        // Calculate P&L for each order
                        const calculatedPnl = order.exit_price && order.status === "EXECUTED"
                          ? order.order_type === "SELL"
                            ? (order.avg_price - order.exit_price) * order.qty
                            : (order.exit_price - order.avg_price) * order.qty
                          : 0;
                        
                        return (
                        <TableRow key={order.id} className="border-border hover:bg-muted/50">
                          <TableCell className="font-mono text-xs">{order.order_id}</TableCell>
                          <TableCell className="font-medium">{order.symbol}</TableCell>
                          <TableCell className="text-sm">{order.underlying}</TableCell>
                          <TableCell>
                            <Badge variant={order.order_type === "BUY" ? "default" : "secondary"}>
                              {order.order_type}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.qty}</TableCell>
                          <TableCell>₹{order.avg_price.toFixed(2)}</TableCell>
                          <TableCell>₹{order.exit_price ? order.exit_price.toFixed(2) : "-"}</TableCell>
                          <TableCell className={calculatedPnl >= 0 ? 'text-profit font-medium' : 'text-loss font-medium'}>
                            {calculatedPnl !== 0 ? (
                              `${calculatedPnl >= 0 ? '+' : ''}₹${calculatedPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                order.status === "EXECUTED" ? "bg-profit/10 text-profit border-profit/20" :
                                order.status === "CANCELLED" ? "bg-loss/10 text-loss border-loss/20" :
                                order.status === "REJECTED" ? "bg-loss/10 text-loss border-loss/20" :
                                order.status === "PENDING" || order.status === "PLACED" ? "bg-warning/10 text-warning border-warning/20" :
                                "bg-muted text-muted-foreground"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{order.exchange}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {(() => {
                              const date = new Date(order.timestamp);
                              const day = String(date.getDate()).padStart(2, '0');
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const year = date.getFullYear();
                              const hours = String(date.getHours()).padStart(2, '0');
                              const minutes = String(date.getMinutes()).padStart(2, '0');
                              const seconds = String(date.getSeconds()).padStart(2, '0');
                              return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                            })()}
                          </TableCell>
                        </TableRow>
                        );
                      })}
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
