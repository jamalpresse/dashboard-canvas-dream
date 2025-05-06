import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, BellIcon, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [{
  title: "Dashboard",
  href: "/",
  icon: <LayoutDashboard className="h-5 w-5" />
}];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 transition-transform duration-300", isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0")}>
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold text-primary">SNRTnews
        </h1>
        </div>
        <nav className="flex-1 overflow-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item, i) => <li key={i}>
                <NavLink to={item.href} onClick={() => isMobile && setSidebarOpen(false)} className={({
              isActive
            }) => cn("flex items-center rounded-md px-3 py-2 text-sm font-medium", isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800")}>
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                </NavLink>
              </li>)}
          </ul>
        </nav>
        <div className="border-t p-4">
          
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("flex flex-col min-h-screen transition-all duration-300", isMobile ? "ml-0" : "ml-64")}>
        {/* Header */}
        

        {/* Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>;
}
