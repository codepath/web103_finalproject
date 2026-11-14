import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";

const ActiveUserContext = createContext(null);

export function ActiveUserProvider({ children }) {
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api("/auth/me")
      .then((user) => {
        if (!cancelled) setActiveUser(user);
      })
      .catch((err) => {
        if (!cancelled && err.status !== 401) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    const expire = () => setActiveUser(null);
    window.addEventListener("auth-expired", expire);
    return () => {
      cancelled = true;
      window.removeEventListener("auth-expired", expire);
    };
  }, []);

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setActiveUser(null);
  }

  return (
    <ActiveUserContext.Provider value={{ activeUser, loading, error, logout }}>
      {children}
    </ActiveUserContext.Provider>
  );
}

export function useActiveUser() {
  return useContext(ActiveUserContext);
}
