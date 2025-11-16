import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

const liveTrades = [
  {
    id: 1,
    symbol: "NIFTY 21900 CE",
    index: "NIFTY",
    strike: 21900,
    type: "CE",
    qty: 50,
    entryPrice: 125.50,
    currentPrice: 142.30,
    pnl: 840,
    pnlPercent: 13.4,
    status: "ACTIVE",
    strategy: "Straddle Strategy",
    timestamp: "10:15 AM",
  },
  {
    id: 2,
    symbol: "BANKNIFTY 46000 PE",
    index: "BANKNIFTY",
    strike: 46000,
    type: "PE",
    qty: 25,
    entryPrice: 245.80,
    currentPrice: 234.20,
    pnl: -290,
    pnlPercent: -4.7,
    status: "ACTIVE",
    strategy: "Iron Condor",
    timestamp: "10:22 AM",
  },
  {
    id: 3,
    symbol: "FINNIFTY 19500 CE",
    index: "FINNIFTY",
    strike: 19500,
    type: "CE",
    qty: 40,
    entryPrice: 89.50,
    currentPrice: 102.80,
    pnl: 532,
    pnlPercent: 14.9,
    status: "ACTIVE",
    strategy: "Bull Call Spread",
    timestamp: "10:45 AM",
  },
];

const LiveTrades = () => {
  const totalPnl = liveTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalPnlPercent = (totalPnl / liveTrades.reduce((sum, trade) => sum + (trade.entryPrice * trade.qty), 0)) * 100;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Live Trades</h2>
            <p className="text-muted-foreground mt-1">Monitor your active positions in real-time</p>
          </div>
          <Card className="bg-gradient-to-br from-card to-secondary border-border/50">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Live P&L</div>
              <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                ₹{totalPnl.toLocaleString()}
              </div>
              <div className={`text-sm ${totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trade Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {liveTrades.map((trade) => (
            <Card key={trade.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{trade.symbol}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{trade.strategy}</p>
                  </div>
                  <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                    {trade.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trade Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Index</p>
                    <p className="text-sm font-medium">{trade.index}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium">{trade.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Strike</p>
                    <p className="text-sm font-medium">{trade.strike}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="text-sm font-medium">{trade.qty}</p>
                  </div>
                </div>

                {/* Price Section */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Entry Price</p>
                    <p className="text-sm font-medium">₹{trade.entryPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Current Price</p>
                    <p className="text-sm font-medium">₹{trade.currentPrice}</p>
                  </div>
                </div>

                {/* P&L Section */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Profit & Loss</span>
                    {trade.pnl >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-profit" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-loss" />
                    )}
                  </div>
                  <div className="flex items-end justify-between mt-1">
                    <span className={`text-2xl font-bold ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      ₹{Math.abs(trade.pnl)}
                    </span>
                    <span className={`text-sm font-medium ${trade.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {trade.pnl >= 0 ? '+' : '-'}{Math.abs(trade.pnlPercent)}%
                    </span>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-muted-foreground text-right">
                  Entry: {trade.timestamp}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LiveTrades;
