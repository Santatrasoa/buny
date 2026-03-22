import { useEffect, useState, useCallback } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
  useParams,
} from "react-router-dom";
import { productApi } from "../../api/api";
import type { Product } from "../../types";

/* ── Liste ─────────────────────────────────────────────────────────────────── */
export function AdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
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
    productApi
      .list(p)
      .then((r) => {
        setProducts(r.data ?? []);
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
      await productApi.delete(id);
      showToast("Deleted");
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
          <h1 style={{ fontWeight: 300, fontSize: "1.75rem" }}>Products</h1>
          <p style={{ opacity: 0.5, fontSize: "0.875rem" }}>{total} products</p>
        </div>
        <Link to="/admin/products/new">
          <button className="button" style={{ fontSize: "0.875rem" }}>
            + New Product
          </button>
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
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

      {/* Table */}
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
        ) : products.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", opacity: 0.4 }}>
            No products found
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
                <th style={{ ...tdStyle, textAlign: "left" }}>Product</th>
                <th style={{ ...tdStyle, textAlign: "left" }}>Category</th>
                <th style={{ ...tdStyle, textAlign: "right" }}>Price</th>
                <th style={{ ...tdStyle, textAlign: "right" }}>Stock</th>
                <th style={{ ...tdStyle, textAlign: "center" }}>Status</th>
                <th style={{ ...tdStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ cursor: "default" }}>
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
                          width: "36px",
                          height: "36px",
                          background: "#f3f4f6",
                          borderRadius: "8px",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {p.image ? (
                          <img
                            src={p.image}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          "👶"
                        )}
                      </div>
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, opacity: 0.5 }}>
                    {p.category || "—"}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      color: "#f7c6d6",
                      fontWeight: 700,
                    }}
                  >
                    ${Number(p.price).toFixed(2)}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      color:
                        p.stock === 0
                          ? "#ef4444"
                          : p.stock <= 5
                            ? "#f97316"
                            : "inherit",
                    }}
                  >
                    {p.stock}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        background: p.active ? "#f0fdf4" : "#f3f4f6",
                        color: p.active ? "#16a34a" : "#6b7280",
                      }}
                    >
                      {p.active ? "Active" : "Inactive"}
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
                      <Link to={`/admin/products/${p.id}/edit`}>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#f7c6d6",
                            fontSize: "1rem",
                          }}
                        >
                          ✏️
                        </button>
                      </Link>
                      {confirmId === p.id ? (
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          <button
                            onClick={() => handleDelete(p.id)}
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
                          onClick={() => setConfirmId(p.id)}
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
export function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    image: "",
    category: "Baby",
    active: true,
  });
  const [loading, setL] = useState(false);
  const [fetching, setF] = useState(isEdit);
  const [error, setErr] = useState("");

  const CATS = ["Baby", "Boys", "Girls", "Toys"];
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
    productApi
      .get(Number(id))
      .then((p) =>
        setForm({
          name: p.name,
          description: p.description || "",
          price: String(p.price),
          stock: String(p.stock),
          image: p.image || "",
          category: p.category || "Baby",
          active: p.active,
        }),
      )
      .catch(() => setErr("Product not found"))
      .finally(() => setF(false));
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErr("Name is required");
      return;
    }
    setL(true);
    setErr("");
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image || null,
        category: form.category,
        active: form.active,
      };
      if (isEdit) await productApi.update(Number(id), payload);
      else await productApi.create(payload);
      navigate("/admin/products");
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
        <Link
          to="/admin/products"
          style={{ opacity: 0.5, fontSize: "0.875rem" }}
        >
          ← Products
        </Link>
        <h1 style={{ fontWeight: 300, fontSize: "1.75rem" }}>
          {isEdit ? "Edit Product" : "New Product"}
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
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
              fontWeight: 500,
            }}
          >
            Product Name *
          </label>
          <input
            style={inp}
            type="text"
            placeholder="e.g. Baby Romper Set"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
            Description
          </label>
          <textarea
            style={{ ...inp, resize: "none" }}
            rows={3}
            placeholder="Product description..."
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>

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
              Price ($) *
            </label>
            <input
              style={inp}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
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
              Stock
            </label>
            <input
              style={inp}
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock: e.target.value }))
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
            Category
          </label>
          <select
            style={inp}
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          >
            {CATS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
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
            Image URL
          </label>
          <input
            style={inp}
            type="url"
            placeholder="https://..."
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          />
          {form.image && (
            <img
              src={form.image}
              style={{
                marginTop: "0.5rem",
                height: "80px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>

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
            {form.active ? "Active (visible in shop)" : "Inactive (hidden)"}
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
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
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
