import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUser } from "../api";

/**
 * User could be null, best to check with isLoading before rendering
 */
export const useUser = () => {
  const { userId, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) return;
        const user = await getUser(userId);
        setUser(user);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  return { user, isLoading, logout };
};
