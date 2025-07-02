import React from 'react';
import TabsNavigation from './TabsNavigation';
import { 
  Package, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

function PortalHome() {
  // Sample data - replace with actual data from API
  const stats = [
    {
      title: "Total Parts",
      value: "1,152",
      change: "+12.5%",
      trend: "up",
      icon: Package,
      color: "blue"
    },
    {
      title: "Active Items",
      value: "945",
      change: "+5.2%",
      trend: "up",
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Low Stock",
      value: "87",
      change: "-8.3%",
      trend: "down",
      icon: AlertCircle,
      color: "orange"
    },
    {
      title: "Revenue (MTD)",
      value: "$45.2K",
      change: "+18.7%",
      trend: "up",
      icon: TrendingUp,
      color: "purple"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-primary/10",
        icon: "text-primary",
        badge: "bg-primary/20 text-primary"
      },
      green: {
        bg: "bg-success/10",
        icon: "text-success",
        badge: "bg-success/20 text-success"
      },
      orange: {
        bg: "bg-warning/10",
        icon: "text-warning",
        badge: "bg-warning/20 text-warning"
      },
      purple: {
        bg: "bg-secondary/10",
        icon: "text-secondary",
        badge: "bg-secondary/20 text-secondary"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
    

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          
          return (
            <div 
              key={index} 
              className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                      {stat.trend === "up" ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">from last month</span>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="bg-card rounded-lg border border-border">
        <TabsNavigation />
      </div>
    </div>
  );
}

export default PortalHome;