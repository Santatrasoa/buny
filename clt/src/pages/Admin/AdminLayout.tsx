import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          background: "#2d2d2d",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <img
            src="/icon/logo.png"
            alt="Buny"
            style={{ width: "80px", filter: "brightness(0) invert(1)" }}
          />
          <p
            style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "0.25rem" }}
          >
            Administration
          </p>
        </div>

        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>
            {user?.firstName || user?.email}
          </p>
          <p style={{ fontSize: "0.75rem", opacity: 0.4 }}>{user?.email}</p>
        </div>

        <nav style={{ flex: 1, padding: "1rem" }}>
          {[
            { to: "/admin", label: "📊 Dashboard", end: true },
            { to: "/admin/products", label: "👶 Products" },
            { to: "/admin/users", label: "👤 Users" },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                marginBottom: "0.25rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "0.875rem",
                background: isActive ? "#f7c6d6" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              display: "block",
              width: "100%",
              padding: "0.75rem",
              marginBottom: "0.25rem",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              textAlign: "left",
              borderRadius: "8px",
              fontSize: "0.875rem",
            }}
          >
            🏠 View Site
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: "block",
              width: "100%",
              padding: "0.75rem",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              textAlign: "left",
              borderRadius: "8px",
              fontSize: "0.875rem",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Contenu */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            padding: "1rem 2rem",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          Admin Panel — Buny Baby Store
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
