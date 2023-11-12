import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </AuthProvider>
  );
};
