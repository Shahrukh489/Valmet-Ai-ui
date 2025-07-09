import { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar/NavigationBar";
import LoginPage from "../../../Pages/Login/LoginPage";

import "/node_modules/flag-icons/css/flag-icons.min.css";

function Base({ children, className, hideNavbar }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check both localStorage (remember me) and sessionStorage (session only)
    let user = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (user) {
      console.log("User exists in storage");
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);

  return (
    <div
      className={`min-h-screen w-full bg-background text-foreground ${className || ""}`}
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isAuthenticated ? (
        <>
          {/* Only render Navbar if hideNavbar is false */}
          {!hideNavbar && <NavigationBar />}

          <main
            className={`flex-1 w-full ${className || ""}`}
            style={{
              flex: "1",
              width: "100%",
              maxWidth: "100%",
              padding: 0,
              margin: 0,
            }}
          >
            {children}
          </main>
        </>
      ) : (
        <LoginPage handleIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}

export default Base;
