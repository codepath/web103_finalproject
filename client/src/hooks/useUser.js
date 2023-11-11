import { useContext } from "react";
import { UserContext } from "../provider";

export const useUser = () => {
  const { user, setUser } = useContext(UserContext);
  return { user, setUser };
};
