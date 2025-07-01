import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  BarChart3, 
  Package, 
  Users, 
  FileText, 
  Bug, 
  Home,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Shield
} from "lucide-react";

const PortalSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: "home",
      to: "/managerportal",
      label: "Parts Portal",
      icon: Package,
      exact: true,
      description: "Main portal dashboard"
    },
    {
      id: "analytics",
      to: "/managerportal/analytics-page",
      label: "Analytics",
      icon: BarChart3,
      description: "Business intelligence & reports"
    },
    {
      id: "roles",
      to: "/managerportal/role-manager",
      label: "Role Manager",
      icon: Users,
      description: "User access control"
    },
    {
      id: "reports",
      to: "/managerportal/generate-reports",
      label: "Reports",
      icon: FileText,
      description: "Generate & export data"
    },
    {
      id: "bugs",
      to: "/managerportal/bug-reports",
      label: "Bug Reports",
      icon: Bug,
      description: "Issue tracking system"
    },
  ];

  const bottomMenuItems = [
    {
      id: "settings",
      to: "/managerportal/settings",
      label: "Settings",
      icon: Settings,
      description: "System configuration"
    },
    {
      id: "help",
      to: "/managerportal/help",
      label: "Help & Support",
      icon: HelpCircle,
      description: "Documentation & support"
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.to;
    }
    return location.pathname.includes(item.to);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed left-0 top-[56px] h-[calc(100vh-56px)] w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col z-40">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Manager Portal</h2>
            <p className="text-xs text-muted-foreground">Business Management</p>
          </div>
        </div>
        
       
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Main Menu
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`sidebar-item group ${active ? "sidebar-item-active" : ""}`}
                title={item.description}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border p-6">
        <div className="space-y-1 mb-6">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            System
          </div>
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <Link
                key={item.id}
                to={item.to}
                className={`sidebar-item group ${active ? "sidebar-item-active" : ""}`}
                title={item.description}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                    <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="mt-6 border-t border-sidebar-border pt-4">
            <div className="flex items-center gap-3 p-3 bg-surface-elevated rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold ring-2 ring-primary/20">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name || 'Manager'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-success">Online</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full mt-3 sidebar-item justify-start group hover:bg-destructive/10 hover:text-destructive"
              title="Sign out of manager portal"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalSidebar;