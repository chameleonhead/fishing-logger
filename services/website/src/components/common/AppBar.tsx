import { useState } from "react";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import VisibleTransition from "./VisibleTransition";

type AppBarProps = {
  menuOpen: boolean;
  onMenuOpen: () => void;
  onMenuClose: () => void;
};

export const AppBar = ({ menuOpen, onMenuOpen, onMenuClose }: AppBarProps) => {
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <RouterLink to="/">
                <h1 className="text-bold text-white text-xl">Fishing Logger</h1>
              </RouterLink>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <RouterNavLink
                  to="/catches"
                  end
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                      : isActive
                      ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  }
                  aria-current="page"
                >
                  漁獲一覧
                </RouterNavLink>
                <RouterNavLink
                  to="/catches/create"
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                      : isActive
                      ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  }
                  aria-current="page"
                >
                  漁獲登録
                </RouterNavLink>
                <RouterNavLink
                  to="/ships"
                  className={({ isActive, isPending }) =>
                    isPending
                      ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                      : isActive
                      ? "bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  }
                  aria-current="page"
                >
                  船
                </RouterNavLink>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={menuOpen ? onMenuClose : onMenuOpen}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    menuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="md:hidden" id="mobile-menu">
          <VisibleTransition visible={menuOpen}>
            <div className="space-y-1 pb-3 pt-2">
              <RouterNavLink
                to="/catches"
                end
                className={({ isActive, isPending }) =>
                  isPending
                    ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                    : isActive
                    ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                }
                aria-current="page"
              >
                漁獲一覧
              </RouterNavLink>
              <RouterNavLink
                to="/catches/create"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                    : isActive
                    ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                }
                aria-current="page"
              >
                漁獲登録
              </RouterNavLink>
              <RouterNavLink
                to="/ships"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                    : isActive
                    ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                }
                aria-current="page"
              >
                船
              </RouterNavLink>
            </div>
          </VisibleTransition>
        </div>
      </div>
    </nav>
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
