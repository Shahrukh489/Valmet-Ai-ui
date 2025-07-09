export const msalConfig = {
  auth: {
    clientId: "99078908-64e5-40f5-8bd3-c1ca59bcc72a", // Application (client) ID
    authority: "https://login.microsoftonline.com/65f8dbd7-eb30-4ddc-88b3-f1f6fbea6ba2", // Directory (tenant) ID
    redirectUri: window.location.origin, // Dynamic redirect URI based on current host
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"], // Add the required scopes
};

// API configuration
export const apiConfig = {
  // Client secrets should NEVER be exposed in frontend code
  // They should only exist on your backend server
  callbackUri: "https://wea-spt-use-dv-authenticationapi-001.azurewebsites.net/auth-response",
};
