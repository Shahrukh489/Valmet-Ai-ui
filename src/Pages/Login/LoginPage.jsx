import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";

const AuthApiBaseUrl = import.meta.env.VITE_AUTHENTICATIONAPI_BASE_URL;

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user chose to be remembered
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMicrosoftLogin = async () => {
    setIsMicrosoftLoading(true);
    try {
      // Initialize MSAL
      await msalInstance.initialize();
      
      // Attempt to sign in with popup
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      
      if (loginResponse && loginResponse.account) {
        // Get the user's account information
        const account = loginResponse.account;
        
        // Create user object similar to your existing auth flow
        const user = {
          username: account.username,
          name: account.name,
          email: account.username, // username is typically the email in Azure AD
          idToken: loginResponse.idToken,
          accessToken: loginResponse.accessToken,
          homeAccountId: account.homeAccountId,
          localAccountId: account.localAccountId,
        };
        
        // Store based on remember me preference
        if (rememberMe) {
          localStorage.setItem("msalUser", JSON.stringify(user));
          localStorage.setItem("msalAccount", JSON.stringify(account));
        } else {
          sessionStorage.setItem("msalUser", JSON.stringify(user));
          sessionStorage.setItem("msalAccount", JSON.stringify(account));
        }
        
        // If you have a backend API that needs to validate the token
        if (AuthApiBaseUrl) {
          try {
            const response = await fetch(`${AuthApiBaseUrl}/api/auth/microsoft`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                idToken: loginResponse.idToken,
                accessToken: loginResponse.accessToken,
                account: account
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              localStorage.setItem("user", JSON.stringify(data.result));
            }
          } catch (apiError) {
            console.log("Backend validation skipped:", apiError);
            // Continue with frontend-only auth if backend is not available
          }
        }
        
        // Update authentication state and navigate
        props.handleIsAuthenticated(true);
        navigate("/search");
      }
    } catch (error) {
      console.error("Microsoft login failed:", error);
      
      // Handle specific MSAL errors
      if (error.errorCode === "popup_window_error") {
        setErrors({ general: "Pop-up blocked. Please allow pop-ups for this site and try again." });
      } else if (error.errorCode === "user_cancelled") {
        setErrors({ general: "Login cancelled." });
      } else {
        setErrors({ general: "Microsoft login failed. Please try again." });
      }
    } finally {
      setIsMicrosoftLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const credentials = { email, password };

    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch(`${AuthApiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        setErrors({ general: "Invalid email or password" });
        return;
      }

      const data = await response.json();
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        // Store auth data in localStorage (persists after browser close)
        localStorage.setItem("user", JSON.stringify(data.result));
      } else {
        // Clear remembered email if unchecked
        localStorage.removeItem("rememberedEmail");
        // Store auth data in sessionStorage (clears when browser closes)
        sessionStorage.setItem("user", JSON.stringify(data.result));
      }
      
      props.handleIsAuthenticated(true);
      navigate("/search");
    } catch (error) {
      console.error("Error:", error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full mx-4">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <img 
            src="/Valmet.png" 
            alt="Valmet" 
            className="h-12 mx-auto mb-8"
          />
          <h1 className="text-2xl font-semibold text-white">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 shadow-xl rounded-lg p-8 border border-gray-700">
          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-md">
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md bg-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-md bg-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Microsoft Login Button */}
            <button
              type="button"
              onClick={handleMicrosoftLogin}
              disabled={isMicrosoftLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isMicrosoftLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="0.5" y="0.5" width="9" height="9" fill="#F25022"/>
                    <rect x="11.5" y="0.5" width="9" height="9" fill="#7FBA00"/>
                    <rect x="0.5" y="11.5" width="9" height="9" fill="#00A4EF"/>
                    <rect x="11.5" y="11.5" width="9" height="9" fill="#FFB900"/>
                  </svg>
                  Sign in with Microsoft
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
            Contact administrator
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;