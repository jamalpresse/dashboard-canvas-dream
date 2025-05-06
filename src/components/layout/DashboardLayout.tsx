
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { RssTickerFloat } from "@/components/common/RssTickerFloat";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: <LayoutDashboard className="h-6 w-6" /> // Increased icon size from h-5 w-5
  }
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-md text-purple-700"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col bg-white/90 backdrop-blur-md border-r border-purple-100 shadow-lg transition-transform duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex h-16 items-center border-b border-purple-100 px-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            SNRTnews
          </h1>
        </div>
        
        <nav className="flex-1 overflow-auto p-4">
          <div className="space-y-1 pb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              MENU PRINCIPAL
            </h2>
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.href}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={({isActive}) => cn(
                  "flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 ease-in-out", // Increased size, padding, font weight and gap
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-sm" // Added subtle shadow on hover
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>
            ))}
            
            {/* Weather Widget under Dashboard button */}
            <div className="mt-4 px-2">
              <WeatherWidget city="Casablanca" className="w-full shadow-sm border border-purple-100" />
            </div>
          </div>
        </nav>
        
        <div className="border-t border-purple-100 p-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700"
          >
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("transition-all duration-300", isMobile ? "ml-0" : "ml-64", "pb-16")}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Floating RSS Ticker */}
      <RssTickerFloat />
    </div>
  );
}
