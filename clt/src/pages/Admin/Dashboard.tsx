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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardApi
      .stats()
      .then(setStats)
      .catch(() => setError("Cannot connect to backend."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
        <div className="w-5 h-5 border-2 border-gray-200 border-t-[#719378] rounded-full animate-spin" />
        Loading dashboard…
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm border border-red-200 dark:border-red-800">
        {error}
      </div>
    );

  const statCards = [
    {
      label: "Total Products",
      value: stats!.products.total,
      icon: "📦",
      bg: "bg-green-50 dark:bg-green-900/20",
      link: "/admin/products",
    },
    {
      label: "Active Products",
      value: stats!.products.active,
      icon: "✅",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      link: "/admin/products",
    },
    {
      label: "Low Stock",
      value: stats!.products.lowStock,
      icon: "⚠️",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      link: "/admin/products",
    },
    {
      label: "Out of Stock",
      value: stats!.products.outOfStock,
      icon: "❌",
      bg: "bg-red-50 dark:bg-red-900/20",
      link: "/admin/products",
    },
    {
      label: "Total Users",
      value: stats!.users.total,
      icon: "👥",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      link: "/admin/users",
    },
    {
      label: "Active Users",
      value: stats!.users.active,
      icon: "🟢",
      bg: "bg-teal-50 dark:bg-teal-900/20",
      link: "/admin/users",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back — here's your store overview
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#719378] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            + New Product
          </Link>
          <Link
            to="/admin/users/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            + New User
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statCards.map((s) => (
          <Link
            key={s.label}
            to={s.link}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-start gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 no-underline"
          >
            <div
              className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center text-xl shrink-0`}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                {s.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                {s.value ?? 0}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-2 gap-5">
        {/* Latest Products */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              👶 Latest Products
            </span>
            <Link
              to="/admin/products"
              className="text-xs text-[#719378] font-medium hover:underline"
            >
              View all →
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Name
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Category
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Price
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {stats?.latestProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {p.name}
                  </td>
                  <td className="px-4 py-3">
                    {p.category ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Latest Users */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              👤 Latest Users
            </span>
            <Link
              to="/admin/users"
              className="text-xs text-[#719378] font-medium hover:underline"
            >
              View all →
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  User
                </th>
                <th className="px-4 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {stats?.latestUsers.map((u) => {
                const isAdmin = u.roles?.includes("ROLE_ADMIN");
                return (
                  <tr
                    key={u.id}
                    className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
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
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {u.firstName || u.email}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {u.email}
                          </div>
                        </div>
                      </div>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
