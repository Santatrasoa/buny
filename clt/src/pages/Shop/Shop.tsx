import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../../api/api";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types";

const CATEGORIES = ["All", "Baby", "Boys", "Toys"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const params: Record<string, unknown> = { active: true, limit: 20 };
    if (category !== "All") params.category = category;
    if (search) params.search = search;
    productApi
      .list(params)
      .then((r) => setProducts(r.data ?? []))
      .catch(() => setProducts([]));
  }, [category, search]);

  // Fermer le select au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
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

  return (
    <>
      {/* ── Hero breadcrumb ───────────────────────────────────────── */}
      {/* ct-image: flex, w-full, relative */}
      <section className="flex w-full relative">
        <div
          className="w-full absolute flex justify-center items-center flex-col"
          style={{ height: "50%" }}
        >
          <h1 className="text-[50px] font-light">Shop</h1>
          <p className="text-[20px] py-[20px]">
            <a href="/" className="no-underline text-black">
              Home
            </a>{" "}
            &gt; Shop
          </p>
        </div>
        <img
          src="/img/background/bg-breadcrumb.jpg"
          alt=""
          className="w-full"
        />
      </section>

      <main className="w-full font-mono">
        {/* ── select-container: centered, mt-[100px] mb-[100px] ─── */}
        <div
          className="w-full mt-[100px] mb-[100px] flex justify-center items-center"
          ref={selectRef}
        >
          <p className="m-[10px] mr-[30px] text-[20px]">Sort by</p>
          <div className="w-[15%] relative min-w-[120px]">
            {/* select-selected */}
            <div
              className={`text-[15px] py-[15px] px-[15px] border border-[#e5e4e5] rounded-[25px] cursor-pointer transition-colors duration-200 hover:bg-[#719378] hover:text-white ${
                catOpen ? "bg-[#719378] text-white" : "bg-white"
              }`}
              onClick={() => setCatOpen((o) => !o)}
            >
              {category}
            </div>
            {/* select-items */}
            {catOpen && (
              <div className="bg-white absolute border border-[#e5e4e5] z-[99] w-full box-border p-[5px] text-[15px]">
                {CATEGORIES.map((c) => (
                  <div
                    key={c}
                    className="p-[10px] cursor-pointer hover:bg-[#f1f1f1]"
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── ct-shop-product: flex-col, centered ──────────────── */}
        <section className="w-full flex flex-col justify-center items-center">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      </main>
    </>
  );
}
