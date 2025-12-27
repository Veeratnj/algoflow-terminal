import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search, Calendar as CalendarIcon, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { ordersApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  entry_time: string | null;
  exit_reason: string | null;
  updated_at: string;
  created_at: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 7)) // Default to last 7 days
  );
  const [searchFilters, setSearchFilters] = useState({
    symbol: "",
    order_type: "",
    status: "",
    exit_reason: "",
    qty: "",
  });

  const handleFilterChange = (column: string, value: string) => {
    setSearchFilters((prev) => ({ ...prev, [column]: value }));
  };

  const clearFilters = () => {
    setSearchFilters({
      symbol: "",
      order_type: "",
      status: "",
      exit_reason: "",
      qty: "",
    });
    setFromDate(undefined);
  };

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Date Filter
      if (fromDate) {
        const orderDate = new Date(order.timestamp || order.created_at);
        if (isBefore(orderDate, startOfDay(fromDate))) return false;
      }

      // Column Filters
      const matchesSymbol = order.symbol.toLowerCase().includes(searchFilters.symbol.toLowerCase());
      const matchesType = order.order_type.toLowerCase().includes(searchFilters.order_type.toLowerCase());
      const matchesStatus = order.status.toLowerCase().includes(searchFilters.status.toLowerCase());
      const matchesReason = (order.exit_reason || "").toLowerCase().includes(searchFilters.exit_reason.toLowerCase());
      const matchesQty = searchFilters.qty === "" || order.qty.toString().includes(searchFilters.qty);

      return matchesSymbol && matchesType && matchesStatus && matchesReason && matchesQty;
    });
  }, [orders, fromDate, searchFilters]);

  const totalRealizedPnl = filteredOrders.reduce((sum, order) => {
    // Robust calculation with field fallbacks to handle different API response formats
    const exit = order.exit_price ?? (order as any).executed_price ?? (order as any).executedPrice ?? 0;
    const entry = order.avg_price ?? order.price ?? 0;
    const pnl = (exit - entry) * order.qty;
    return sum + pnl;
  }, 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Order History</h2>
            <p className="text-muted-foreground mt-1">
              Complete history of your executed orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Card
              className={`bg-card/40 backdrop-blur-md shadow-lg border-2 transition-all duration-300 ${
                totalRealizedPnl >= 0 ? "border-profit/40 shadow-profit/5" : "border-loss/40 shadow-loss/5"
              }`}
            >
              <CardContent className="p-4 min-w-[200px]">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Total Realized P&L
                </div>
                <div
                  className={`text-3xl font-black mt-1 tracking-tight ${
                    totalRealizedPnl >= 0 ? "text-profit" : "text-loss"
                  }`}
                >
                  {totalRealizedPnl >= 0 ? "+" : ""}₹
                  {totalRealizedPnl.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      totalRealizedPnl >= 0
                        ? "bg-profit shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"
                        : "bg-loss shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse"
                    }`}
                  />
                  <span
                    className={`text-xs font-bold tracking-widest ${
                      totalRealizedPnl >= 0 ? "text-profit" : "text-loss"
                    }`}
                  >
                    {totalRealizedPnl >= 0 ? "PROFIT" : "LOSS"}
                  </span>
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : <span>From Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearFilters}
                className="hover:text-loss"
                title="Clear Filters"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
                        <TableHead>
                          <div className="space-y-2">
                            <span>Symbol</span>
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                              <Input
                                placeholder="Search..."
                                className="h-7 pl-7 text-[10px]"
                                value={searchFilters.symbol}
                                onChange={(e) => handleFilterChange("symbol", e.target.value)}
                              />
                            </div>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="space-y-2">
                            <span>Type</span>
                            <div className="relative">
                              <Input
                                placeholder="Filter..."
                                className="h-7 text-[10px]"
                                value={searchFilters.order_type}
                                onChange={(e) => handleFilterChange("order_type", e.target.value)}
                              />
                            </div>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="space-y-2">
                            <span>Qty</span>
                            <div className="relative">
                              <Input
                                placeholder="#"
                                className="h-7 text-[10px]"
                                value={searchFilters.qty}
                                onChange={(e) => handleFilterChange("qty", e.target.value)}
                              />
                            </div>
                          </div>
                        </TableHead>
                        <TableHead>Entry Price</TableHead>
                        <TableHead>Exit Price</TableHead>
                        <TableHead>P&L (Pts)</TableHead>
                        <TableHead>P&L (Total)</TableHead>
                        <TableHead>
                          <div className="space-y-2">
                            <span>Status</span>
                            <div className="relative">
                              <Input
                                placeholder="Filter..."
                                className="h-7 text-[10px]"
                                value={searchFilters.status}
                                onChange={(e) => handleFilterChange("status", e.target.value)}
                              />
                            </div>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="space-y-2">
                            <span>Exit Reason</span>
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground text-opacity-50" />
                              <Input
                                placeholder="Search..."
                                className="h-7 pl-7 text-[10px]"
                                value={searchFilters.exit_reason}
                                onChange={(e) => handleFilterChange("exit_reason", e.target.value)}
                              />
                            </div>
                          </div>
                        </TableHead>
                        <TableHead>Entry Time</TableHead>
                        <TableHead>Exit Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => {
                        // Robust calculation with field fallbacks
                        const entryPrice = order.avg_price ?? order.price ?? 0;
                        const exitPrice = order.exit_price ?? (order as any).executed_price ?? (order as any).executedPrice ?? 0;
                        const hasExit = order.exit_price !== null && order.exit_price !== undefined || (order as any).executedPrice !== undefined || (order as any).executed_price !== undefined;
                        
                        const pts = hasExit ? (exitPrice - entryPrice) : 0;
                        const calculatedPnl = pts * order.qty;

                         return (
                          <TableRow
                            key={order.id}
                            className="border-border hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {order.symbol}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.order_type === "BUY"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {order.order_type}
                              </Badge>
                            </TableCell>
                            <TableCell>{order.qty}</TableCell>
                            <TableCell>₹{entryPrice.toFixed(2)}</TableCell>
                            <TableCell>₹{hasExit ? exitPrice.toFixed(2) : "-"}</TableCell>
                            <TableCell className={calculatedPnl >= 0 ? 'text-profit' : 'text-loss'}>
                              {hasExit ? (
                                `${pts >= 0 ? '+' : ''}${pts.toFixed(2)}`
                              ) : '-'}
                            </TableCell>
                            <TableCell className={calculatedPnl >= 0 ? 'text-profit font-medium' : 'text-loss font-medium'}>
                              {calculatedPnl !== 0 ? (
                                `${calculatedPnl >= 0 ? '+' : ''}₹${calculatedPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              ) : '-'}
                            </TableCell>

                            <TableCell>
                              <Badge
                                className={
                                  order.status === "EXECUTED" || order.status === "COMPLETED" || order.status === "CLOSED"
                                    ? "bg-profit/10 text-profit border-profit/20"
                                    : order.status === "CANCELLED"
                                    ? "bg-loss/10 text-loss border-loss/20"
                                    : order.status === "REJECTED"
                                    ? "bg-loss/10 text-loss border-loss/20"
                                    : order.status === "PENDING" ||
                                      order.status === "PLACED"
                                    ? "bg-warning/10 text-warning border-warning/20"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm font-medium italic text-muted-foreground">
                              {order.exit_reason || "-"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {(() => {
                                const entryTime = order.entry_time || order.placed_at || order.timestamp || order.created_at;
                                if (!entryTime) return "-";
                                const date = new Date(entryTime);
                                const day = String(date.getDate()).padStart(2, "0");
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const year = date.getFullYear();
                                const hours = String(date.getHours()).padStart(2, "0");
                                const minutes = String(date.getMinutes()).padStart(2, "0");
                                return `${day}/${month}/${year} ${hours}:${minutes}`;
                              })()}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {(() => {
                                const exitTime = order.executed_at || order.updated_at;
                                if (!exitTime || !hasExit) return "-";
                                const date = new Date(exitTime);
                                const day = String(date.getDate()).padStart(2, "0");
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const year = date.getFullYear();
                                const hours = String(date.getHours()).padStart(2, "0");
                                const minutes = String(date.getMinutes()).padStart(2, "0");
                                return `${day}/${month}/${year} ${hours}:${minutes}`;
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
