import React, { useState } from 'react';
import PartsManager from './PartsManager';
import UpdateItem from './PartsPortalTabs/UpdateItem';
import SparePartsExcelInput from './SidebarPages/SparePartsExcelInput';
import { 
  Package, 
  Plus, 
  Edit3, 
  Upload,
  FileSpreadsheet
} from 'lucide-react';

function TabsNavigation() {
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      component: PartsManager
    },
    {
      id: 'addParts',
      label: 'Add New Parts',
      icon: Plus,
      component: SparePartsExcelInput
    },
    {
      id: 'updateItem',
      label: 'Update Item',
      icon: Edit3,
      component: UpdateItem
    },
    {
      id: 'upload',
      label: 'Bulk Upload',
      icon: Upload,
      component: () => (
        <div className="flex flex-col items-center justify-center py-16">
          <FileSpreadsheet className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Bulk Upload</h3>
          <p className="text-sm text-muted-foreground max-w-md text-center">
            Upload multiple parts at once using Excel or CSV files. 
            This feature will be available soon.
          </p>
          <button className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Coming Soon
          </button>
        </div>
      )
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-border bg-muted/50 px-6 rounded-t-lg">
        <nav className="-mb-px flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center gap-2 px-4 py-3 
                  border-b-2 font-medium text-sm transition-all
                  ${isActive 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                <span>{tab.label}</span>
                
                {/* Active indicator dot */}
                {isActive && (
                  <span className="ml-1 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6 bg-card rounded-b-lg">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}

export default TabsNavigation;