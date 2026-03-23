import { useCart } from "../../hooks/useCart";
import { Link } from "react-router-dom";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../../types";

export default function CartSidebar() {
  const { items, count, total, isOpen, closeCart, removeItem, updateQty } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#719378]" />
            <h2 className="text-base font-semibold text-gray-800">
              Cart
              <span className="ml-1.5 text-sm font-normal text-gray-500">
                ({count} item{count !== 1 ? "s" : ""})
              </span>
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer text-gray-500 hover:text-gray-800"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                <ShoppingBag size={36} className="text-gray-300" />
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-1">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add some products to get started!</p>
              </div>
              <Link
                to="/shop"
                onClick={closeCart}
                className="w-full py-3 rounded-full bg-[#719378] text-white text-sm font-bold text-center no-underline hover:opacity-85 transition-opacity"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 px-4 py-2 list-none m-0">
              {items.map((item: CartItem) => (
                <li key={item.product.id} className="flex items-start gap-3 py-4">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👶</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm font-bold text-[#719378] mt-0.5">
                      ${Number(item.product.price).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Sous-total + delete */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-gray-800">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1.5 rounded-full hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 flex flex-col gap-3 bg-gray-50/50">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal ({count} items)</span>
              <span className="font-medium text-gray-700">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="text-xl font-bold text-[#719378]">${total.toFixed(2)}</span>
            </div>
            <button className="w-full py-3.5 rounded-full bg-[#719378] text-white text-sm font-bold hover:opacity-85 transition-opacity cursor-pointer border-none mt-1">
              Checkout →
            </button>
            <Link
              to="/shop"
              onClick={closeCart}
              className="w-full py-3 rounded-full border border-gray-200 text-sm font-medium text-gray-700 text-center no-underline hover:bg-gray-100 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
