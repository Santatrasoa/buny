import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { productApi } from "../../api/api";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types";

const CATEGORIES = ["All", "Baby", "Boys", "Girls", "Toys"];

/* Squelette de chargement */
const SkeletonCard = () => (
  <div className="flex flex-col w-52 m-3 animate-pulse">
    <div className="w-full aspect-[3/4] rounded-2xl bg-gray-200" />
    <div className="pt-3 px-1 flex flex-col gap-2">
      <div className="h-2.5 w-16 bg-gray-200 rounded-full" />
      <div className="h-3.5 w-36 bg-gray-200 rounded-full" />
      <div className="h-3.5 w-20 bg-gray-200 rounded-full" />
    </div>
  </div>
);

export default function Home() {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [filtered,    setFiltered]    = useState<Product[]>([]);
  const [loadingRec,  setLoadingRec]  = useState(true);
  const [loadingFil,  setLoadingFil]  = useState(true);
  const [category,    setCategory]    = useState("All");
  const [catOpen,     setCatOpen]     = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const navigate  = useNavigate();

  /* Recommended */
  useEffect(() => {
    setLoadingRec(true);
    productApi
      .list({ active: true, limit: 4 })
      .then((r) => setRecommended(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingRec(false));
  }, []);

  /* Filtered by category */
  useEffect(() => {
    setLoadingFil(true);
    const params: Record<string, unknown> = { active: true, limit: 8 };
    if (category !== "All") params.category = category;
    productApi
      .list(params)
      .then((r) => setFiltered(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingFil(false));
  }, [category]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node))
        setCatOpen(false);
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  return (
    <div className="w-full overflow-x-hidden font-mono">

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col md:flex-row items-center bg-[#f4f9f5] min-h-[480px] overflow-hidden">
        {/* Texte */}
        <div className="z-10 w-full md:w-1/2 flex flex-col justify-center items-center md:items-start gap-3 py-16 px-8 md:px-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#719378] bg-green-50 px-3 py-1 rounded-full">
            New Collection
          </span>
          <h1 className="text-5xl md:text-6xl font-light text-gray-800 leading-tight">
            Newborn<br />
            <span className="font-normal text-[#719378]">Baby</span><br />
            Clothes
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Our cutest looks &amp; matching sets,
            designed for easy dressing &amp; every day comfort.
          </p>
          <div className="flex gap-3 mt-2">
            <Link to="/shop">
              <button className="px-8 py-3 rounded-full bg-[#719378] text-white text-sm font-bold hover:opacity-85 transition-opacity cursor-pointer border-none">
                Shop Now
              </button>
            </Link>
            <Link to="/shop?category=Baby">
              <button className="px-8 py-3 rounded-full border border-[#719378] text-[#719378] text-sm font-bold hover:bg-green-50 transition-colors cursor-pointer bg-transparent">
                Baby Collection
              </button>
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="hidden md:flex w-1/2 justify-center items-end pr-8 pb-0 h-full">
          <img
            src="/img/slider-2.jpg"
            alt="baby clothes"
            className="w-[72%] max-w-sm rounded-t-full object-cover"
            style={{ maxHeight: "440px" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Nuage décoratif */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <img
            src="/img/cloud.png"
            alt=""
            className="w-full"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          RECOMMENDED
      ══════════════════════════════════════════════════════ */}
      <section className="py-16 px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-gray-800">Recommended For You</h2>
          <p className="text-sm text-gray-400 mt-2">Fashion Meets Function, On-trend Style</p>
        </div>
        <div className="flex flex-wrap justify-center">
          {loadingRec
            ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
            : recommended.length === 0
            ? (
              <p className="text-gray-400 text-sm py-10">
                No products available yet.{" "}
                <Link to="/shop" className="text-[#719378] no-underline hover:underline">
                  Browse the shop
                </Link>
              </p>
            )
            : recommended.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BABY OUTFITS BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="flex flex-col md:flex-row items-center gap-6 px-6 py-10 bg-[#f9fafb]">
        {/* Images */}
        <div className="flex gap-4 w-full md:w-1/2 justify-center">
          {["/img/banner-2.jpg", "/img/banner-1.jpg"].map((src, i) => (
            <div
              key={i}
              className="w-[45%] aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200"
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          ))}
        </div>

        {/* Texte */}
        <div className="w-full md:w-1/2 flex flex-col gap-5 px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-normal text-gray-800 leading-tight">
            Baby Outfits &amp; Sets
          </h2>
          <p className="text-base text-gray-400 leading-relaxed">
            Dress your little one in our adorable Baby Outfits &amp; Sets,
            crafted with soft fabrics for maximum comfort and style.
            From snuggly onesies to charming two-piece sets.
          </p>
          <button
            className="self-start px-8 py-3 rounded-full bg-[#719378] text-white text-sm font-bold hover:opacity-85 transition-opacity cursor-pointer border-none"
            onClick={() => navigate("/shop")}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          KIDS SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="flex flex-col md:flex-row items-center px-6 py-10 gap-8">
        <div className="w-full md:w-[40%] flex flex-col gap-4">
          <div>
            <h2 className="text-5xl font-light text-gray-800">Kids</h2>
            <h3 className="text-2xl text-gray-600 mt-1">
              Clothing, Shoes &amp; Accessories
            </h3>
          </div>
          <p className="text-base text-gray-400 leading-relaxed">
            Elevate your child's wardrobe with our versatile range of Kids
            Clothing, Shoes &amp; Accessories, crafted to reflect the latest
            fashion trends while prioritizing comfort and durability.
          </p>
          <div className="w-full rounded-2xl overflow-hidden bg-gray-100">
            <img
              src="/img/banner-video.jpg"
              alt=""
              className="w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        </div>

        <div className="w-full md:w-[60%] rounded-2xl overflow-hidden bg-gray-100">
          <img
            src="/img/lookbook-1.jpg"
            alt="lookbook"
            className="w-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FILTRE + GRILLE PRODUITS
      ══════════════════════════════════════════════════════ */}
      <section className="py-12 px-6">
        {/* Header section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-gray-800">Our Products</h2>
          <p className="text-sm text-gray-400 mt-2">Discover our latest arrivals</p>
        </div>

        {/* Filtres catégorie */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
                category === c
                  ? "bg-[#719378] text-white border-[#719378]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#719378] hover:text-[#719378]"
              }`}
            >
              {c}
            </button>
          ))}

          {/* Dropdown tri sur mobile */}
          <div className="relative md:hidden" ref={selectRef}>
            <button
              onClick={() => setCatOpen((o) => !o)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer ${
                catOpen
                  ? "bg-[#719378] text-white border-[#719378]"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {category}
              <ChevronDown size={14} className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setCatOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer border-none bg-white transition-colors ${
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

        {/* Grille produits */}
        {loadingFil ? (
          <div className="flex flex-wrap justify-center">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <span className="text-5xl">🛍️</span>
            <p className="text-gray-400 text-sm">No products in this category yet.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Voir tout */}
        <div className="flex justify-center mt-10">
          <button
            className="px-10 py-3 rounded-full bg-[#719378] text-white text-sm font-bold hover:opacity-85 transition-opacity cursor-pointer border-none"
            onClick={() => navigate(category === "All" ? "/shop" : `/shop?category=${category}`)}
          >
            View All Products
          </button>
        </div>
      </section>
    </div>
  );
}
