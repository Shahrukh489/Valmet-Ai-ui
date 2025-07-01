import React, { createContext, useState, useEffect, useContext } from "react";
import { parseJwt } from "../components/utils/tokenUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true); // helpful loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user"));

    const fetchUserRoles = async (userId, token) => {
      try {
        const response = await fetch(
          "https://wea-spt-use-dv-authenticationapi-001.azurewebsites.net/api/auth/GetUserRoleID",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID: userId }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch roles (Status ${response.status})`);
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

    if (storedData && storedData.token) {
      const payload = parseJwt(storedData.token);

      if (payload) {
        const currentUser = {
          id: storedData.user.id,
          email: storedData.user.email,
          name: storedData.user.name,
          phone: storedData.user.phonenumber,
          token: storedData.token,
        };

        setUser(currentUser);
        fetchUserRoles(currentUser.id, currentUser.token);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, roles, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
