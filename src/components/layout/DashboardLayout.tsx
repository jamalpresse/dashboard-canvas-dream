import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, Menu, X, Users, Newspaper, ImageIcon, Clock, Bell, Search, Pencil, Languages, LogOut, User, FileText, Video, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

import { SNRTNewsFrame } from "@/components/common/SNRTNewsFrame";
import BreadcrumbNav from "@/components/common/BreadcrumbNav";
import { RssTickerFloat } from "@/components/common/RssTickerFloat";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewsFrame, setShowNewsFrame] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { t, lang, dir, isRTL } = useLanguage();
  const { user, profile, signOut } = useAuth();

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

  // Get user initials for avatar fallback
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Navigation items using translation context - Dashboard en premier
  const navItems = [{
    title: t('navigation', 'dashboard'),
    href: "/",
    icon: <LayoutDashboard className="h-6 w-6" />,
    isHome: true
  }, {
    title: t('navigation', 'news'),
    href: "/news",
    icon: <Newspaper className="h-6 w-6" />
  }, {
    title: t('navigation', 'users'),
    href: "/users",
    icon: <Users className="h-6 w-6" />
  }];
  
  const categories = [{
    name: t('categories', 'politique'),
    href: "/news?category=politique"
  }, {
    name: t('categories', 'economie'),
    href: "/news?category=economie"
  }, {
    name: t('categories', 'sport'),
    href: "/news?category=sport"
  }, {
    name: t('categories', 'culture'),
    href: "/news?category=culture"
  }, {
    name: t('categories', 'international'),
    href: "/news?category=international"
  }];

  // Utility links with translations
  const utilityLinks = [{
    title: t('navigation', 'search'),
    href: "/search",
    icon: <Search className="h-5 w-5" />
  }, {
    title: t('navigation', 'improveText'),
    href: "/improve",
    icon: <Pencil className="h-5 w-5" />
  }, {
    title: t('navigation', 'translation'),
    href: "/translation",
    icon: <Languages className="h-5 w-5" />
  }, {
    title: t('navigation', 'transcription'),
    href: "/transcription",
    icon: <FileText className="h-5 w-5" />
  }, {
    title: t('navigation', 'videoTranscription') || 'Transcription vidéo',
    href: "/video-transcription",
    icon: <Video className="h-5 w-5" />
  }, {
    title: t('navigation', 'pdfTranscription') || 'Transcription PDF',
    href: "/pdf-transcription",
    icon: <FileDown className="h-5 w-5" />
  }, {
    title: t('navigation', 'imageGeneration'),
    href: "/image-generation",
    icon: <ImageIcon className="h-5 w-5" />
  }, {
    title: t('navigation', 'briefing'),
    href: "/briefing",
    icon: <FileText className="h-5 w-5" />
  }];
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={dir}>
      {/* SNRT-style header */}
      <header className="snrt-header">
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold font-playfair text-snrt-red">SNRTnews</h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
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
            
            {/* User profile menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-snrt-red text-white">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{profile?.full_name || user?.email}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('navigation', 'logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* SNRT-style category navigation */}
        <nav className="snrt-nav overflow-x-auto scrollbar-hide bg-snrt-red text-white">
          
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
      <aside className={cn(
        "fixed inset-y-0 flex h-full w-60 flex-col bg-black/90 backdrop-blur-md border-r border-gray-800 shadow-lg transition-transform duration-300 ease-in-out z-40", 
        isRTL ? "right-0" : "left-0", 
        isMobile && !sidebarOpen ? isRTL ? "translate-x-full" : "-translate-x-full" : "translate-x-0"
      )}>
        <div className="flex h-16 items-center border-b border-gray-800 px-6">
          <Link to="/">
            <div>
              <h1 className="text-2xl font-bold font-playfair text-snrt-red">
                SIRAJ
              </h1>
              <p className="text-sm text-gray-400 font-light -mt-1">
                by JE
              </p>
            </div>
          </Link>
        </div>
        
        {/* User profile in sidebar */}
        <div className="border-b border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-snrt-red text-white">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-white">{profile?.full_name || "User"}</p>
              <p className="text-xs text-gray-400">{profile?.role || "User"}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-auto p-4">
          {/* Bouton tableau de bord déplacé vers le haut */}
          <div className="mb-6 -mt-4">
            <NavLink to="/" onClick={() => isMobile && setSidebarOpen(false)} className={({
              isActive
            }) => cn("flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 ease-in-out", 
            isActive ? "bg-snrt-red text-white shadow-md" : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-sm",
            "ring-2 ring-primary/20 border border-primary/30")}>
              <span className="flex-shrink-0"><LayoutDashboard className="h-6 w-6" /></span>
              <span>{t('navigation', 'dashboard')}</span>
              <span className="ml-auto text-xs bg-primary/20 px-2 py-1 rounded-full">🏠</span>
            </NavLink>
          </div>
          
          <div className="space-y-1 pb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
              {t('navigation', 'mainMenu')}
            </h2>
            
            {navItems.slice(1).map((item, i) => <NavLink key={i} to={item.href} onClick={() => isMobile && setSidebarOpen(false)} className={({
            isActive
          }) => cn("flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 ease-in-out", 
          isActive ? "bg-snrt-red text-white shadow-md" : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-sm")}>
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>)}
            
            {/* SNRT News button */}
            <button onClick={toggleNewsFrame} className="flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 ease-in-out w-full text-left hover:bg-gray-800 hover:shadow-sm text-snrt-red text-xl font-bold">
              <span className="flex-shrink-0">📰</span>
              <span>SNRT News</span>
            </button>
            
            {/* Tools section */}
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-3">
              {t('navigation', 'tools')}
            </h2>
            
            {utilityLinks.map((item, i) => <NavLink key={i} to={item.href} onClick={() => isMobile && setSidebarOpen(false)} className={({
            isActive
          }) => cn("flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium transition-all duration-200 ease-in-out", isActive ? "bg-snrt-red text-white shadow-md" : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-sm")}>
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>)}
            
          </div>
        </nav>
        
        <div className="border-t border-gray-800 p-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2 text-red-400 hover:bg-gray-800 hover:text-white"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            <span>{t('navigation', 'logout')}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content with Breadcrumb - Updated for RTL support */}
      <main className={cn(
        "flex-1 transition-all duration-300", 
        isMobile ? "ml-0 mr-0" : isRTL ? "mr-60" : "ml-60", 
        "pb-4 pt-2"
      )}>
        <div className="px-3 md:px-4 w-full">
          {/* Breadcrumb */}
          {location.pathname !== '/' && (
            <div className="mb-3">
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
