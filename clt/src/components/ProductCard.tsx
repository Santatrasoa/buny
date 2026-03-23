import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../hooks/useCart";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({
  product,
  showAddToCart = true,
}: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col w-52 m-3">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block no-underline">
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-green-50 text-6xl">
              👶
            </div>
          )}

          {/* Badge out of stock */}
          {product.stock === 0 && (
            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              Out of stock
            </span>
          )}

          {/* Badge promo */}
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="absolute top-2.5 right-2.5 bg-[#719378] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
        </div>
      </Link>

      {/* Infos */}
      <div className="pt-2.5 px-1 flex flex-col gap-1">
        {product.category && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {product.category}
          </p>
        )}

        <Link to={`/products/${product.id}`} className="no-underline">
          <h3 className="text-sm font-medium text-gray-800 leading-snug hover:text-[#719378] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-base font-bold text-[#719378]">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              ${Number(product.oldPrice).toFixed(2)}
            </span>
          )}
        </div>

        {showAddToCart && product.stock > 0 && (
          <button
            onClick={() => addItem(product)}
            className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-full bg-[#719378] text-white text-xs font-bold hover:opacity-85 transition-opacity cursor-pointer border-none"
          >
            <ShoppingCart size={13} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
