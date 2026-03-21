import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import CartSidebar from "../Cart/CartSidebar";
import SearchOverlay from "../Search/SearchOverlay";
import { Search, ShoppingBag, User } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Products", to: "/products" },
  { label: "Page", to: "/contact" },
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
      <div className={`second-nav ${mobileOpen ? "open" : ""}`}>
        <div className="list-nav-secondary">
          <div className="container-cancel">
            <div>
              <span
                className="material-icons-outlined logo-cancel"
                id="cancel"
                onClick={() => setMobileOpen(false)}
              >
                close
              </span>
            </div>
          </div>
          <ul className="container-list-nav">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="opacity" onClick={() => setMobileOpen(false)} />
      </div>

      {/* ── Header principal ──────────────────────────────────── */}
      <header>
        {/* Desktop nav */}
        <nav className="nav">
          <ul className="list-nav align-front">
            <span className="material-icons-outlined logo-home">cloud</span>
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}>
                <li className={isActive(l.to) ? "active" : ""}>{l.label}</li>
              </Link>
            ))}
          </ul>

          <div className="list-nav">
            <Link to="/">
              <img src="../../icon/logo.png" alt="Buny" />
            </Link>
          </div>

          <div className="list-nav align-back">
            <Search onClick={() => setSearchOpen(true)} />
            <Link to="/login">
              <User />
            </Link>
            <div style={{ position: "relative", display: "inline-block" }}>
              <ShoppingBag onClick={openCart} />
              {count > 0 && <span className="span">{count}</span>}
            </div>
          </div>
        </nav>

        {/* Mobile nav bar */}
        <nav className="responsive-nav">
          <div className="menu">
            <img
              className="logo-header"
              id="menu"
              src="/icon/menu.png"
              alt="menu"
              onClick={() => setMobileOpen(true)}
            />
          </div>
          <div className="menu">
            <Link to="/">
              <img src="/icon/logo.png" alt="Buny" />
            </Link>
          </div>
          <div className="menu">
            <img
              className="logo-header s-s"
              src="/icon/shopping-bag.png"
              alt="cart"
              onClick={openCart}
            />
          </div>
        </nav>

        {/* Mobile bottom menu */}
        <div className="container-menu">
          <div>
            <img className="logo-header" src="/icon/collection.png" alt="" />
            <span>
              <Link to="/shop">Shop</Link>
            </span>
          </div>
          <div>
            <img className="logo-header" src="/icon/user.png" alt="" />
            <span>
              <Link to="/login">Account</Link>
            </span>
          </div>
          <div className="s-p" onClick={() => setSearchOpen(true)}>
            <img
              className="logo-header"
              src="/icon/magnifying-glass.png"
              alt=""
            />
            <span>Search</span>
          </div>
          <div>
            <img className="logo-header" src="/icon/heart.png" alt="" />
            <span>
              <a href="#">Wishlist</a>
            </span>
          </div>
        </div>
      </header>
    </>
  );
}
