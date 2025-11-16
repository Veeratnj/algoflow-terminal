import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const orderHistory = [
  {
    orderId: "ORD-2024-001",
    symbol: "NIFTY 21900 CE",
    type: "BUY",
    strike: 21900,
    optionType: "CE",
    qty: 50,
    entryTime: "2024-01-15 10:15:30",
    exitTime: "2024-01-15 14:30:45",
    entryPrice: 125.50,
    exitPrice: 142.30,
    pnl: 840,
    status: "CLOSED",
    strategy: "Straddle",
  },
  {
    orderId: "ORD-2024-002",
    symbol: "BANKNIFTY 46000 PE",
    type: "SELL",
    strike: 46000,
    optionType: "PE",
    qty: 25,
    entryTime: "2024-01-15 11:22:10",
    exitTime: "2024-01-15 15:10:20",
    entryPrice: 245.80,
    exitPrice: 234.20,
    pnl: -290,
    status: "SL HIT",
    strategy: "Iron Condor",
  },
  {
    orderId: "ORD-2024-003",
    symbol: "FINNIFTY 19500 CE",
    type: "BUY",
    strike: 19500,
    optionType: "CE",
    qty: 40,
    entryTime: "2024-01-15 10:45:15",
    exitTime: "2024-01-15 15:25:30",
    entryPrice: 89.50,
    exitPrice: 102.80,
    pnl: 532,
    status: "TARGET HIT",
    strategy: "Bull Call Spread",
  },
];

const OrderHistory = () => {
  const totalPnl = orderHistory.reduce((sum, order) => sum + order.pnl, 0);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Order History</h2>
            <p className="text-muted-foreground mt-1">Complete history of your executed trades</p>
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

        {/* Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Trade History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Strike</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Exit</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Exit Price</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Strategy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderHistory.map((order) => (
                    <TableRow key={order.orderId} className="border-border hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{order.orderId}</TableCell>
                      <TableCell className="font-medium">{order.symbol}</TableCell>
                      <TableCell>
                        <Badge variant={order.type === "BUY" ? "default" : "secondary"}>
                          {order.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.strike}</TableCell>
                      <TableCell>{order.qty}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.entryTime}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {order.exitTime}
                      </TableCell>
                      <TableCell>₹{order.entryPrice}</TableCell>
                      <TableCell>₹{order.exitPrice}</TableCell>
                      <TableCell className={order.pnl >= 0 ? 'text-profit font-bold' : 'text-loss font-bold'}>
                        {order.pnl >= 0 ? '+' : ''}₹{order.pnl}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === "TARGET HIT" ? "default" :
                            order.status === "SL HIT" ? "destructive" :
                            "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{order.strategy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrderHistory;
