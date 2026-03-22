import { useCart } from "../../hooks/useCart";
import type { CartItem } from "../../types";

export default function CartSidebar() {
  const { items, count, total, isOpen, closeCart, removeItem, updateQty } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="opacity-shop" onClick={closeCart} />

      {/* Sidebar */}
      <div className={`ct-shop ${isOpen ? "open" : ""}`}>
        <div className="ct-shop-info">
          {/* Header */}
          <div className="h-shop">
            <div className="h-ct-w">
              <p>Shopping Cart({count})</p>
            </div>
            <div>
              <button
                id="cancel-shop"
                className="material-icons-outlined"
                aria-label="Close cart"
                onClick={closeCart}
              >
                close
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="ct-buying">
            {items.length === 0 ? (
              <>
                <div className="h-ct-w p">
                  <p>Your cart is currently empty.</p>
                </div>
                <div className="ctn-btn">
                  <a href="/shop">
                    <button className="btn" onClick={closeCart}>
                      Show all products
                    </button>
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="content-panier-trash">
                  {items.map((item: CartItem) => (
                    <div key={item.product.id} className="panier-item">
                      {/* Image */}
                      <div className="panier-img">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                          />
                        ) : (
                          <div className="panier-img-placeholder">👶</div>
                        )}
                      </div>
                      {/* Infos */}
                      <div className="panier-details">
                        <p className="panier-name">{item.product.name}</p>
                        <p className="panier-price">
                          {Number(item.product.price).toFixed(2)} €
                        </p>
                        <div className="panier-qty">
                          <button
                            onClick={() =>
                              updateQty(item.product.id, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQty(item.product.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {/* Supprimer */}
                      <button
                        className="panier-remove material-icons-outlined"
                        aria-label="Remove item"
                        onClick={() => removeItem(item.product.id)}
                      >
                        close
                      </button>
                    </div>
                  ))}
                </div>

                {/* Total + Checkout */}
                <div className="panier-footer">
                  <div className="panier-total">
                    <span>Total:</span>
                    <strong>{total.toFixed(2)} €</strong>
                  </div>
                  <div className="ctn-btn">
                    <a href="/shop">
                      <button className="btn" onClick={closeCart}>
                        Continue shopping
                      </button>
                    </a>
                    <button className="buy">Checkout</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
