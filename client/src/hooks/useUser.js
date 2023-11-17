import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useUser = () => {
  return useContext(AuthContext);
};
