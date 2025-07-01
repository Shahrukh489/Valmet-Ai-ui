import React, { useState, useEffect } from "react";
import { Loader2, Edit, AlertCircle } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { TableRow, TableCell } from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";

function UserTableRow({ item, handleEditRoleClick }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(
          "https://wea-spt-use-dv-authenticationapi-001.azurewebsites.net/api/auth/GetUserRoleID",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID: item.id }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const rolesData = await response.json();
        setRoles(rolesData.result);
      } catch (err) {
        setError(err.message);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [item.id]);

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {item.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <span>{item.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{item.email}</TableCell>
      <TableCell>
        {loading && (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center space-x-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Error loading roles</span>
          </div>
        )}
        {!loading && !error && (
          <div className="flex flex-wrap gap-1">
            {roles.length ? (
              roles.map((role, index) => (
                <Badge key={index} variant="secondary">
                  {role}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">Not Assigned</Badge>
            )}
          </div>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEditRoleClick(item)}
          className="flex items-center space-x-1"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Role</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default UserTableRow;
