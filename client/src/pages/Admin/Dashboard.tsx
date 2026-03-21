import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardApi } from "../../api/api";

interface Stats {
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  users: { total: number; active: number; admins: number };
  latestProducts: {
    id: number;
    name: string;
    price: number;
    stock: number;
    category?: string;
  }[];
  latestUsers: {
    id: number;
    email: string;
    firstName?: string;
    roles: string[];
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setL] = useState(true);
  const [error, setErr] = useState("");

  useEffect(() => {
    dashboardApi
      .stats()
      .then(setStats)
      .catch(() =>
        setErr(
          "Cannot connect to backend. Make sure .NET API is running on port 8000.",
        ),
      )
      .finally(() => setL(false));
  }, []);

  const card = (label: string, value: number, bg: string, link: string) => (
    <Link key={label} to={link} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: bg,
          borderRadius: "12px",
          padding: "1.25rem",
          cursor: "pointer",
        }}
      >
        <p style={{ fontSize: "0.8rem", opacity: 0.6, marginBottom: "0.5rem" }}>
          {label}
        </p>
        <p style={{ fontSize: "2rem", fontWeight: 700 }}>{value ?? 0}</p>
      </div>
    </Link>
  );

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "3rem", opacity: 0.4 }}>
        Loading...
      </div>
    );
  if (error)
    return <div style={{ color: "red", padding: "2rem" }}>{error}</div>;

  return (
    <div>
      <h1
        style={{ fontWeight: 300, fontSize: "1.75rem", marginBottom: "0.5rem" }}
      >
        Dashboard
      </h1>
      <p style={{ opacity: 0.5, marginBottom: "2rem", fontSize: "0.875rem" }}>
        Buny Baby Store overview
      </p>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {card(
          "Total Products",
          stats!.products.total,
          "#eff6ff",
          "/admin/products",
        )}
        {card(
          "Active Products",
          stats!.products.active,
          "#f0fdf4",
          "/admin/products",
        )}
        {card(
          "Low Stock",
          stats!.products.lowStock,
          "#fff7ed",
          "/admin/products",
        )}
        {card(
          "Out of Stock",
          stats!.products.outOfStock,
          "#fef2f2",
          "/admin/products",
        )}
        {card("Total Users", stats!.users.total, "#faf5ff", "/admin/users")}
        {card("Active Users", stats!.users.active, "#ecfdf5", "/admin/users")}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Latest products */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontWeight: 500, fontSize: "1rem" }}>
              👶 Latest Products
            </h2>
            <Link
              to="/admin/products"
              style={{ fontSize: "0.8rem", color: "#f7c6d6" }}
            >
              View all
            </Link>
          </div>
          {stats?.latestProducts.map((p) => (
            <div
              key={p.id}
              style={{
                padding: "0.75rem 1.5rem",
                borderBottom: "1px solid #f9fafb",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  {p.name}
                </p>
                <p style={{ fontSize: "0.75rem", opacity: 0.4 }}>
                  {p.category || "—"}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    color: "#f7c6d6",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  ${Number(p.price).toFixed(2)}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color:
                      p.stock === 0
                        ? "#ef4444"
                        : p.stock <= 5
                          ? "#f97316"
                          : "#9ca3af",
                  }}
                >
                  Stock: {p.stock}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Latest users */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontWeight: 500, fontSize: "1rem" }}>
              👤 Latest Users
            </h2>
            <Link
              to="/admin/users"
              style={{ fontSize: "0.8rem", color: "#719378" }}
            >
              View all
            </Link>
          </div>
          {stats?.latestUsers.map((u) => (
            <div
              key={u.id}
              style={{
                padding: "0.75rem 1.5rem",
                borderBottom: "1px solid #f9fafb",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#f3e8ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#9333ea",
                  flexShrink: 0,
                }}
              >
                {(u.firstName?.[0] || u.email[0]).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {u.firstName || u.email}
                </p>
                <p style={{ fontSize: "0.75rem", opacity: 0.4 }}>{u.email}</p>
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  background: u.roles?.includes("ROLE_ADMIN")
                    ? "#f3e8ff"
                    : "#f3f4f6",
                  color: u.roles?.includes("ROLE_ADMIN")
                    ? "#9333ea"
                    : "#6b7280",
                }}
              >
                {u.roles?.includes("ROLE_ADMIN") ? "Admin" : "User"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ fontWeight: 500, marginBottom: "1rem" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link to="/admin/products/new">
            <button className="button" style={{ fontSize: "0.875rem" }}>
              + New Product
            </button>
          </Link>
          <Link to="/admin/users/new">
            <button
              className="button"
              style={{ fontSize: "0.875rem", background: "#6b7280" }}
            >
              + New User
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
