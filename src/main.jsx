import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import "./index.css";

// Import i18n configuration
import "./i18n/i18n.js";


import App from "./App.jsx";
import store from "./Redux/store.js";
import { Provider } from "react-redux";

// Context providers
import { AuthProvider } from "./contexts/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);
