import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  Outlet,
} from "react-router-dom";
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";

type LayoutProps = {};

export const Layout = ({}: LayoutProps) => {
  return (
    <>
      <Navbar color="dark" dark>
        <NavbarBrand tag={RouterLink} to="/">
          Fishing Logger
        </NavbarBrand>
        <Nav navbar className="d-flex flex-row">
          <NavItem className="me-3">
            <RouterNavLink
              to="/catches"
              className={(isActive) => "nav-link" + (isActive ? " active" : "")}
            >
              一覧
            </RouterNavLink>
          </NavItem>
          <NavItem>
            <RouterNavLink
              to="/catches/create"
              className={(isActive) => "nav-link" + (isActive ? " active" : "")}
            >
              漁獲登録
            </RouterNavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <Outlet />
    </>
  );
};

export default Layout;
