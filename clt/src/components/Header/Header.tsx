import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import CartSidebar from "../Cart/CartSidebar";
import SearchOverlay from "../Search/SearchOverlay";
import { Search, ShoppingBag, User } from "lucide-react";
import buny from "../../icon/logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Products", to: "/products" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, openCart } = useCart();
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      {/* ── Sidebar panier ────────────────────────────────────── */}
      <CartSidebar />

      {/* ── Recherche ─────────────────────────────────────────── */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Navigation mobile (drawer) ────────────────────────── */}
      <div className={mobileOpen ? "fixed inset-0 z-40 flex" : "hidden"}>
        <div className="w-64 bg-white shadow-xl h-full p-6">
          <div className="flex justify-end">
            <button
              className="material-icons-outlined text-2xl text-gray-600 hover:text-gray-800"
              id="cancel"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              close
            </button>
          </div>

          <ul className="mt-6 space-y-4 text-base">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="block text-gray-700 hover:text-sky-600"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="flex-1 bg-black bg-opacity-50"
          onClick={() => setMobileOpen(false)}
        />
      </div>

      {/* ── Header principal ──────────────────────────────────── */}
      <header>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center justify-between py-4 px-6">
          <ul className="flex items-center space-x-6 text-sm">
            <span className="material-icons-outlined text-2xl text-sky-500">
              cloud
            </span>
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={
                    isActive(l.to)
                      ? "text-sky-600 font-semibold"
                      : "text-gray-700 hover:text-sky-600"
                  }
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="shrink-0">
            <Link to="/">
              <img src={buny} width={100} height={26} alt="Buny" />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Search
              className="cursor-pointer"
              onClick={() => setSearchOpen(true)}
            />
            <Link to="/login">
              <User className="cursor-pointer" />
            </Link>
            <div className="relative inline-block">
              <ShoppingBag className="cursor-pointer" onClick={openCart} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5">
                  {count}
                </span>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile nav bar */}
        <nav className="flex md:hidden items-center justify-between p-3">
          <div>
            <img
              className="h-6 w-6 cursor-pointer"
              id="menu"
              src="/icon/menu.png"
              alt="menu"
              onClick={() => setMobileOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <img className="h-6" src="/icon/logo.png" alt="Buny" />
            </Link>
          </div>
          <div>
            <img
              className="h-6 w-6 cursor-pointer"
              src="/icon/shopping-bag.png"
              alt="cart"
              onClick={openCart}
            />
          </div>
        </nav>

        {/* Mobile bottom menu */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2 md:hidden">
          <div className="flex flex-col items-center text-xs text-gray-700">
            <img className="h-6 w-6" src="/icon/collection.png" alt="" />
            <Link to="/shop">Shop</Link>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-700">
            <img className="h-6 w-6" src="/icon/user.png" alt="" />
            <Link to="/login">Account</Link>
          </div>
          <div
            className="flex flex-col items-center text-xs text-gray-700 cursor-pointer"
            onClick={() => setSearchOpen(true)}
          >
            <img className="h-6 w-6" src="/icon/magnifying-glass.png" alt="" />
            <span>Search</span>
          </div>
          <div className="flex flex-col items-center text-xs text-gray-700">
            <img className="h-6 w-6" src="/icon/heart.png" alt="" />
            <a href="#">Wishlist</a>
          </div>
        </div>
      </header>
    </>
  );
}
