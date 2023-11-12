import { Home, Profile } from "../pages";

export const protectedRoutes = [
  { path: "/home", element: <Home /> },
  { path: "/profile", element: <Profile /> },
];
