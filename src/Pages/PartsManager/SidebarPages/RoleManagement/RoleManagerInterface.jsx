import React, { useState, useEffect } from "react";
import { Users, UserPlus, Shield, Plus, Loader2, AlertTriangle, Check } from "lucide-react";
import UserTable from "./UserTable";

function RoleManagerInterface() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  const AuthApiBaseUrl = import.meta.env.VITE_AUTHENTICATIONAPI_BASE_URL;

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${AuthApiBaseUrl}/api/auth/GetAllRoles`
        ); // Replace with your actual API endpoint
        const data = await response.json();
        if (data.isSuccess && data.result) {
          setRoles(data.result); // Accessing the roles array from `result`
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleAddRole = () => {
    setShowModal(true); // Show confirmation modal
  };

  const confirmAddRole = async () => {
    setIsConfirming(true);
    try {
      // Assuming your API accepts POST requests to add new roles
      const response = await fetch(`${AuthApiBaseUrl}/api/auth/CreateRole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRole }),
      });
      if (response.ok) {
        const addedRole = await response.json();
        if (addedRole.isSuccess) {
          setRoles([...roles, addedRole.result]);
          setNewRole("");
        }
      } else {
        console.error("Failed to add role");
      }
    } catch (error) {
      console.error("Error adding role:", error);
    } finally {
      setIsConfirming(false);
      setShowModal(false);
    }
  };

  return (
    <div className="azure-space-lg">
      {/* Azure Tab Navigation */}
      <div className="flex border-b border-border azure-mb-lg">
        <button
          onClick={() => setActiveTab("users")}
          className={`azure-space-md border-b-2 azure-transition ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center azure-gap-sm">
            <Users className="w-4 h-4" />
            <span className="font-medium">Users</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`azure-space-md border-b-2 azure-transition ${
            activeTab === "roles"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center azure-gap-sm">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Roles</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "users" && (
        <div>
          <UserTable />
        </div>
      )}

      {activeTab === "roles" && (
        <div className="space-y-6">
          {/* Add Role Form */}
          <div className="azure-card">
            <div className="azure-card-header">
              <div className="flex items-center azure-gap-sm">
                <UserPlus className="w-5 h-5 text-primary" />
                <h3 className="azure-card-title">Add New Role</h3>
              </div>
            </div>
            
            <div className="azure-space-lg">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Enter new role name (e.g., 'Manager', 'Analyst')"
                    className="w-full bg-input border border-border rounded-lg azure-space-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 azure-transition"
                  />
                </div>

                <button
                  onClick={handleAddRole}
                  disabled={isLoading || !newRole.trim()}
                  className="azure-btn-primary flex items-center azure-gap-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{isLoading ? "Adding..." : "Add Role"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Existing Roles */}
          <div className="azure-card">
            <div className="azure-card-header">
              <h3 className="azure-card-title">Existing Roles</h3>
              <div className="text-sm text-muted-foreground">
                {roles.length} role{roles.length !== 1 ? 's' : ''} configured
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center azure-space-xl">
                <div className="flex items-center azure-gap-sm text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm">Loading roles...</span>
                </div>
              </div>
            ) : (
              <div className="azure-space-lg">
                {roles.length > 0 ? (
                  <div className="azure-table-container">
                    <table className="azure-table">
                      <thead>
                        <tr>
                          <th className="text-left">#</th>
                          <th className="text-left">Role Name</th>
                          <th className="text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles.map((role, index) => (
                          <tr key={index}>
                            <td className="font-mono text-sm text-muted-foreground">
                              {String(index + 1).padStart(2, '0')}
                            </td>
                            <td className="font-medium">{role}</td>
                            <td>
                              <span className="azure-badge-success">Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center azure-space-xl">
                    <div className="w-16 h-16 mx-auto azure-mb-md bg-surface-secondary rounded-full flex items-center justify-center">
                      <Shield className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium text-card-foreground azure-mb-sm">
                      No Roles Configured
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Create your first role using the form above to get started with user management.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Azure Confirmation Modal */}
      {showModal && (
        <div className="azure-modal-overlay">
          <div className="azure-modal">
            <div className="azure-modal-header">
              <div className="flex items-center azure-gap-sm">
                <AlertTriangle className="w-6 h-6 text-warning" />
                <h3 className="text-lg font-semibold text-card-foreground">
                  Confirm Add Role
                </h3>
              </div>
            </div>
            
            <div className="azure-modal-body">
              <p className="text-muted-foreground">
                Are you sure you want to add the role <span className="font-semibold text-card-foreground">"{newRole}"</span>?
              </p>
              <div className="bg-info/10 border border-info/20 rounded-lg azure-space-sm azure-mt-md">
                <p className="text-sm text-info">
                  <strong>Note:</strong> This role will be available for assignment to users immediately after creation.
                </p>
              </div>
            </div>
            
            <div className="azure-modal-footer">
              <button
                onClick={() => setShowModal(false)}
                className="azure-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddRole}
                disabled={isConfirming}
                className="azure-btn-primary flex items-center azure-gap-sm"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoleManagerInterface;
