import { Routes, Route } from "react-router-dom";
import "/node_modules/react-toastify/dist/ReactToastify.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import Home from "./Pages/Home/Home";
import SearchPage from "./Pages/ColumnConfigurator/SearchPage";
import ShoppingCartPage from "./Pages/Cart/ShoppingCartPage";
import ItemDetailsPage from "./Pages/ItemDetails/ItemDetailsPage";

import Base from "./components/Layouts/Base/Base";
import SearchParts from "./Pages/SpareParts/SearchParts";
import PartsBook from "./Pages/ColumnConfigurator/PartsBook";
import ManagerPortal from "./Pages/PartsManager/ManagerPortalMain"
import LoginPage from "./Pages/Login/LoginPage";
import { useEffect, useState } from "react";
import PortalSidebar from "./Pages/PartsManager/PortalSidebar";
import ManagerPortalMain from "./Pages/PartsManager/ManagerPortalMain";
import PortalHome from "./Pages/PartsManager/PortalHome";
import RoleManager from "./Pages/PartsManager/SidebarPages/RoleManagement/RoleManager";
import GenerateReports from "./Pages/PartsManager/SidebarPages/GenerateReports/GenerateReports";
import BugReports from "./Pages/PartsManager/SidebarPages/BugReports/BugReports";
import AnalyticsDashboard from "./Pages/PartsManager/SidebarPages/AnalyticsDashboard/AnalyticsDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./Pages/Errors/Unauthorized";
import ReportBug from "./Pages/ReportABug/ReportBug";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Base>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<ShoppingCartPage />} />
          <Route
            // path="/itemdetails/:kitName/:partNumber"
            path="/details/:partNumber"
            element={<ItemDetailsPage />}
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/searchparts" element={<SearchParts />} />
          <Route path="/partsbook" element={<PartsBook />} />
          <Route path="/report-a-bug" element={<ReportBug />} />
          {/* Manager Portal Routes */}
          <Route path="/managerportal" element={<ManagerPortalMain />}>
            <Route index element={<PortalHome />} /> {/* Default route */}
            <Route path="analytics-page" element={<AnalyticsDashboard />} />
            <Route path="role-manager" element={<RoleManager />} />
            <Route path="generate-reports" element={<GenerateReports />} />
            <Route path="bug-reports" element={<BugReports />} />
          </Route>

          {/* Protected Routes */}
        </Routes>
      </Base>
    </ThemeProvider>
  );
}

export default App;
