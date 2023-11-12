import { API_URL } from "../config";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (data.success) {
      setUser(null);
    }
  };

  const fetchUser = async () => {
    const response = await fetch(`${API_URL}/auth/login/success`, {
      method: "GET",
      credentials: "include",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });
    const data = await response.json();
    if (data.success) {
      setUser(data.user);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ logout, user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
