import { useState } from "react";
import { FoodStall, Order, getCrowdLevel } from "@/lib/stadium-data";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Clock, CheckCircle, Loader2 } from "lucide-react";

interface FoodOrderPanelProps {
  stalls: FoodStall[];
  orders: Order[];
  onPlaceOrder: (stallId: string, items: string[]) => void;
}

export default function FoodOrderPanel({ stalls, orders, onPlaceOrder }: FoodOrderPanelProps) {
  const [selectedStall, setSelectedStall] = useState<string | null>(null);
  const [cart, setCart] = useState<string[]>([]);

  const toggleItem = (name: string) => {
    setCart(prev => prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]);
  };

  const placeOrder = () => {
    if (!selectedStall || cart.length === 0) return;
    onPlaceOrder(selectedStall, cart);
    setCart([]);
    setSelectedStall(null);
  };

  const crowdBadge = (level: string) => {
    const colors = { low: "bg-crowd-low/20 text-crowd-low", medium: "bg-crowd-medium/20 text-crowd-medium", high: "bg-crowd-high/20 text-crowd-high" };
    return <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${colors[level as keyof typeof colors]}`}>{level}</span>;
  };

  const statusIcon = (status: string) => {
    if (status === "ready") return <CheckCircle className="w-3.5 h-3.5 text-success" />;
    if (status === "preparing") return <Loader2 className="w-3.5 h-3.5 text-warning animate-spin" />;
    return <Clock className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div className="glass rounded-lg p-4 space-y-3 animate-fade-in">
      <h3 className="font-semibold flex items-center gap-2 text-sm">
        <ShoppingCart className="w-4 h-4 text-primary" /> Food & Queues
      </h3>

      {/* Stalls */}
      <div className="space-y-2">
        {stalls.map(stall => (
          <button key={stall.id} onClick={() => { setSelectedStall(stall.id === selectedStall ? null : stall.id); setCart([]); }}
            className={`w-full text-left rounded-md p-2.5 transition-colors border ${selectedStall === stall.id ? "border-primary bg-primary/10" : "border-border bg-muted/30 hover:bg-muted/60"}`}>
            <div className="flex justify-between items-center">
              <span className="font-medium text-xs">{stall.name}</span>
              {crowdBadge(stall.crowd)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-[11px]">
              <Clock className="w-3 h-3" /> ~{stall.waitTime} min wait
            </div>
          </button>
        ))}
      </div>

      {/* Menu */}
      {selectedStall && (() => {
        const stall = stalls.find(s => s.id === selectedStall)!;
        return (
          <div className="space-y-2 bg-muted/30 rounded-md p-2.5">
            <span className="text-xs font-medium">{stall.name} Menu</span>
            {stall.menu.map(item => (
              <label key={item.name} className="flex items-center justify-between cursor-pointer text-xs">
                <span className="flex items-center gap-2">
                  <input type="checkbox" checked={cart.includes(item.name)} onChange={() => toggleItem(item.name)}
                    className="accent-primary" />
                  {item.name}
                </span>
                <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
              </label>
            ))}
            <Button size="sm" className="w-full text-xs mt-1" onClick={placeOrder} disabled={cart.length === 0}>
              Place Order ({cart.length} items)
            </Button>
          </div>
        );
      })()}

      {/* Orders */}
      {orders.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Your Orders</span>
          {orders.map(order => {
            const stall = stalls.find(s => s.id === order.stallId);
            return (
              <div key={order.id} className="flex items-center justify-between bg-muted/40 rounded-md px-2.5 py-2 text-xs">
                <div className="flex items-center gap-2">
                  {statusIcon(order.status)}
                  <span>{stall?.name} — {order.items.join(", ")}</span>
                </div>
                <span className="capitalize text-muted-foreground">{order.status}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
