import { useEffect, useState, useCallback } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { userApi } from "../../api/api";
import type { User } from "../../types";

/* ── Liste ─────────────────────────────────────────────────────────────────── */
export function AdminUsers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const load = useCallback(() => {
    setLoading(true);
    const p: Record<string, unknown> = { page, limit: 10 };
    if (search) p.search = search;
    userApi
      .list(p)
      .then((r) => {
        setUsers(r.data ?? []);
        setTotal(r.total ?? 0);
      })
      .catch(() => showToast("Error loading"))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: number) => {
    try {
      await userApi.delete(id);
      showToast("User deleted");
      setConfirmId(null);
      load();
    } catch {
      showToast("Error deleting");
    }
  };

  const setFilter = (k: string, v: string) => {
    const p = new URLSearchParams(searchParams);
    if (v) p.set(k, v);
    else p.delete(k);
    p.delete("page");
    setSearchParams(p);
  };

  const tdStyle = {
    padding: "0.75rem 1rem",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "0.875rem",
  };

  return (
    <div>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            background: "#f7c6d6",
            color: "#fff",
            padding: "0.75rem 1.25rem",
            borderRadius: "999px",
            zIndex: 9999,
            fontSize: "0.875rem",
          }}
        >
          {toast}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ fontWeight: 300, fontSize: "1.75rem" }}>Users</h1>
          <p style={{ opacity: 0.5, fontSize: "0.875rem" }}>
            {total} user{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link to="/admin/users/new">
          <button className="button" style={{ fontSize: "0.875rem" }}>
            + New User
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setFilter("search", e.target.value)}
        style={{
          padding: "0.65rem 1rem",
          border: "1px solid #d1d5db",
          borderRadius: "999px",
          marginBottom: "1.5rem",
          fontSize: "0.875rem",
          outline: "none",
          width: "280px",
        }}
      />

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", opacity: 0.4 }}>
            Loading...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", opacity: 0.4 }}>
            No users found
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  color: "#6b7280",
                }}
              >
                <th style={{ ...tdStyle, textAlign: "left" }}>User</th>
                <th style={{ ...tdStyle, textAlign: "left" }}>Phone</th>
                <th style={{ ...tdStyle, textAlign: "center" }}>Role</th>
                <th style={{ ...tdStyle, textAlign: "center" }}>Status</th>
                <th style={{ ...tdStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background: u.roles?.includes("ROLE_ADMIN")
                            ? "#f3e8ff"
                            : "#f0fdf4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          color: u.roles?.includes("ROLE_ADMIN")
                            ? "#9333ea"
                            : "#16a34a",
                          flexShrink: 0,
                        }}
                      >
                        {(u.firstName?.[0] || u.email[0]).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 500 }}>
                          {u.firstName
                            ? `${u.firstName} ${u.lastName || ""}`.trim()
                            : u.email}
                        </p>
                        <p style={{ fontSize: "0.75rem", opacity: 0.4 }}>
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, opacity: 0.5 }}>{u.phone || "—"}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
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
                      {u.roles?.includes("ROLE_ADMIN") ? "👑 Admin" : "User"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        background: u.active ? "#f0fdf4" : "#f3f4f6",
                        color: u.active ? "#16a34a" : "#6b7280",
                      }}
                    >
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Link to={`/admin/users/${u.id}/edit`}>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                          }}
                        >
                          ✏️
                        </button>
                      </Link>
                      {confirmId === u.id ? (
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <button
                            onClick={() => handleDelete(u.id)}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "6px",
                              padding: "0.25rem 0.5rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            style={{
                              background: "#f3f4f6",
                              border: "none",
                              borderRadius: "6px",
                              padding: "0.25rem 0.5rem",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(u.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── Formulaire ────────────────────────────────────────────────────────────── */
export function AdminUserForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
    active: true,
  });
  const [loading, setL] = useState(false);
  const [fetching, setF] = useState(isEdit);
  const [error, setErr] = useState("");
  const [showPwd, setSP] = useState(false);

  const inp = {
    border: "1px solid #d1d5db",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
  };

  useEffect(() => {
    if (!isEdit) return;
    userApi
      .get(Number(id))
      .then((u) =>
        setForm({
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email,
          phone: u.phone || "",
          password: "",
          isAdmin: u.roles?.includes("ROLE_ADMIN") ?? false,
          active: u.active,
        }),
      )
      .catch(() => setErr("User not found"))
      .finally(() => setF(false));
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) {
      setErr("Email is required");
      return;
    }
    if (!isEdit && !form.password) {
      setErr("Password is required");
      return;
    }
    if (form.password && form.password.length < 6) {
      setErr("Password min. 6 characters");
      return;
    }

    setL(true);
    setErr("");
    const payload: Record<string, unknown> = {
      email: form.email,
      firstName: form.firstName || null,
      lastName: form.lastName || null,
      phone: form.phone || null,
      roles: form.isAdmin ? ["ROLE_USER", "ROLE_ADMIN"] : ["ROLE_USER"],
      active: form.active,
    };
    if (form.password) payload.password = form.password;

    try {
      if (isEdit) await userApi.update(Number(id), payload);
      else await userApi.create(payload);
      navigate("/admin/users");
    } catch (err: unknown) {
      setErr(typeof err === "string" ? err : "Save failed");
    } finally {
      setL(false);
    }
  };

  if (fetching)
    return (
      <div style={{ padding: "3rem", textAlign: "center", opacity: 0.4 }}>
        Loading...
      </div>
    );

  return (
    <div style={{ maxWidth: "600px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Link to="/admin/users" style={{ opacity: 0.5, fontSize: "0.875rem" }}>
          ← Users
        </Link>
        <h1 style={{ fontWeight: 300, fontSize: "1.75rem" }}>
          {isEdit ? "Edit User" : "New User"}
        </h1>
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem", fontSize: "0.875rem" }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
                fontWeight: 500,
              }}
            >
              First Name
            </label>
            <input
              style={inp}
              type="text"
              placeholder="First name"
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
                fontWeight: 500,
              }}
            >
              Last Name
            </label>
            <input
              style={inp}
              type="text"
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
            />
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
              fontWeight: 500,
            }}
          >
            Email *
          </label>
          <input
            style={inp}
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
              fontWeight: 500,
            }}
          >
            Phone
          </label>
          <input
            style={inp}
            type="tel"
            placeholder="+261 34 ..."
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
              fontWeight: 500,
            }}
          >
            Password{" "}
            {isEdit && (
              <span style={{ opacity: 0.4, fontWeight: 400 }}>
                (leave empty = unchanged)
              </span>
            )}
            {!isEdit && " *"}
          </label>
          <div style={{ position: "relative" }}>
            <input
              style={{ ...inp, paddingRight: "3rem" }}
              type={showPwd ? "text" : "password"}
              placeholder={isEdit ? "••••••••" : "Min. 6 characters"}
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={() => setSP((v) => !v)}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              {showPwd ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Toggle Admin */}
        <div
          style={{
            background: "#faf5ff",
            border: "1px solid #e9d5ff",
            borderRadius: "10px",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, isAdmin: !f.isAdmin }))}
            style={{
              width: "44px",
              height: "24px",
              borderRadius: "999px",
              border: "none",
              background: form.isAdmin ? "#9333ea" : "#d1d5db",
              cursor: "pointer",
              position: "relative",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "2px",
                left: form.isAdmin ? "22px" : "2px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </button>
          <div>
            <p
              style={{
                fontWeight: 500,
                color: "#7e22ce",
                fontSize: "0.875rem",
              }}
            >
              Administrator
            </p>
            <p style={{ fontSize: "0.75rem", color: "#9333ea", opacity: 0.7 }}>
              Access to admin panel
            </p>
          </div>
        </div>

        {/* Toggle Active */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
            style={{
              width: "44px",
              height: "24px",
              borderRadius: "999px",
              border: "none",
              background: form.active ? "#f7c6d6" : "#d1d5db",
              cursor: "pointer",
              position: "relative",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "2px",
                left: form.active ? "22px" : "2px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </button>
          <span style={{ fontSize: "0.875rem" }}>
            {form.active ? "Active account" : "Deactivated account"}
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            style={{
              flex: 1,
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "#fff",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="button"
            style={{ flex: 1, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
