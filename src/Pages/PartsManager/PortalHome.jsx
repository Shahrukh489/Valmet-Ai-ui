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
        bg: "bg-blue-50",
        icon: "text-blue-600",
        badge: "bg-blue-100 text-blue-700"
      },
      green: {
        bg: "bg-green-50",
        icon: "text-green-600",
        badge: "bg-green-100 text-green-700"
      },
      orange: {
        bg: "bg-orange-50",
        icon: "text-orange-600",
        badge: "bg-orange-100 text-orange-700"
      },
      purple: {
        bg: "bg-purple-50",
        icon: "text-purple-600",
        badge: "bg-purple-100 text-purple-700"
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-semibold mb-2">Welcome to Parts Management Portal</h2>
        <p className="text-blue-100 text-sm max-w-2xl">
          Manage your spare parts inventory, track stock levels, update pricing, and generate comprehensive reports all in one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                      {stat.trend === "up" ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">from last month</span>
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
      <div className="bg-white rounded-lg border border-gray-200">
        <TabsNavigation />
      </div>
    </div>
  );
}

export default PortalHome;