import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../../api/api";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types";

const CATEGORIES = ["All", "Baby", "Boys", "Girls", "Toys"];

/* ─── Design tokens ─────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream:  #FAF7F4;
    --blush:  #F0E6DF;
    --nude:   #D4B8A8;
    --cocoa:  #7A5C4F;
    --ink:    #2C1F1A;
    --white:  #FFFFFF;
    --shadow: rgba(44,31,26,.08);
    --ease:   cubic-bezier(.4,0,.2,1);
  }

  body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--ink); }

  /* ── Hero breadcrumb banner ───────────────────────────────────── */
  .ct-image {
    position: relative;
    height: clamp(180px, 28vw, 320px);
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .ct-image img {
    position: absolute;
    inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    filter: brightness(.62) saturate(.8);
    transform: scale(1.03);
    transition: transform 6s var(--ease);
  }
  .ct-image:hover img { transform: scale(1); }
  .ct-image > div {
    position: relative;
    z-index: 1;
    padding: 0 3rem;
  }
  .ct-image h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 300;
    color: var(--white);
    letter-spacing: .06em;
    margin: 0 0 .3rem;
    text-shadow: 0 2px 24px rgba(0,0,0,.25);
  }
  .ct-image p {
    font-size: .78rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(255,255,255,.7);
  }
  .ct-image .a {
    color: rgba(255,255,255,.7);
    text-decoration: none;
    transition: color .2s;
  }
  .ct-image .a:hover { color: var(--white); }

  /* ── Toolbar row ──────────────────────────────────────────────── */
  .select-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.6rem 2.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  .select-container > p {
    font-size: .75rem;
    text-transform: uppercase;
    letter-spacing: .12em;
    color: var(--nude);
    font-weight: 500;
    white-space: nowrap;
  }

  /* ── Custom select ────────────────────────────────────────────── */
  .custom-select {
    position: relative;
    min-width: 150px;
  }
  .select-selected {
    padding: .55rem 2.2rem .55rem 1rem;
    border: 1.5px solid var(--blush);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: .85rem;
    font-weight: 500;
    color: var(--ink);
    cursor: pointer;
    user-select: none;
    position: relative;
    transition: border-color .2s, box-shadow .2s, background .2s;
    background: var(--white) !important; /* override inline style */
  }
  .select-selected:hover {
    border-color: var(--nude);
    box-shadow: 0 2px 10px var(--shadow);
  }
  .select-selected::after {
    content: '';
    position: absolute;
    right: .85rem; top: 50%;
    transform: translateY(-50%) rotate(0deg);
    width: 0; height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid var(--cocoa);
    transition: transform .2s var(--ease);
  }
  .select-selected.select-arrow-active {
    border-color: var(--nude);
    box-shadow: 0 0 0 3px rgba(212,184,168,.22);
    background: var(--cream) !important;
  }
  .select-selected.select-arrow-active::after {
    transform: translateY(-50%) rotate(180deg);
  }

  .select-items {
    position: absolute;
    top: calc(100% + 6px);
    left: 0; right: 0;
    background: var(--white);
    border: 1.5px solid var(--blush);
    border-radius: 12px;
    box-shadow: 0 12px 36px var(--shadow);
    overflow: hidden;
    z-index: 50;
    animation: dropDown .18s var(--ease);
  }
  @keyframes dropDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: none; }
  }
  .select-hide { display: none; }

  .select-item {
    padding: .65rem 1rem;
    font-size: .87rem;
    cursor: pointer;
    transition: background .15s, color .15s;
    color: var(--ink);
  }
  .select-item:hover {
    background: var(--blush);
    color: var(--cocoa);
  }
  .select-item:not(:last-child) {
    border-bottom: 1px solid var(--cream);
  }

  /* ── Category pill chips (bonus quick-filter strip) ───────────── */
  .cat-chips {
    display: flex;
    gap: .5rem;
    padding: 0 2.5rem 1.2rem;
    max-width: 1200px;
    margin: 0 auto;
    flex-wrap: wrap;
  }
  .cat-chip {
    padding: .38rem .95rem;
    border: 1.5px solid var(--blush);
    border-radius: 30px;
    font-size: .78rem;
    font-weight: 500;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: var(--nude);
    background: transparent;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all .2s var(--ease);
  }
  .cat-chip:hover {
    border-color: var(--nude);
    color: var(--cocoa);
    background: var(--blush);
  }
  .cat-chip.active {
    background: var(--cocoa);
    border-color: var(--cocoa);
    color: var(--white);
    box-shadow: 0 4px 14px rgba(122,92,79,.28);
  }

  /* ── Product grid ─────────────────────────────────────────────── */
  .ct-shop-product {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.6rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2.5rem 5rem;
    animation: fadeIn .4s var(--ease);
  }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

  /* ── Skeleton cards ───────────────────────────────────────────── */
  .product-card.skeleton {
    border-radius: 16px;
    overflow: hidden;
    background: var(--white);
    box-shadow: 0 4px 20px var(--shadow);
  }
  .skeleton-img {
    height: 280px;
    background: linear-gradient(90deg, var(--blush) 25%, var(--cream) 50%, var(--blush) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  .skeleton-text {
    margin: 1rem 1rem .5rem;
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, var(--blush) 25%, var(--cream) 50%, var(--blush) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  .skeleton-text.short { width: 55%; margin-bottom: 1rem; }
  @keyframes shimmer {
    from { background-position: 200% 0 }
    to   { background-position: -200% 0 }
  }

  /* ── Empty state ──────────────────────────────────────────────── */
  .shop-empty {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
    gap: 1rem;
    color: var(--nude);
  }
  .shop-empty span { font-size: 3rem; }
  .shop-empty p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-weight: 300;
    font-style: italic;
  }
  .shop-empty small {
    font-size: .8rem;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  /* ── Result count ─────────────────────────────────────────────── */
  .shop-count {
    font-size: .75rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--nude);
    padding: 0 2.5rem .8rem;
    max-width: 1200px;
    margin: 0 auto;
  }
`;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [catOpen, setCatOpen] = useState(false);

  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    const params: Record<string, unknown> = { active: true, limit: 20 };
    if (category !== "All") params.category = category;
    if (search) params.search = search;

    productApi
      .list(params)
      .then((r) => setProducts(r.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  const setCategory = (cat: string) => {
    const p = new URLSearchParams(searchParams);
    if (cat === "All") p.delete("category");
    else p.set("category", cat);
    setSearchParams(p);
    setCatOpen(false);
  };

  return (
    <>
      <style>{CSS}</style>

      {/* ── Hero breadcrumb ───────────────────────────────────────── */}
      <section className="ct-image">
        <div>
          <h1>Shop</h1>
          <p>
            <a href="/" className="a">
              Home
            </a>{" "}
            {">"} Shop
          </p>
        </div>
        <img src="/img/background/bg-breadcrumb.jpg" alt="" />
      </section>

      <main>
        {/* ── Toolbar ─────────────────────────────────────────────── */}
        <div className="select-container">
          <p>Sort by</p>
          <div className="custom-select">
            <div
              className={`select-selected ${catOpen ? "select-arrow-active" : ""}`}
              onClick={() => setCatOpen((o) => !o)}
            >
              {category}
            </div>
            {catOpen && (
              <div className="select-items">
                {CATEGORIES.map((c) => (
                  <div
                    key={c}
                    className="select-item"
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Category chips ─────────────────────────────────────── */}
        <div className="cat-chips">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`cat-chip ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* ── Result count ───────────────────────────────────────── */}
        {!loading && products.length > 0 && (
          <p className="shop-count">
            {products.length} item{products.length !== 1 ? "s" : ""}
            {category !== "All" ? ` in ${category}` : ""}
            {search ? ` for "${search}"` : ""}
          </p>
        )}

        {/* ── Product grid ───────────────────────────────────────── */}
        <section className="ct-shop-product">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="product-card skeleton">
                <div className="product-img-wrapper skeleton-img" />
                <div className="skeleton-text" />
                <div className="skeleton-text short" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="shop-empty">
              <span>🌿</span>
              <p>Nothing found here</p>
              <small>Try another category or clear your search</small>
            </div>
          ) : (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </section>
      </main>
    </>
  );
}
