import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, Menu, X, Users, Newspaper, ImageIcon, Clock, Bell, Search, Pencil, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { SNRTNewsFrame } from "@/components/common/SNRTNewsFrame";
import BreadcrumbNav from "@/components/common/BreadcrumbNav";
import { RssTickerFloat } from "@/components/common/RssTickerFloat";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewsFrame, setShowNewsFrame] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { t, lang, dir, isRTL } = useLanguage();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleNewsFrame = () => {
    setShowNewsFrame(!showNewsFrame);
  };
  
  // Get formatted date in the current language
  const currentDate = new Date().toLocaleDateString(isRTL ? 'ar-MA' : 'fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const currentTime = new Date().toLocaleTimeString(isRTL ? 'ar-MA' : 'fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Navigation items using translation context
  const navItems = [
    {
      title: t('navigation', 'dashboard'),
      href: "/",
      icon: <LayoutDashboard className="h-6 w-6" />
    },
    {
      title: t('navigation', 'news'),
      href: "/news",
      icon: <Newspaper className="h-6 w-6" />
    },
    {
      title: t('navigation', 'users'),
      href: "/users",
      icon: <Users className="h-6 w-6" />
    }
  ];
  
  const categories = [
    {
      name: t('categories', 'politique'),
      href: "/news?category=politique"
    },
    {
      name: t('categories', 'economie'),
      href: "/news?category=economie"
    },
    {
      name: t('categories', 'sport'),
      href: "/news?category=sport"
    },
    {
      name: t('categories', 'culture'),
      href: "/news?category=culture"
    },
    {
      name: t('categories', 'international'),
      href: "/news?category=international"
    }
  ];
  
  // Utility links with translations
  const utilityLinks = [
    {
      title: t('navigation', 'search'),
      href: "/search",
      icon: <Search className="h-5 w-5" />
    },
    {
      title: t('navigation', 'improveText'),
      href: "/improve",
      icon: <Pencil className="h-5 w-5" />
    },
    {
      title: t('navigation', 'translation'),
      href: "/translation",
      icon: <Languages className="h-5 w-5" />
    },
    {
      title: t('navigation', 'imageGeneration'),
      href: "/image-generation",
      icon: <ImageIcon className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
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
        
        {/* SNRT-style category navigation */}
        <nav className="snrt-nav overflow-x-auto scrollbar-hide bg-snrt-red text-white">
          <div className={`flex items-center px-4 py-2 space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
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
      {isMobile && (
        <button 
          className="fixed top-4 right-4 z-50 bg-snrt-red rounded-full p-2 shadow-md text-white" 
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      )}
      
      {/* Sidebar - Updated for RTL support */}
      <aside 
        className={cn(
          "fixed inset-y-0 flex h-full w-64 flex-col bg-black/90 backdrop-blur-md border-r border-gray-800 shadow-lg transition-transform duration-300 ease-in-out",
          isRTL ? "right-0" : "left-0",
          isMobile && !sidebarOpen ? (isRTL ? "translate-x-full" : "-translate-x-full") : "translate-x-0"
        )}
      >
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
              {t('navigation', 'mainMenu')}
            </h2>
            
            {navItems.map((item, i) => (
              <NavLink 
                key={i} 
                to={item.href} 
                onClick={() => isMobile && setSidebarOpen(false)} 
                className={({isActive}) => cn(
                  "flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 ease-in-out", 
                  isActive ? "bg-snrt-red text-white shadow-md" : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-sm"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>
            ))}
            
            {/* SNRT News button */}
            <button 
              onClick={toggleNewsFrame} 
              className="flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 ease-in-out w-full text-left hover:bg-gray-800 hover:shadow-sm text-snrt-red text-xl font-bold"
            >
              <span className="flex-shrink-0">📰</span>
              <span>SNRT News</span>
            </button>
            
            {/* Tools section */}
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-3">
              {t('navigation', 'tools')}
            </h2>
            
            {utilityLinks.map((item, i) => (
              <NavLink 
                key={i} 
                to={item.href} 
                onClick={() => isMobile && setSidebarOpen(false)} 
                className={({isActive}) => cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ease-in-out", 
                  isActive ? "bg-snrt-red text-white shadow-md" : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-sm"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>
            ))}
            
            {/* Weather Widget */}
            <div className="mt-4 px-2">
              <WeatherWidget city={isRTL ? "الدار البيضاء" : "Casablanca"} className="w-full shadow-sm border border-gray-800" />
            </div>
          </div>
        </nav>
        
        <div className="border-t border-gray-800 p-4">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800 hover:text-white">
            <Settings className="h-4 w-4" />
            <span>{t('navigation', 'settings')}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content with Breadcrumb - Updated for RTL support */}
      <main 
        className={cn(
          "transition-all duration-300", 
          isMobile ? "ml-0 mr-0" : isRTL ? "mr-64" : "ml-64", 
          "pb-16 pt-4"
        )}
      >
        <div className="px-4 md:px-6">
          {/* Breadcrumb */}
          {location.pathname !== '/' && (
            <div className="mb-4">
              <BreadcrumbNav />
            </div>
          )}
          <Outlet />
        </div>
      </main>

      {/* SNRT News Frame Modal */}
      {showNewsFrame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl">
            <SNRTNewsFrame onClose={toggleNewsFrame} />
          </div>
        </div>
      )}
        
      {/* RSS Ticker - Now using the LanguageContext directly */}
      <RssTickerFloat />
    </div>
  );
}
