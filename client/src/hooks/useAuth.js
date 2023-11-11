import { useContext } from "react";
import { UserContext } from "../provider";

export const useAuth = () => {
  const { login, logout } = useContext(UserContext);
  return { login, logout };
};
