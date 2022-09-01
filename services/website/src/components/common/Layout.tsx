import { Outlet } from "react-router-dom";
import { Navbar, NavbarBrand } from "reactstrap";

type LayoutProps = {};

export const Layout = ({}: LayoutProps) => {
  return (
    <>
      <Navbar color="dark" dark>
        <NavbarBrand href="/">Fishing Logger</NavbarBrand>
      </Navbar>
      <Outlet />
    </>
  );
};

export default Layout;
