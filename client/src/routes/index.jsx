import { useRoutes } from "react-router-dom";
import { Landing } from "../pages";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";
import { useUser } from "../hooks";

export const AppRoutes = () => {
  const { user, isLoading } = useUser();
  const commonRoutes = [{ path: "/", element: <Landing /> }];

  const routes = user ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  if (isLoading) {
    return null;
  }

  return <>{element}</>;
};
