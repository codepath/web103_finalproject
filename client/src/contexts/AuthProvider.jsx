import { useEffect, useState } from "react";
import AuthContext from "./AuthContext.js";
import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogin = async () => {
    // Made async to await the popup result
    try {
      const result = await signInWithPopup(auth, provider); // Use signInWithPopup
      // The user object is in result.user
      const signedInUser = result.user;
      // You can also get credentials if needed, e.g., result.credential.accessToken
      console.log("Popup sign-in successful! User:", signedInUser);
      // The onAuthStateChanged listener will also fire and update your user state
    } catch (error) {
      console.error("Error during popup sign-in: ", error);
      if (error.code) console.error("Error Code:", error.code);
      if (error.message) console.error("Error Message:", error.message);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // This listener handles all auth state changes, including after a successful popup sign-in
      setUser(currentUser);
      setLoading(false);
      console.log("onAuthStateChanged: ", currentUser);
    });

    return () => unsubscribe(); // Clean up the listener on unmount

  }, []);


  
  return (
    <AuthContext.Provider value={{handleLogin, handleLogout, user, loading}}>
        {children}
    </AuthContext.Provider>
  );
}
