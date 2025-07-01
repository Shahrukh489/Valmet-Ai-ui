import React, { useState } from 'react'
import { Shield, Users, Settings } from 'lucide-react';
import RoleManagerInterface from './RoleManagerInterface';

function RoleManager() {

  const [setUserList, UserList] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  
  return (
    <div className="azure-space-xl">
      <div className="azure-card">
        <div className="azure-card-header">
          <div className="flex items-center azure-gap-sm">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">
                Role Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage user roles and permissions for the parts management application
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center azure-gap-lg">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">24</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-warning">5</div>
              <div className="text-xs text-muted-foreground">Roles</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-success">98%</div>
              <div className="text-xs text-muted-foreground">Coverage</div>
            </div>
          </div>
        </div>

        <RoleManagerInterface />
      </div>
    </div>
  );
}

export default RoleManager