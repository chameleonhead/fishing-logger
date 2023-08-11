import AppBar from "./AppBar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="min-h-full">
      <AppBar />
      <Outlet />
    </div>
  );
};

export default Layout;
