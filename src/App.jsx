import { Routes, Route } from "react-router-dom";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import Home from "./Pages/Home/Home";
import SearchPage from "./Pages/ColumnConfigurator/SearchPage";
import ShoppingCartPage from "./Pages/Cart/ShoppingCartPage";
import ItemDetailsPage from "./Pages/ItemDetails/ItemDetailsPage";

import Base from "./components/Layouts/Base/Base";
import SearchParts from "./Pages/SpareParts/SearchParts";
import PartsBook from "./Pages/ColumnConfigurator/PartsBook";
import ManagerPortalMain from "./Pages/PartsManager/ManagerPortalMain";
import PortalHome from "./Pages/PartsManager/PortalHome";
import RoleManager from "./Pages/PartsManager/SidebarPages/RoleManagement/RoleManager";
import GenerateReports from "./Pages/PartsManager/SidebarPages/GenerateReports/GenerateReports";
import BugReports from "./Pages/PartsManager/SidebarPages/BugReports/BugReports";
import AnalyticsDashboard from "./Pages/PartsManager/SidebarPages/AnalyticsDashboard/AnalyticsDashboard";
import Settings from "./Pages/PartsManager/SidebarPages/Settings/Settings";
import PartsEditor from "./Pages/PartsManager/SidebarPages/PartsEditor/PartsEditorSimple";
import UserSettings from "./Pages/UserSettings/UserSettings";
import Unauthorized from "./Pages/Errors/Unauthorized";
import ReportBug from "./Pages/ReportABug/ReportBug";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TransitionProvider, DynamicTransition } from "./components/ui/transition-wrapper";

function App() {
  return (
    <ThemeProvider>
      <TransitionProvider>
        <Base>
          <DynamicTransition>
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
            <Route path="/user-settings" element={<UserSettings />} />
            {/* Manager Portal Routes */}
            <Route path="/managerportal" element={<ManagerPortalMain />}>
              <Route index element={<PortalHome />} /> {/* Default route */}
              <Route path="analytics-page" element={<AnalyticsDashboard />} />
              <Route path="role-manager" element={<RoleManager />} />
              <Route path="generate-reports" element={<GenerateReports />} />
              <Route path="bug-reports" element={<BugReports />} />
              <Route path="parts-editor" element={<PartsEditor />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Protected Routes */}
            </Routes>
          </DynamicTransition>
        </Base>
      </TransitionProvider>
    </ThemeProvider>
  );
}

export default App;
