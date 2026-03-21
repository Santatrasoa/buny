import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productApi } from "../../api/api";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types";

/* ─── Design tokens (inlined so the component is self-contained) ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream:   #FAF7F4;
    --blush:   #F0E6DF;
    --nude:    #D4B8A8;
    --cocoa:   #7A5C4F;
    --ink:     #2C1F1A;
    --white:   #FFFFFF;
    --shadow:  rgba(44,31,26,.08);
    --radius:  14px;
    --ease:    cubic-bezier(.4,0,.2,1);
  }

  /* ── Global reset for the page ────────────────────────────── */
  body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--ink); }

  /* ── Buy overlay ──────────────────────────────────────────── */
  .buy-panier {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(44,31,26,.45);
    backdrop-filter: blur(8px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    animation: fadeIn .25s var(--ease);
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

  .buy-panier form {
    background: var(--white);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    width: min(90vw, 440px);
    display: flex; flex-direction: column; gap: 1rem;
    box-shadow: 0 24px 64px rgba(44,31,26,.18);
    animation: slideUp .3s var(--ease);
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity:0 } to { transform: none; opacity:1 } }

  .buy-panier form input,
  .buy-panier form textarea {
    border: 1.5px solid var(--blush);
    border-radius: 10px;
    padding: .75rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: .92rem;
    color: var(--ink);
    background: var(--cream);
    transition: border-color .2s, box-shadow .2s;
    outline: none;
    resize: none;
  }
  .buy-panier form input:focus,
  .buy-panier form textarea:focus {
    border-color: var(--nude);
    box-shadow: 0 0 0 3px rgba(212,184,168,.25);
  }
  .buy-panier form input[type="submit"] {
    background: var(--cocoa);
    color: var(--white);
    font-weight: 500;
    letter-spacing: .06em;
    text-transform: uppercase;
    font-size: .82rem;
    cursor: pointer;
    border: none;
    padding: .9rem;
    border-radius: 10px;
    transition: background .2s, transform .15s;
  }
  .buy-panier form input[type="submit"]:hover { background: var(--ink); transform: translateY(-1px); }

  .ct-close {
    position: absolute; top: 1.5rem; right: 1.5rem;
  }
  #close-buy {
    background: var(--white);
    border: none;
    border-radius: 50%;
    width: 40px; height: 40px;
    display: grid; place-items: center;
    cursor: pointer;
    font-size: 1.1rem;
    color: var(--cocoa);
    box-shadow: 0 4px 16px var(--shadow);
    transition: background .2s, transform .15s;
  }
  #close-buy:hover { background: var(--blush); transform: rotate(90deg); }

  /* ── Breadcrumb ───────────────────────────────────────────── */
  .h-products {
    padding: 1.4rem 2.5rem;
    font-size: .82rem;
    letter-spacing: .06em;
    color: var(--nude);
    text-transform: uppercase;
  }
  .h-products a {
    color: var(--nude);
    text-decoration: none;
    transition: color .2s;
  }
  .h-products a:hover { color: var(--cocoa); }

  /* ── Product section ──────────────────────────────────────── */
  .info-products {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 2.5rem 4rem;
    animation: fadeIn .4s var(--ease);
  }
  @media (max-width: 720px) { .info-products { grid-template-columns: 1fr; } }

  /* ── Product image ────────────────────────────────────────── */
  .product-detail-img {
    border-radius: 20px;
    overflow: hidden;
    background: var(--blush);
    aspect-ratio: 3/4;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    box-shadow: 0 12px 40px var(--shadow);
  }
  .product-detail-img img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform .6s var(--ease);
  }
  .product-detail-img:hover img { transform: scale(1.04); }
  .product-img-placeholder.large { font-size: 5rem; opacity: .3; }

  /* ── Product info panel ───────────────────────────────────── */
  .product-detail-info {
    display: flex; flex-direction: column; gap: 1.1rem;
    padding-top: .5rem;
  }

  .product-category {
    font-size: .76rem;
    text-transform: uppercase;
    letter-spacing: .12em;
    color: var(--nude);
    font-weight: 500;
  }

  .product-detail-info h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 300;
    line-height: 1.15;
    margin: 0;
    color: var(--ink);
  }

  .product-detail-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.7rem;
    font-weight: 400;
    color: var(--cocoa);
    letter-spacing: .02em;
  }

  /* ── Stock badge ──────────────────────────────────────────── */
  .product-stock {
    display: inline-flex;
    align-items: center;
    gap: .45rem;
    font-size: .8rem;
    font-weight: 500;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: .35rem .8rem;
    border-radius: 30px;
    width: fit-content;
  }
  .product-stock::before {
    content: '';
    width: 7px; height: 7px;
    border-radius: 50%;
    display: inline-block;
  }
  .product-stock.in  { background: #EDF7ED; color: #3D7A45; }
  .product-stock.in::before  { background: #3D7A45; box-shadow: 0 0 0 3px rgba(61,122,69,.2); }
  .product-stock.out { background: #FDEDED; color: #B94A4A; }
  .product-stock.out::before { background: #B94A4A; }

  /* ── Size grid ────────────────────────────────────────────── */
  .product-sizes > p {
    font-size: .78rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--nude);
    font-weight: 500;
    margin-bottom: .6rem;
  }
  .sizes-grid {
    display: flex; flex-wrap: wrap; gap: .5rem;
  }
  .size-btn {
    padding: .45rem .85rem;
    border: 1.5px solid var(--blush);
    border-radius: 8px;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: .82rem;
    color: var(--ink);
    cursor: pointer;
    transition: all .2s var(--ease);
  }
  .size-btn:hover {
    border-color: var(--nude);
    background: var(--blush);
  }
  .size-btn.active {
    background: var(--cocoa);
    border-color: var(--cocoa);
    color: var(--white);
    box-shadow: 0 4px 14px rgba(122,92,79,.28);
  }

  /* ── Quantity selector ────────────────────────────────────── */
  .product-qty {
    display: inline-flex;
    align-items: center;
    gap: 0;
    border: 1.5px solid var(--blush);
    border-radius: 10px;
    overflow: hidden;
    width: fit-content;
  }
  .product-qty button {
    width: 40px; height: 40px;
    border: none; background: transparent;
    font-size: 1.2rem;
    color: var(--cocoa);
    cursor: pointer;
    transition: background .15s;
    display: grid; place-items: center;
  }
  .product-qty button:hover { background: var(--blush); }
  .product-qty span {
    min-width: 44px; text-align: center;
    font-size: .95rem;
    font-weight: 500;
    border-left: 1.5px solid var(--blush);
    border-right: 1.5px solid var(--blush);
  }

  /* ── Action buttons ───────────────────────────────────────── */
  .product-actions {
    display: flex; gap: .8rem; flex-wrap: wrap;
  }
  .product-actions .button {
    flex: 1;
    padding: .85rem 1.5rem;
    border: 2px solid var(--ink);
    border-radius: 10px;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: .85rem;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--ink);
    cursor: pointer;
    transition: all .2s var(--ease);
  }
  .product-actions .button:hover {
    background: var(--ink);
    color: var(--white);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(44,31,26,.18);
  }
  .product-actions .buy {
    flex: 1;
    padding: .85rem 1.5rem;
    border: none;
    border-radius: 10px;
    background: var(--cocoa);
    font-family: 'DM Sans', sans-serif;
    font-size: .85rem;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--white);
    cursor: pointer;
    transition: all .2s var(--ease);
    box-shadow: 0 4px 16px rgba(122,92,79,.25);
  }
  .product-actions .buy:hover {
    background: var(--ink);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(44,31,26,.22);
  }

  /* ── Divider ──────────────────────────────────────────────── */
  .product-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--blush), transparent);
    margin: 0 2.5rem;
    max-width: 1120px;
    margin-inline: auto;
  }

  /* ── Tabs ─────────────────────────────────────────────────── */
  .content-description-button {
    display: flex;
    gap: 0;
    max-width: 1120px;
    margin: 2.5rem auto 0;
    padding: 0 2.5rem;
    border-bottom: 1.5px solid var(--blush);
  }
  .content-description-button button {
    padding: .75rem 1.6rem;
    border: none;
    border-bottom: 2.5px solid transparent;
    margin-bottom: -1.5px;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: .82rem;
    font-weight: 500;
    letter-spacing: .09em;
    text-transform: uppercase;
    color: var(--nude);
    cursor: pointer;
    transition: color .2s, border-color .2s;
  }
  .content-description-button button.active {
    color: var(--ink);
    border-bottom-color: var(--cocoa);
  }
  .content-description-button button:hover:not(.active) { color: var(--cocoa); }

  /* ── Description content ──────────────────────────────────── */
  .content-description {
    max-width: 1120px;
    margin: 0 auto;
    padding: 1.8rem 2.5rem 3rem;
    font-size: .95rem;
    line-height: 1.85;
    color: var(--ink);
    opacity: .85;
    animation: fadeIn .3s var(--ease);
  }

  /* ── Related products ─────────────────────────────────────── */
  .otherProduct {
    background: var(--blush);
    padding: 4rem 2.5rem;
    margin-top: 1rem;
  }
  .h-related-product {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .h-related-product h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
    font-weight: 300;
    color: var(--ink);
    letter-spacing: .03em;
    position: relative;
    display: inline-block;
  }
  .h-related-product h1::after {
    content: '';
    display: block;
    width: 40px; height: 1.5px;
    background: var(--nude);
    margin: .5rem auto 0;
    border-radius: 2px;
  }
  .ct-filter {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.2rem;
    margin-bottom: 1.2rem;
  }

  /* ── Loading skeleton ─────────────────────────────────────── */
  .skeleton-shimmer {
    background: linear-gradient(90deg, var(--blush) 25%, var(--cream) 50%, var(--blush) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: var(--radius);
  }
  @keyframes shimmer { from { background-position: 200% 0 } to { background-position: -200% 0 } }

  /* ── View your products link ──────────────────────────────── */
  .view-products {
    margin-bottom: 1rem;
  }
  .view-products .buy {
    background: var(--cocoa);
    color: var(--white);
    border: none;
    border-radius: 10px;
    padding: .6rem 1.4rem;
    font-family: 'DM Sans', sans-serif;
    font-size: .82rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: .08em;
    cursor: pointer;
    transition: background .2s;
  }
  .view-products .buy:hover { background: var(--ink); }
`;

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setP] = useState<Product | null>(null);
  const [related, setRel] = useState<Product[]>([]);
  const [loading, setLoad] = useState(true);
  const [tab, setTab] = useState<"description" | "review">("description");
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [showBuy, setShowBuy] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoad(true);
    productApi
      .get(Number(id))
      .then((p) => {
        setP(p);
        return productApi.list({
          category: p.category,
          active: true,
          limit: 8,
        });
      })
      .then((r) =>
        setRel((r.data ?? []).filter((p: Product) => p.id !== Number(id))),
      )
      .catch(() => {})
      .finally(() => setLoad(false));
  }, [id]);

  /* ── Loading state ──────────────────────────────────────── */
  if (loading)
    return (
      <>
        <style>{CSS}</style>
        <main>
          <section className="h-products">
            <p>
              Home {">"} Shop {">"} …
            </p>
          </section>
          <section className="info-products">
            <div className="skeleton-shimmer" style={{ height: 480 }} />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                className="skeleton-shimmer"
                style={{ height: 20, width: "40%" }}
              />
              <div
                className="skeleton-shimmer"
                style={{ height: 56, width: "75%" }}
              />
              <div
                className="skeleton-shimmer"
                style={{ height: 32, width: "30%" }}
              />
              <div
                className="skeleton-shimmer"
                style={{ height: 20, width: "22%" }}
              />
              <div
                className="skeleton-shimmer"
                style={{ height: 48, width: "60%" }}
              />
              <div className="skeleton-shimmer" style={{ height: 48 }} />
            </div>
          </section>
        </main>
      </>
    );

  /* ── Not found ──────────────────────────────────────────── */
  if (!product)
    return (
      <>
        <style>{CSS}</style>
        <main>
          <section className="h-products">
            <p>Product not found</p>
          </section>
          <section className="info-products">
            <p style={{ padding: "2rem", textAlign: "center", opacity: 0.4 }}>
              <Link to="/shop">← Back to Shop</Link>
            </p>
          </section>
        </main>
      </>
    );

  const SIZES = ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M", "2T", "3T", "4T"];

  return (
    <>
      {/* ── Inject styles ───────────────────────────────────── */}
      <style>{CSS}</style>

      {/* ── Buy overlay ─────────────────────────────────────── */}
      {showBuy && (
        <div className="buy-panier">
          <div className="ct-close">
            <button
              id="close-buy"
              className="material-icons-outlined"
              aria-label="Close buy form"
              onClick={() => setShowBuy(false)}
            >
              close
            </button>
          </div>
          <div className="view-products">
            <button className="buy" onClick={() => setShowBuy(false)}>
              View Your Products
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowBuy(false);
            }}
          >
            <input type="text" id="user-buy" placeholder="Name *" required />
            <input type="email" id="mail-buy" placeholder="Mail *" required />
            <input
              type="text"
              id="location-buy"
              placeholder="Location *"
              required
            />
            <textarea cols={30} rows={5} placeholder="Little message…" />
            <input type="submit" value="Buy now" />
          </form>
        </div>
      )}

      <main>
        {/* Breadcrumb */}
        <section className="h-products">
          <p>
            <Link to="/">Home</Link> {">"} <Link to="/shop">Shop</Link> {">"}{" "}
            {product.category}
          </p>
        </section>

        {/* Product detail */}
        <section className="info-products">
          {/* Image */}
          <div className="product-detail-img">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="product-img-placeholder large">👶</div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <p className="product-category">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="product-detail-price">
              ${Number(product.price).toFixed(2)}
            </p>

            <p
              className={`product-stock ${product.stock === 0 ? "out" : "in"}`}
            >
              {product.stock === 0
                ? "Out of stock"
                : `In stock (${product.stock})`}
            </p>

            {product.stock > 0 && (
              <div className="product-sizes">
                <p>Size</p>
                <div className="sizes-grid">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      className={`size-btn ${size === s ? "active" : ""}`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.stock > 0 && (
              <>
                <div className="product-qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    −
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() =>
                      setQty((q) => Math.min(product.stock, q + 1))
                    }
                  >
                    +
                  </button>
                </div>

                <div className="product-actions">
                  <button
                    className="button"
                    onClick={() => addItem(product, qty)}
                  >
                    Add to cart
                  </button>
                  <button className="buy" onClick={() => setShowBuy(true)}>
                    Buy now
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Tabs */}
        <div className="product-divider" />
        <section className="content-description-button">
          <button
            className={tab === "description" ? "active" : ""}
            onClick={() => setTab("description")}
          >
            Description
          </button>
          <button
            className={tab === "review" ? "active" : ""}
            onClick={() => setTab("review")}
          >
            Reviews
          </button>
        </section>

        <section className="content-description">
          {tab === "description" ? (
            <p>
              {product.description ||
                "No description available for this product."}
            </p>
          ) : (
            <p style={{ opacity: 0.4, fontStyle: "italic" }}>
              No reviews yet — be the first to share your thoughts.
            </p>
          )}
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="otherProduct">
            <div className="h-related-product">
              <h1>Related Products</h1>
            </div>
            <div className="ct-filter c-1">
              {related
                .filter((_, i) => i % 2 === 0)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
            <div className="ct-filter c-2">
              {related
                .filter((_, i) => i % 2 === 1)
                .map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
