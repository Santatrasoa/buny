import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, Home, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import CartSidebar from "../Cart/CartSidebar";
import SearchOverlay from "../Search/SearchOverlay";
import buny from "../../icon/logo.png";

/* "Products" est retiré du menu principal.
   Le lien /products/:id n'est accessible qu'en cliquant sur un produit. */
const NAV_LINKS = [
  { label: "Home",    to: "/" },
  { label: "Shop",    to: "/shop" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const { count, openCart } = useCart();
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <>
      <CartSidebar />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Drawer mobile ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <nav className="w-72 bg-white shadow-2xl h-full flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <img src={buny} alt="Buny" className="h-7" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="flex flex-col gap-1 p-4 list-none m-0 flex-1">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium no-underline transition-colors ${
                      isActive(l.to)
                        ? "bg-green-50 text-[#719378] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-4 border-t border-gray-100">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 no-underline transition-colors"
              >
                <User size={18} />
                My Account
              </Link>
            </div>
          </nav>
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* ── Header principal ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">

        {/* ── Desktop ──────────────────────────────────────────── */}
        <div className="hidden md:flex items-center justify-between h-16 px-8 max-w-7xl mx-auto">
          {/* Nav gauche */}
          <nav className="flex items-center gap-6">
            <span
              className="material-icons-outlined text-sky-400"
              style={{ fontFamily: "'Material Icons Outlined'" }}
            >
              cloud
            </span>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium no-underline transition-colors ${
                  isActive(l.to)
                    ? "text-[#719378] border-b-2 border-[#719378] pb-0.5"
                    : "text-gray-600 hover:text-[#719378]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Logo centre */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <img src={buny} alt="Buny" className="h-7 w-auto" />
          </Link>

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 border-none bg-transparent cursor-pointer"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <Link
              to="/login"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            >
              <User size={20} />
            </Link>
            <button
              onClick={openCart}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 border-none bg-transparent cursor-pointer"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-0.5">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile ──────────────────────────────────────────── */}
        <div className="flex md:hidden items-center justify-between h-14 px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <img src={buny} alt="Buny" className="h-6 w-auto" />
          </Link>

          <button
            onClick={openCart}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-0.5">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Barre de navigation bas (mobile) ─────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex md:hidden">
        {[
          { icon: <Home size={20} />,         label: "Home",    to: "/" },
          { icon: <ShoppingCart size={20} />,  label: "Shop",    to: "/shop" },
          { icon: <User size={20} />,          label: "Account", to: "/login" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 no-underline transition-colors text-xs ${
              isActive(item.to)
                ? "text-[#719378]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs text-gray-500 hover:text-gray-800 border-none bg-transparent cursor-pointer"
        >
          <Search size={20} />
          <span>Search</span>
        </button>
        <button
          onClick={openCart}
          className="relative flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs text-gray-500 hover:text-gray-800 border-none bg-transparent cursor-pointer"
        >
          <ShoppingBag size={20} />
          <span>Cart</span>
          {count > 0 && (
            <span className="absolute top-1 right-4 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-bold px-0.5">
              {count}
            </span>
          )}
        </button>
        <button
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs text-gray-400 border-none bg-transparent cursor-pointer"
        >
          <Heart size={20} />
          <span>Wishlist</span>
        </button>
      </nav>
    </>
  );
}
