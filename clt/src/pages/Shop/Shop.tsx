import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { productApi } from "../../api/api";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types";

const CATEGORIES = ["All", "Baby", "Boys", "Girls", "Toys"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [catOpen,  setCatOpen]  = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const category = searchParams.get("category") || "All";
  const search   = searchParams.get("search")   || "";

  useEffect(() => {
    setLoading(true);
    const params: Record<string, unknown> = { active: true, limit: 24 };
    if (category !== "All") params.category = category;
    if (search) params.search = search;
    productApi
      .list(params)
      .then((r) => setProducts(r.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node))
        setCatOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const setCategory = (cat: string) => {
    const p = new URLSearchParams(searchParams);
    if (cat === "All") p.delete("category");
    else p.set("category", cat);
    setSearchParams(p);
    setCatOpen(false);
  };

  const clearSearch = () => {
    const p = new URLSearchParams(searchParams);
    p.delete("search");
    setSearchParams(p);
  };

  return (
    <>
      {/* ── Hero breadcrumb ─────────────────────────────────── */}
      <section className="relative w-full overflow-hidden">
        <img
          src="/img/background/bg-breadcrumb.jpg"
          alt=""
          className="w-full h-52 object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
          <h1 className="text-5xl font-light drop-shadow">Shop</h1>
          <p className="text-base opacity-80">
            <a href="/" className="text-white no-underline hover:underline">Home</a>
            {" "}&gt;{" "}
            {category !== "All" ? category : "All Products"}
          </p>
        </div>
      </section>

      <div className="w-full font-mono pb-8">
        {/* ── Barre de filtres ──────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 border-b border-gray-100">
          {/* Catégorie dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium">Filter:</span>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
                    category === c
                      ? "bg-[#719378] text-white border-[#719378]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#719378] hover:text-[#719378]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="relative" ref={selectRef}>
            <button
              onClick={() => setCatOpen((o) => !o)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
                catOpen
                  ? "bg-[#719378] text-white border-[#719378]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#719378]"
              }`}
            >
              {category}
              <ChevronDown size={14} className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer border-none ${
                      c === category
                        ? "bg-green-50 text-[#719378] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Recherche active ──────────────────────────────── */}
        {search && (
          <div className="flex items-center gap-2 px-6 py-3 bg-green-50 border-b border-green-100">
            <span className="text-sm text-gray-600">
              Results for: <strong className="text-gray-800">"{search}"</strong>
            </span>
            <button
              onClick={clearSearch}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 border border-gray-300 hover:border-red-300 rounded-full px-2 py-0.5 transition-colors cursor-pointer bg-white ml-1"
            >
              <X size={11} /> Clear
            </button>
          </div>
        )}

        {/* ── Compteur ─────────────────────────────────────── */}
        {!loading && (
          <p className="px-6 pt-4 text-sm text-gray-400">
            {products.length} product{products.length !== 1 ? "s" : ""}
            {category !== "All" && ` in "${category}"`}
            {search && ` matching "${search}"`}
          </p>
        )}

        {/* ── Grille ───────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center items-center py-32 opacity-40">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#719378] rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <span className="text-6xl">🛍️</span>
            <p className="text-lg font-light text-gray-500">No products found</p>
            <button
              className="px-6 py-2.5 rounded-full bg-[#719378] text-white text-sm font-bold hover:opacity-85 transition-opacity cursor-pointer border-none"
              onClick={() => setSearchParams({})}
            >
              Show all products
            </button>
          </div>
        ) : (
          <section className="flex flex-wrap justify-center gap-2 px-4 pt-4 pb-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </section>
        )}
      </div>
    </>
  );
}
