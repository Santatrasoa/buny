import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../api/api";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types";

const CATEGORIES = ["All", "Baby", "Boys", "Girls", "Toys"];

export default function Home() {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Produits recommandés (6 premiers actifs)
    productApi
      .list({ active: true, limit: 6 })
      .then((r) => setRecommended(r.data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const params: Record<string, unknown> = { active: true, limit: 8 };
    if (category !== "All") params.category = category;
    productApi
      .list(params)
      .then((r) => setFiltered(r.data ?? []))
      .catch(() => {});
  }, [category]);

  return (
    <main>
      {/* ── Slider hero ─────────────────────────────────────── */}
      <section className="container-slide">
        <div className="content-word">
          <h1>Newborn</h1>
          <h1>Baby</h1>
          <h1>Clothes</h1>
          <p>Our cutest looks &amp; matching sets,</p>
          <p>designed for easy dressing &amp; every day comfort</p>
          <p>Purchases relating to perenthood and your baby</p>
          <Link to="/shop">
            <button className="button">Shop now</button>
          </Link>
        </div>
        <div className="content-img">
          <img src="/img/slider-2.jpg" alt="baby clothes" />
        </div>
        <section className="cloud">
          <img src="/img/cloud.png" alt="" />
        </section>
      </section>

      {/* ── Recommandés ─────────────────────────────────────── */}
      <section className="recommanded">
        <h1>Recommanded For You</h1>
        <p>Fashion Meets Function, On-trend Style</p>
      </section>

      <section className="container-recommaneded">
        {recommended.length === 0
          ? // Placeholder si pas d'API
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="product-card">
                <div className="product-img-wrapper">
                  <div className="product-img-placeholder">👶</div>
                </div>
                <div className="product-info">
                  <p className="product-category">Baby</p>
                  <h3 className="product-name">Baby Outfit {i}</h3>
                  <div className="product-price-row">
                    <span className="product-price">$24.99</span>
                  </div>
                </div>
              </div>
            ))
          : recommended.map((p) => <ProductCard key={p.id} product={p} />)}
      </section>

      {/* ── Baby Outfits banner ─────────────────────────────── */}
      <section className="babyOutfits">
        <div>
          <img src="/img/banner-2.jpg" alt="" />
        </div>
        <div>
          <img src="/img/banner-1.jpg" alt="" />
        </div>
        <div className="c-word">
          <h1>Baby Outfits &amp; Sets</h1>
          <p>
            Dress your little one in our adorable Baby Outfits &amp; Sets,
            crafted with soft fabrics for maximum comfort and style. From
            snuggly onesies to charming two-piece sets, each ensemble is
            designed to keep your baby cozy and looking oh-so-adorable.
          </p>
          <button className="button" onClick={() => navigate("/shop")}>
            Shop Now
          </button>
        </div>
      </section>

      {/* ── Kids section ────────────────────────────────────── */}
      <section className="kids">
        <div className="kids-w-content">
          <div>
            <h1>Kids</h1>
            <h3>Clothing, Shoes &amp; Accessories</h3>
            <p>
              Elevate your child's wardrobe with our versatile range of Kids
              Clothing, Shoes &amp; Accessories, crafted to reflect the latest
              fashion trends while prioritizing comfort and durability.
            </p>
          </div>
          <div>
            <img style={{ width: "100%" }} src="/img/banner-video.jpg" alt="" />
          </div>
        </div>
        <div className="c-img">
          <img src="/img/lookbook-1.jpg" alt="lookbook" />
        </div>
      </section>

      {/* ── Filtre + grille ─────────────────────────────────── */}
      <div className="cnt-filter">
        <div className="select-container">
          <p>Sort by</p>
          <div className="custom-select">
            <div
              className={`select-selected ${catOpen ? "select-arrow-active" : ""}`}
              onClick={() => setCatOpen((o) => !o)}
              style={{ backgroundColor: catOpen ? "#f7c6d6" : "#fff" }}
            >
              {category}
            </div>
            <div className={`select-items ${catOpen ? "" : "select-hide"}`}>
              {CATEGORIES.map((c) => (
                <div
                  key={c}
                  className="select-item"
                  onClick={() => {
                    setCategory(c);
                    setCatOpen(false);
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grille produits filtrés — deux colonnes comme l'original */}
        <div className="ct-filter c-1">
          {filtered
            .filter((_, i) => i % 2 === 0)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
        <div className="ct-filter c-2">
          {filtered
            .filter((_, i) => i % 2 === 1)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </div>

      <div className="center-btn">
        <button className="button" onClick={() => navigate("/shop")}>
          View All
        </button>
      </div>
    </main>
  );
}
