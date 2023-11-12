import { Navbar } from "./Navbar";

export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col font-caveat h-screen">
      <Navbar />
      <div className="flex-grow">{children}</div>
    </div>
  );
};
