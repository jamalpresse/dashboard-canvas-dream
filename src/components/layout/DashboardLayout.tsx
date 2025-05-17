import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, Menu, X, Users, Newspaper, ImageIcon, Clock, Bell, Search, Globe, Pencil, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { SNRTNewsFrame } from "@/components/common/SNRTNewsFrame";
import BreadcrumbNav from "@/components/common/BreadcrumbNav";
import { RssTickerFloat } from "@/components/common/RssTickerFloat";

const navItems = [{
  title: "Dashboard",
  href: "/",
  icon: <LayoutDashboard className="h-6 w-6" />
}, {
  title: "Actualités",
  href: "/news",
  icon: <Newspaper className="h-6 w-6" />
}, {
  title: "Users",
  href: "/users",
  icon: <Users className="h-6 w-6" />
}];
const categories = [{
  name: "POLITIQUE",
  href: "/news?category=politique"
}, {
  name: "ECONOMIE",
  href: "/news?category=economie"
}, {
  name: "SPORT",
  href: "/news?category=sport"
}, {
  name: "CULTURE",
  href: "/news?category=culture"
}, {
  name: "INTERNATIONAL",
  href: "/news?category=international"
}];

// Ajout des liens vers les fonctionnalités
const utilityLinks = [{
  title: "Recherche",
  href: "/search",
  icon: <Search className="h-5 w-5" />
}, {
  title: "Améliorer Texte",
  href: "/improve",
  icon: <Pencil className="h-5 w-5" />
}, {
  title: "Traduction",
  href: "/translation",
  icon: <Languages className="h-5 w-5" />
}, {
  title: "Génération d'Images",
  href: "/image-generation",
  icon: <ImageIcon className="h-5 w-5" />
}];
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewsFrame, setShowNewsFrame] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const toggleNewsFrame = () => {
    setShowNewsFrame(!showNewsFrame);
  };
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return <div className="min-h-screen bg-background text-foreground">
      {/* SNRT-style header */}
      <header className="snrt-header flex flex-col">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold font-playfair text-snrt-red">SNRTnews</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-snrt-red" />
              <span>{currentTime}</span>
              <span className="text-gray-400">|</span>
              <span>{currentDate}</span>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:text-snrt-red">
              <Bell className="h-5 w-5" />
            </Button>
            <Link to="/search">
              <Button variant="ghost" size="icon" className="text-white hover:text-snrt-red">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* SNRT-style category navigation - Maintenant complète */}
        <nav className="snrt-nav overflow-x-auto scrollbar-hide bg-snrt-red text-white">
          <div className="flex items-center px-4 py-2 space-x-4">
            {categories.map(category => (
              <Link 
                key={category.name}
                to={category.href}
                className="whitespace-nowrap font-medium hover:text-white/80 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile menu button */}
      {isMobile && <button className="fixed top-4 right-4 z-50 bg-snrt-red rounded-full p-2 shadow-md text-white" onClick={toggleSidebar}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>}
      
      {/* Sidebar - Updated for dark theme */}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col bg-black/90 backdrop-blur-md border-r border-gray-800 shadow-lg transition-transform duration-300 ease-in-out", isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0")}>
        <div className="flex h-16 items-center border-b border-gray-800 px-6">
          <Link to="/">
            <h1 className="text-2xl font-bold font-playfair text-snrt-red">
              SNRTnews
            </h1>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-auto p-4">
          <div className="space-y-1 pb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              MENU PRINCIPAL
            </h2>
            {navItems.map((item, i) => <NavLink key={i} to={item.href} onClick={() => isMobile && setSidebarOpen(false)} className={({
            isActive
          }) => cn("flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 ease-in-out", isActive ? "bg-snrt-red text-white shadow-md" : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-sm")}>
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>)}
            
            {/* SNRT News button */}
            <button onClick={toggleNewsFrame} className="flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 ease-in-out w-full text-left hover:bg-gray-800 hover:shadow-sm text-snrt-red text-xl font-bold">
              <span className="flex-shrink-0">📰</span>
              <span>SNRT News</span>
            </button>
            
            {/* Outils et Fonctionnalités - NOUVELLE SECTION */}
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-3">
              OUTILS
            </h2>
            {utilityLinks.map((item, i) => <NavLink key={i} to={item.href} onClick={() => isMobile && setSidebarOpen(false)} className={({
            isActive
          }) => cn("flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ease-in-out", isActive ? "bg-snrt-red text-white shadow-md" : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-sm")}>
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>)}
            
            {/* Weather Widget under Dashboard button */}
            <div className="mt-4 px-2">
              <WeatherWidget city="Casablanca" className="w-full shadow-sm border border-gray-800" />
            </div>
          </div>
        </nav>
        
        <div className="border-t border-gray-800 p-4">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800 hover:text-white">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </Button>
        </div>
      </aside>

      {/* Main Content with Breadcrumb */}
      <main className={cn("transition-all duration-300", isMobile ? "ml-0" : "ml-64", "pb-16 pt-4")}>
        <div className="px-4 md:px-6">
          {/* Fil d'Ariane */}
          {location.pathname !== '/' && <div className="mb-4">
              <BreadcrumbNav />
            </div>}
          <Outlet />
        </div>
      </main>

      {/* SNRT News Frame Modal */}
      {showNewsFrame && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl">
            <SNRTNewsFrame onClose={toggleNewsFrame} />
          </div>
        </div>}
        
      {/* RSS Ticker flottant en bas */}
      <RssTickerFloat />
    </div>;
}
