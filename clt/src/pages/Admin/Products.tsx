import { useEffect, useState, useCallback } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
  useParams,
} from "react-router-dom";
import { productApi } from "../../api/api";
import type { Product } from "../../types";

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
    // Defer load to avoid synchronous setState inside the effect
    const id = setTimeout(() => {
      load();
    }, 0);

    return () => clearTimeout(id);
  }, [load]);

  const handleDelete = async (id: number) => {
    try {
      await productApi.delete(id);
      showToast("Product deleted");
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

  return (
    <div>
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-[slideIn_0.2s_ease]">
          {toast}
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {total} products total
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#719378] text-white text-sm font-semibold hover:opacity-90 transition-opacity no-underline"
        >
          + New Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative inline-block mb-5">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className="pl-9 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/20 w-64 placeholder-gray-400 transition-all"
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setFilter("search", e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-[#719378] rounded-full animate-spin" />{" "}
            Loading…
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <span className="text-4xl mb-2">📦</span>
            <p className="font-medium">No products found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-800 ${
                        i === 0
                          ? "text-left"
                          : i >= 2
                            ? "text-right"
                            : "text-left"
                      } ${i === 4 ? "text-center" : ""} ${i === 5 ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center shrink-0 text-lg">
                          {p.image ? (
                            <img
                              src={p.image}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "👶"
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.category ? (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          {p.category}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-[#719378]">
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          p.stock === 0
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            : p.stock <= 5
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.active
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {p.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          ✏️
                        </Link>
                        {confirmId === p.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-colors border-none cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-colors border-none cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmId(p.id)}
                            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-colors cursor-pointer"
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
          </div>
        )}
      </div>
    </div>
  );
}

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

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-[#719378] focus:ring-2 focus:ring-[#719378]/20 transition-all placeholder-gray-400 font-[inherit]";

  if (fetching)
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-gray-400 text-sm">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-[#719378] rounded-full animate-spin" />{" "}
        Loading…
      </div>
    );

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/products"
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors no-underline"
        >
          ← Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {isEdit ? "Edit Product" : "New Product"}
        </h1>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm mb-4">
          ⚠️ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Product Name *
          </label>
          <input
            className={inputCls}
            type="text"
            placeholder="e.g. Baby Romper Set"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Description
          </label>
          <textarea
            className={inputCls}
            rows={3}
            style={{ resize: "none" }}
            placeholder="Product description…"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Price ($) *
            </label>
            <input
              className={inputCls}
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Stock
            </label>
            <input
              className={inputCls}
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Category
          </label>
          <select
            className={inputCls}
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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Image URL
          </label>
          <input
            className={inputCls}
            type="url"
            placeholder="https://…"
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          />
          {form.image && (
            <img
              src={form.image}
              className="mt-1 h-18 rounded-lg object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
            className={`w-11 h-6 rounded-full border-none cursor-pointer relative transition-colors duration-200 shrink-0 ${form.active ? "bg-[#719378]" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${form.active ? "left-5" : "left-0.5"}`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {form.active
              ? "Active — visible in shop"
              : "Inactive — hidden from shop"}
          </span>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-[#719378] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer border-none"
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
