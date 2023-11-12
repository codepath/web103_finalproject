import { useEffect, useState } from "react";
import { AuthContext } from "../context";
import { getUserId, logout as fetchLogout } from "../api";

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const logout = async () => {
    const data = await fetchLogout();
    if (data.success) {
      setUserId(null);
    }
  };

  const fetchUserId = async () => {
    const data = await getUserId();
    if (data.success) {
      setUserId(data.user_id);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  return (
    <AuthContext.Provider value={{ logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};
