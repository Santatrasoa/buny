import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronRight, Eye, Minus, Plus } from "lucide-react";
import { productApi } from "../../api/api";
import { useCart } from "../../hooks/useCart";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types";

const SAGE = "#719378";

export default function ProductDetail() {
  const { id }  = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const [product,  setProduct]  = useState<Product | null>(null);
  const [related,  setRelated]  = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [qty,      setQty]      = useState(1);
  const [tab,      setTab]      = useState<"description" | "review">("description");
  const [imgIdx,   setImgIdx]   = useState(0);
  const [viewers]               = useState(Math.floor(Math.random() * 30) + 10);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    setQty(1);
    setImgIdx(0);
    productApi
      .get(Number(id))
      .then((p: Product) => {
        setProduct(p);
        return productApi.list({ category: p.category, active: true, limit: 6 });
      })
      .then((r: { data?: Product[] }) => {
        setRelated((r.data ?? []).filter((p: Product) => p.id !== Number(id)).slice(0, 4));
      })
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, qty);
    openCart();
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#719378] rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Erreur ── */
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-5 text-center">
        <span className="text-6xl">😕</span>
        <p className="text-xl font-light text-gray-500">{error || "Product not found"}</p>
        <button
          className="px-6 py-3 rounded-full border-none cursor-pointer text-sm font-bold text-white hover:opacity-85 transition-opacity"
          style={{ backgroundColor: SAGE }}
          onClick={() => navigate("/shop")}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const images = [product.image, ...(product.images ?? [])].filter(Boolean) as string[];
  const mainImg = images[imgIdx];

  return (
    <div className="w-full font-sans">

      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 px-6 py-4 text-xs text-gray-400">
        <Link to="/" className="hover:text-gray-700 no-underline text-gray-400">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-gray-700 no-underline text-gray-400">Shop</Link>
        {product.category && (
          <>
            <ChevronRight size={12} />
            <Link
              to={`/shop?category=${product.category}`}
              className="hover:text-gray-700 no-underline text-gray-400"
            >
              {product.category}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* ── Corps principal ────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-8 px-4 md:px-8 pb-12">

        {/* Images */}
        <div className="md:w-[55%] flex gap-3">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex flex-col gap-2 w-20 flex-shrink-0">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    i === imgIdx ? "border-[#719378]" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Image principale */}
          <div
            className="flex-1 rounded-3xl overflow-hidden bg-[#c8d9cc] flex items-center justify-center"
            style={{ minHeight: 380 }}
          >
            {mainImg ? (
              <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl">👶</span>
            )}
          </div>
        </div>

        {/* Infos */}
        <div className="md:w-[45%] flex flex-col gap-4 py-4">
          {product.category && (
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: SAGE }}>
              {product.category}
            </span>
          )}

          <h1 className="text-2xl font-light text-gray-800 leading-snug">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold" style={{ color: SAGE }}>
              ${Number(product.price).toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${Number(product.oldPrice).toFixed(2)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
          )}

          {/* Stock badge */}
          {product.stock === 0 ? (
            <span className="inline-flex w-fit px-3 py-1 rounded-full bg-red-50 text-red-500 text-xs font-semibold">
              Out of stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="inline-flex w-fit px-3 py-1 rounded-full bg-orange-50 text-orange-500 text-xs font-semibold">
              Only {product.stock} left!
            </span>
          ) : (
            <span className="inline-flex w-fit px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
              ✓ In stock
            </span>
          )}

          {/* Quantité */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center rounded-full border border-gray-200 overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-semibold text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white text-sm font-bold transition-opacity disabled:opacity-50 cursor-pointer border-none"
              style={{ backgroundColor: SAGE }}
            >
              <ShoppingCart size={16} />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {/* Buy now */}
          <button
            disabled={product.stock === 0}
            className="w-full py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#719378] hover:text-[#719378] transition-colors disabled:opacity-50 cursor-pointer bg-white"
          >
            Buy Now
          </button>

          {/* Viewers */}
          <div className="flex items-center gap-2 opacity-50">
            <Eye size={14} className="animate-pulse" />
            <span className="text-xs">{viewers} people are viewing this</span>
          </div>
        </div>
      </div>

      {/* ── Tabs description/review ────────────────────────── */}
      <div className="border-t border-b border-gray-100 flex gap-4 px-6 py-3">
        {(["description", "review"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize cursor-pointer border-none ${
              tab === t
                ? "text-white"
                : "bg-transparent text-gray-500 hover:text-gray-800"
            }`}
            style={tab === t ? { backgroundColor: SAGE } : {}}
          >
            {t === "description" ? "Description" : "Reviews"}
          </button>
        ))}
      </div>

      <div className="px-6 py-6 min-h-[100px]">
        {tab === "description" ? (
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            {product.description || "No description available for this product."}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>

      {/* ── Produits liés ──────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 px-4 pb-10">
          <h2 className="text-2xl font-light text-center py-8">Related Products</h2>
          <div className="flex flex-wrap justify-center">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
