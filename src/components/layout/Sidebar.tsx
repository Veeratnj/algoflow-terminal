import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronsLeft, ChevronsRight, Menu, X } from "lucide-react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  History, 
  Settings, 
  Users, 
  BarChart3,
  FileText,
  Activity
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const adminNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, disabled: true },
  { title: "Live Trades", url: "/trades", icon: TrendingUp, disabled: false },
  { title: "Order History", url: "/history", icon: History, disabled: false },
  { title: "Strategies", url: "/strategies", icon: Activity, disabled: true },
  { title: "Analytics", url: "/analytics", icon: BarChart3, disabled: true },
  { title: "Logs", url: "/logs", icon: FileText, disabled: true },
  { title: "Users", url: "/users", icon: Users, disabled: true },
  { title: "Settings", url: "/settings", icon: Settings, disabled: true },
];

// Role `user` (or `trader`) limited nav
const userNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, disabled: true },
  { title: "Live Trades", url: "/trades", icon: TrendingUp, disabled: false },
  { title: "Order History", url: "/history", icon: History, disabled: false },
  { title: "Strategies", url: "/strategies", icon: Activity, disabled: true },
  { title: "Analytics", url: "/analytics", icon: BarChart3, disabled: true },
  { title: "Settings", url: "/settings", icon: Settings, disabled: true },
];

interface SidebarProps {
  collapsed?: boolean;
  mobile?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

export const Sidebar = ({ collapsed = false, mobile = false, onClose, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const r = localStorage.getItem("af_role") || null;
    const name = localStorage.getItem("af_user_name") || "User";
    const email = localStorage.getItem("af_user_email") || "";
    setRole(r);
    setUserName(name);
    setUserEmail(email);
  }, []);

  const items = role === "admin" ? adminNav : userNav;

  const handleLogout = () => {
    localStorage.removeItem("af_token");
    localStorage.removeItem("af_role");
    navigate("/");
    // optional: reload to reset any state
    // window.location.reload();
  };

  // For mobile, use Sheet component; for desktop, use sidebar
  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed left-4 top-4 z-40 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent 
              items={items} 
              collapsed={false} 
              role={role}
              userName={userName}
              userEmail={userEmail}
              handleLogout={handleLogout}
              onNavigate={() => setIsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  const asideWidth = collapsed ? "w-20" : "w-64";
  const transitionClass = "transform transition-all duration-300 ease-in-out";

  return (
    <aside className={`hidden md:flex flex-col h-screen ${asideWidth} border-r border-border bg-sidebar ${transitionClass} overflow-hidden`}>
      <SidebarContent 
        items={items} 
        collapsed={collapsed} 
        role={role}
        userName={userName}
        userEmail={userEmail}
        handleLogout={handleLogout}
        onToggle={onToggle}
      />
    </aside>
  );
};

// Extracted sidebar content component for reuse
const SidebarContent = ({ 
  items, 
  collapsed, 
  role,
  userName,
  userEmail,
  handleLogout,
  onToggle,
  onNavigate
}: {
  items: typeof adminNav;
  collapsed?: boolean;
  role: string | null;
  userName: string;
  userEmail: string;
  handleLogout: () => void;
  onToggle?: () => void;
  onNavigate?: () => void;
}) => {
  return (
    <>
      <div className="p-6 border-b border-sidebar-border flex items-center gap-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
          SETC
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto min-h-0">
        {items.map((item) => (
          item.disabled ? (
            <div
              key={item.url}
              className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-lg text-sidebar-foreground/40 cursor-not-allowed relative group`}
              title="Coming Soon - Under Development"
            >
              <item.icon className={`${collapsed ? "h-10 w-10" : "h-5 w-5"}`} />
              <span className={`${collapsed ? "sr-only" : ""}`}>{item.title}</span>
              {!collapsed && (
                <span className="ml-auto text-xs bg-warning/20 text-warning px-2 py-0.5 rounded">Soon</span>
              )}
            </div>
          ) : (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/dashboard"}
              onClick={onNavigate}
              className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-amber-500/10 hover:text-amber-300 transition-all duration-200`}
              activeClassName="bg-amber-500/20 text-amber-300 font-medium border-l-2 border-amber-400"
            >
              <item.icon className={`${collapsed ? "h-10 w-10" : "h-5 w-5"}`} />
              <span className={`${collapsed ? "sr-only" : ""}`}>{item.title}</span>
            </NavLink>
          )
        ))}
      </nav>
      
      <div className="flex-none p-4 border-t border-sidebar-border">
        {/* Collapse toggle placed above user info */}
        {!collapsed && (
          <div className="hidden mb-3">
            <button
              onClick={() => onToggle?.()}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-1 rounded hover:bg-accent/10"
            >
              {collapsed ? <ChevronsRight className="h-6 w-6" /> : <ChevronsLeft className="h-6 w-6" />}
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 px-4 py-3">
          <div className={`${collapsed ? "h-16 w-16 mx-auto" : "h-10 w-10"} rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-500/30`}> 
            <span className={`${collapsed ? "text-xl" : ""}`}>{userName.charAt(0).toUpperCase()}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail || role || "guest"}</p>
            </div>
          )}
        </div>

        <div className="mt-3">
          <Button variant="ghost" className="w-full text-left" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};
