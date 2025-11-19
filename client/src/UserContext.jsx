import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [points, setPoints] = useState(50); 
  const [purchasedStickers, setPurchasedStickers] = useState([]); 

  return (
    <UserContext.Provider
      value={{ points, setPoints, purchasedStickers, setPurchasedStickers }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside <UserProvider>");
  }
  return ctx;
}
