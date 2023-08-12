import { useState } from "react";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import {
  Collapse,
  IconButton,
  Navbar,
  Typography,
} from "@material-tailwind/react";

type AppBarProps = {
  menuOpen: boolean;
  onMenuOpen: () => void;
  onMenuClose: () => void;
};

const NavItem = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive, isPending }) =>
        isPending
          ? "block py-1 px-3 rounded-md cursor-pointer transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none bg-blue-gray-50 bg-opacity-80 text-blue-gray-900"
          : isActive
          ? "block py-1 px-3 rounded-md cursor-pointer transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none bg-blue-gray-50 bg-opacity-80 text-blue-gray-900"
          : "block py-1 px-3 rounded-md cursor-pointer transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none"
      }
    >
      <Typography as="span" className="font-medium">
        {children}
      </Typography>
    </RouterNavLink>
  );
};

export const AppBar = ({ menuOpen, onMenuOpen, onMenuClose }: AppBarProps) => {
  const navList = (
    <div className="mb-4 mt-2 flex flex-col gap-2 md:mb-0 md:mt-0 md:flex-row md:items-center md:gap-6">
      <NavItem to="/catches">漁獲</NavItem>
      <NavItem to="/ships">船</NavItem>
    </div>
  );
  return (
    <Navbar variant="filled" fullWidth className="bg-blue-500">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 flex items-center justify-between md:justify-start text-white">
        <Typography
          as={RouterLink}
          to="/"
          className="cursor-pointer py-1.5 text-lg font-bold"
        >
          Fishing Logger
        </Typography>
        <div className="hidden md:block ml-9">{navList}</div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent md:hidden"
          ripple={false}
          onClick={() => (menuOpen ? onMenuClose() : onMenuOpen())}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <div className="md:hidden">
        <Collapse open={menuOpen} className="sm:px-6 lg:px-8">
          {navList}
        </Collapse>
      </div>
    </Navbar>
  );
};

export const AppBarWithState = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <AppBar
      menuOpen={menuOpen}
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
    />
  );
};

export default AppBarWithState;
