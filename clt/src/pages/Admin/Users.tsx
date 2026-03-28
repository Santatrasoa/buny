import { useEffect, useState, useCallback } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { userApi } from "../../api/api";
import type { User } from "../../types";

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
    // Defer load to avoid synchronous setState inside the effect
    const id = setTimeout(() => {
      load();
    }, 0);

    return () => clearTimeout(id);
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

  return (
    <div>
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 rounded-xl text-sm font-medium shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Users
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {total} user{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          to="/admin/users/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#719378] text-white text-sm font-semibold hover:opacity-90 transition-opacity no-underline"
        >
          + New User
        </Link>
      </div>

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
          placeholder="Search users…"
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
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <span className="text-4xl mb-2">👤</span>
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  {["User", "Phone", "Role", "Status", "Actions"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-800 ${
                          i === 0
                            ? "text-left"
                            : i === 1
                              ? "text-left"
                              : i >= 2
                                ? "text-center"
                                : ""
                        } ${i === 4 ? "text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isAdmin = u.roles?.includes("ROLE_ADMIN");
                  return (
                    <tr
                      key={u.id}
                      className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isAdmin
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            }`}
                          >
                            {(u.firstName?.[0] || u.email[0]).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                              {u.firstName
                                ? `${u.firstName} ${u.lastName || ""}`.trim()
                                : u.email}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {u.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isAdmin
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {isAdmin ? "👑 Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            u.active
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {u.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <Link
                            to={`/admin/users/${u.id}/edit`}
                            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            ✏️
                          </Link>
                          {confirmId === u.id ? (
                            <>
                              <button
                                onClick={() => handleDelete(u.id)}
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
                              onClick={() => setConfirmId(u.id)}
                              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-colors cursor-pointer"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

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
          to="/admin/users"
          className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors no-underline"
        >
          ← Users
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {isEdit ? "Edit User" : "New User"}
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
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              First Name
            </label>
            <input
              className={inputCls}
              type="text"
              placeholder="First name"
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Last Name
            </label>
            <input
              className={inputCls}
              type="text"
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Email *
          </label>
          <input
            className={inputCls}
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Phone
          </label>
          <input
            className={inputCls}
            type="tel"
            placeholder="+261 34 …"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Password{" "}
            {isEdit ? (
              <span className="text-gray-400 normal-case font-normal">
                (leave empty = unchanged)
              </span>
            ) : (
              "*"
            )}
          </label>
          <div className="relative">
            <input
              className={inputCls}
              type={showPwd ? "text" : "password"}
              placeholder={isEdit ? "••••••••" : "Min. 6 characters"}
              style={{ paddingRight: "2.75rem" }}
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={() => setSP((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer text-base"
            >
              {showPwd ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Admin toggle */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/10">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, isAdmin: !f.isAdmin }))}
            className={`w-11 h-6 rounded-full border-none cursor-pointer relative transition-colors duration-200 shrink-0 ${form.isAdmin ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"}`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${form.isAdmin ? "left-5" : "left-0.5"}`}
            />
          </button>
          <div>
            <div className="text-sm font-semibold text-purple-700 dark:text-purple-400">
              Administrator
            </div>
            <div className="text-xs text-purple-500 dark:text-purple-500 opacity-80">
              Full access to admin panel
            </div>
          </div>
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
            {form.active ? "Active account" : "Deactivated account"}
          </span>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-[#719378] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer border-none"
          >
            {loading ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
