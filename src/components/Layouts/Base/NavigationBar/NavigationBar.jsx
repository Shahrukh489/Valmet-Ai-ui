import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../../../Redux/cartSlice";
import { useAuth } from "../../../../contexts/AuthContext";
import { useTheme } from "../../../../contexts/ThemeContext";

import { Button } from "../../../ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "../../../ui/dropdown-menu";
import { Badge } from "../../../ui/badge";
import { cn } from "../../../../lib/utils";

import { 
  User, 
  ShoppingCart, 
  Globe, 
  ChevronDown, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Shield,
  Package,
  Search,
  Home,
  Bell,
  HelpCircle,
  Bug,
  Calculator,
  Moon,
  Sun
} from "lucide-react";

function NavigationBar() {
  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const { roles } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const isAdminOrManager = roles.some((role) =>
    ["Admin", "Manager"].includes(role)
  );

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      localStorage.setItem('selectedLanguage', lng);
    });
  };

  const handleLogout = () => {
    dispatch(clearCart());
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
    window.location.href = "/login";
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: "/",
      label: t('navigation.home'),
      icon: Home,
      show: true
    },
    {
      path: "/search",
      label: t('navigation.columnConfigurator'),
      icon: Calculator,
      show: true
    },
    {
      path: "/searchparts",
      label: t('navigation.searchParts'),
      icon: Search,
      show: true
    },
    {
      path: "/managerportal",
      label: t('navigation.managerPortal'),
      icon: Shield,
      show: isAdminOrManager
    }
  ];

  return (
    <>
      {/* Modern Azure Navigation */}
      <nav className="nav-main h-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/Valmet.png"
                alt="Valmet"
                className="h-8 w-auto brightness-0 invert group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 ease-out"
              />
              <div className="hidden sm:block">
                <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">SPT</span>
                <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">Spare Parts Portal</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.filter(item => item.show).map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "nav-item group",
                      isActive ? "nav-link-active" : "nav-link"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="nav-item">
                    <span className="text-lg">
                      {languages.find(lang => lang.code === i18n.language)?.flag || '🇺🇸'}
                    </span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t('navigation.language')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={cn(
                        "flex items-center space-x-3",
                        i18n.language === lang.code && "bg-accent"
                      )}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="flex-1">{lang.name}</span>
                      {i18n.language === lang.code && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Shopping Cart */}
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className="nav-item relative"
              >
                <Link to="/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline font-medium">{t('navigation.cart')}</span>
                  {cartTotalQuantity > 0 && (
                    <Badge 
                      variant="default" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce"
                    >
                      {cartTotalQuantity}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="nav-item">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline font-medium">Account</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{t('navigation.myAccount')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/user-settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      User Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme} className="flex items-center">
                    {theme === 'dark' ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    <span className="flex-1">
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/report-a-bug" className="flex items-center">
                      <Bug className="h-4 w-4 mr-2" />
                      {t('navigation.reportBug')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/help" className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {t('navigation.helpSupport')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('navigation.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden nav-item"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-down">
              <div className="px-4 py-6 space-y-4">
                
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {navItems.filter(item => item.show).map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveLink(item.path);
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors",
                          isActive 
                            ? "bg-accent text-accent-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Language Selection */}
                <div className="pt-4 border-t border-border">
                  <div className="text-sm font-medium text-foreground mb-3">{t('navigation.language')}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors",
                          i18n.language === lang.code
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="text-xs">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Action Items */}
                <div className="pt-4 border-t border-border space-y-2">
                  <button
                    onClick={() => {
                      toggleTheme();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors w-full text-left"
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                  <Link
                    to="/report-a-bug"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                  >
                    <Bug className="h-5 w-5" />
                    <span>{t('navigation.reportBug')}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{t('navigation.logout')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16"></div>
    </>
  );
}

export default NavigationBar;