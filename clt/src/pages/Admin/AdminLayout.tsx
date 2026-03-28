import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import ThemeProvider from "../../hooks/ThemeProvider";

function AdminLayoutInner() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === "/admin") return "Dashboard";
    if (location.pathname.includes("/admin/products")) return "Products";
    if (location.pathname.includes("/admin/users")) return "Users";
    return "Admin";
  };

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: "📊", end: true },
    { to: "/admin/products", label: "Products", icon: "👶" },
    { to: "/admin/users", label: "Users", icon: "👤" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-gray-900 dark:bg-gray-950 flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#719378] to-[#a8d5b5] flex items-center justify-center text-base shrink-0">
            🐰
          </div>
          <div>
            <div className="text-white font-bold text-base tracking-tight leading-none">
              Buny
            </div>
            <div className="text-white/30 text-[10px] uppercase tracking-widest mt-0.5">
              Admin Panel
            </div>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#719378] to-[#f7c6d6] flex items-center justify-center font-bold text-xs text-white shrink-0">
            {(user?.firstName?.[0] || user?.email?.[0] || "A").toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-white text-sm font-semibold truncate">
              {user?.firstName
                ? `${user.firstName} ${user.lastName || ""}`.trim()
                : "Admin"}
            </div>
            <div className="text-white/30 text-[11px] truncate">
              {user?.email}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-3 pb-1.5 pt-1">
            Navigation
          </p>
          {navLinks.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#719378]/20 text-[#a8d5b5]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </NavLink>
          ))}

          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-3 pb-1.5 pt-4">
            Site
          </p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all w-full text-left"
          >
            <span className="text-base leading-none">🏠</span>
            View Store
          </button>
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-white/5 flex flex-col gap-0.5">
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-all w-full text-left"
          >
            <span className="text-base leading-none">
              {theme === "light" ? "🌙" : "☀️"}
            </span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <div className="h-px bg-white/5 my-1" />
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all w-full text-left"
          >
            <span className="text-base leading-none">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-14 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {getPageTitle()}
          </span>
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-[#719378] hover:border-[#719378] hover:bg-green-50 dark:hover:bg-[#719378]/10 transition-all"
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <ThemeProvider>
      <AdminLayoutInner />
    </ThemeProvider>
  );
}
