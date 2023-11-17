import { useEffect, useState } from "react";
import { AuthContext } from "../context";
import { getUser, logout as fetchLogout } from "../api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    const data = await fetchLogout();
    if (data.status) {
      setUser(null);
    }
  };

  const fetchUser = async () => {
    try {
      const data = await getUser();
      setUser(data);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
