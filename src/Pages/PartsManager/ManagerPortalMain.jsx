import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import PortalSidebar from "./PortalSidebar";
import { ChevronRight, Clock, Calendar, Wifi } from "lucide-react";

function ManagerPortalMain() {
  const location = useLocation();

  // Get page title and description based on current route
  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes("analytics")) return {
      title: "Analytics Dashboard",
      description: "Business intelligence and performance metrics",
      category: "Analytics"
    };
    if (path.includes("role-manager")) return {
      title: "Role Management", 
      description: "User access control and permissions",
      category: "Security"
    };
    if (path.includes("generate-reports")) return {
      title: "Report Generation",
      description: "Generate and export business reports",
      category: "Reports"
    };
    if (path.includes("bug-reports")) return {
      title: "Bug Reports",
      description: "Issue tracking and resolution management",
      category: "Support"
    };
    if (path.includes("parts-editor")) return {
      title: "Parts Editor",
      description: "Advanced spare parts management with CRUD operations",
      category: "Management"
    };
    if (path.includes("settings")) return {
      title: "System Settings",
      description: "Configuration and preferences",
      category: "System"
    };
    if (path.includes("help")) return {
      title: "Help & Support",
      description: "Documentation and support resources",
      category: "Support"
    };
    return {
      title: "Parts Management Portal",
      description: "Manage spare parts, inventory, and business operations",
      category: "Dashboard"
    };
  };

  const pageInfo = getPageInfo();
  const currentTime = new Date();

  return (
    <div className="flex min-h-screen bg-background" >
      {/* Azure Sidebar */}
      <PortalSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 transition-all duration-300">
        {/* Enhanced Content Header */}
        <div className="card-header bg-card border-b border-border px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span>Manager Portal</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-primary font-medium">{pageInfo.category}</span>
              </nav>
              
              {/* Page Title and Description */}
              <div>
                <h1 className="text-2xl font-semibold text-card-foreground mb-2">
                  {pageInfo.title}
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  {pageInfo.description}
                </p>
              </div>
            </div>

            {/* Status Panel */}
            <div className="flex items-center gap-6">
              {/* System Status */}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">System Online</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Clock className="w-3 h-3" />
                  <span>
                    Last sync: {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                <button className="btn-outline p-3 text-xs">
                  Export Data
                </button>
                <button className="btn-primary p-3 text-xs">
                  Quick Action
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content with Azure Styling */}
        <main className="bg-background">
          <div className="container mx-auto px-6 py-4">
            <div className="max-w-7xl mx-auto">
              {/* Content Wrapper */}
              <div className="min-h-full">
                <Outlet />
              </div>
            </div>
          </div>
        </main>

        {/* Footer Status Bar */}
        <div className="border-t border-border bg-card p-3">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-6">
              <span>Valmet SPT Manager Portal v2.1.0</span>
              <span>•</span>
              <span>Azure Enterprise Edition</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default ManagerPortalMain;