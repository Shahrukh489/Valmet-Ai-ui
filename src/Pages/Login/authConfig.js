export const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID", // Replace with your app's client ID from Azure
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // Replace with your tenant ID
    redirectUri: "http://localhost:3000", // Your app's redirect URI
  },
};
export const loginRequest = {
  scopes: ["User.Read"], // Add the required scopes
};
