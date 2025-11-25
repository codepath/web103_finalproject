import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user data from your 'user' table
  const loadUserData = async (authUserId) => {
    try {
      // First check if user exists in 'user' table
      const { data: userData, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", authUserId)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist in user table yet, create them
        const { data: authUser } = await supabase.auth.getUser();
        const { data: newUser, error: insertError } = await supabase
          .from("user")
          .insert([{
            id: authUserId,
            username: authUser.user.email.split('@')[0], // Default username from email
            display_name: null,
            pfp: null,
            bio: null,
            borough: null,
            year: null,
            interests: {},
            follows_ids: {},
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        
        setUser(newUser);
        setIsAuthenticated(true);
      } else if (error) {
        throw error;
      } else {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // User will be loaded via onAuthStateChange listener
  };

  // Signup function
  const signup = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    
    // Create user in 'user' table
    if (data.user) {
      await supabase.from("user").insert([{
        id: data.user.id,
        username: username || email.split('@')[0],
        display_name: null,
        pfp: null,
        bio: null,
        borough: null,
        year: null,
        interests: {},
        follows_ids: {},
      }]);
    }
    
    return data;
  };

  // Logout function
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
