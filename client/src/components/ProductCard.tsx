import { Link } from "react-router-dom";
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
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-img-wrapper">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="product-img-placeholder">👶</div>
          )}
          {product.stock === 0 && (
            <span className="badge-out">Out of stock</span>
          )}
        </div>
      </Link>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-price-row">
          <span className="product-price">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="product-old-price">
              ${Number(product.oldPrice).toFixed(2)}
            </span>
          )}
        </div>
        {showAddToCart && product.stock > 0 && (
          <button className="btn-add-cart" onClick={() => addItem(product)}>
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
