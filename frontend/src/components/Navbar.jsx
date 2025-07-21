import { Link, useResolvedPath } from "react-router-dom";
import { CircleUserRoundIcon, ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useProductStore } from "../stores/useProductStore";
import UserSetting from "./UserSetting";

function Navbar() {
  const { products } = useProductStore();
  const { pathname } = useResolvedPath();
  const isHomePage = pathname === "/";

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b boder-base-content/10 sticky top-0 z-50">
      <div className="navbar px-4 min-h-[4rem] justify-between ">
        {/* Logo */}
        <div className="flex-1 lg:flex-none">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <ShoppingCartIcon className="size-9 text-primary" />
              <span className="font-semibold font-mono tracking-widest text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Product Store
              </span>
            </div>
          </Link>
        </div>

        {/* Right Navbar */}
        <div className="flex items-center gap-4">
          <ThemeSelector />

          {isHomePage && (
            <div className="indicator">
              <div className="p-2 rounded-full hover:bg-base-200 transition-colors">
                <ShoppingBagIcon className="size-5" />
                <span className="badge badge-sm badge-primary indicator-item">{products.length}</span>
              </div>
            </div>
          )}

          <UserSetting />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
