import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, Check } from "lucide-react";

const BASE_URL = "http://localhost:8080";

const formatImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return url;
};

// Reusable mini cart item row
function CartItemRow({ item, onNavigate, updateQuantity, removeFromCart }) {
  const imageUrl =
    formatImageUrl(item.product?.cardImageUrl) ||
    formatImageUrl(item.product?.imageUrl) ||
    null;
  const productId = item.product?.id ?? item.productId;

  return (
    <div className="flex gap-3 items-start">
      {/* Thumbnail */}
      <div
        className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded overflow-hidden border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onNavigate(productId)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-xs">
            No img
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm text-gray-800 font-medium leading-snug line-clamp-2 cursor-pointer hover:underline underline-offset-2"
          onClick={() => onNavigate(productId)}
        >
          {item.product.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          ₹{item.product.price?.toLocaleString("en-IN")}
        </p>

        {/* Qty stepper + remove */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-gray-200 rounded text-sm">
            <button
              onClick={() => updateQuantity(item, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              −
            </button>
            <span className="w-6 text-center text-gray-800 select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeFromCart(item)}
            className="text-xs text-gray-300 hover:text-red-400 transition-colors underline underline-offset-2"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Line total */}
      <p className="text-sm font-medium text-gray-800 flex-shrink-0">
        ₹{(item.product.price * item.quantity)?.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export default function CartDrawer() {
  const {
    cartItems,
    cartCount,
    updateQuantity,
    removeFromCart,
    isDrawerOpen,
    closeDrawer,
    lastAddedProduct,
  } = useCart();

  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleNavigate = (productId) => {
    closeDrawer();
    navigate(`/product/${productId}`);
  };

  const handleViewCart = () => {
    closeDrawer();
    navigate("/cart");
  };

  const handleCheckout = () => {
    closeDrawer();
    navigate("/checkout");
  };

  // Split: just-added item vs the rest
  const justAddedItem = lastAddedProduct
    ? cartItems.find(
        (i) => (i.product?.id ?? i.productId) === lastAddedProduct.id
      )
    : null;

  const otherItems = justAddedItem
    ? cartItems.filter(
        (i) => (i.product?.id ?? i.productId) !== lastAddedProduct.id
      )
    : [...cartItems].reverse(); // newest first when no just-added context

  return (
    <>
      {/* ── BACKDROP ── */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* ── DRAWER PANEL ── */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[70] shadow-2xl
          flex flex-col transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-gray-700" />
            <h2 className="text-base font-semibold text-gray-800">
              My Cart
              {cartCount > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({cartCount} {cartCount === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-800"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── EMPTY STATE ── */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag size={48} className="text-gray-200" />
            <p className="text-gray-500 text-sm">Your cart is empty</p>
            <button
              onClick={closeDrawer}
              className="mt-2 text-xs underline underline-offset-2 text-gray-400 hover:text-gray-600"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">

              {/* ── JUST ADDED ZONE ── */}
              {justAddedItem && (
                <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
                  {/* Zone header */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Check size={10} strokeWidth={3} className="text-white" />
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      Just added to your cart
                    </span>
                  </div>

                  {/* Just-added item row */}
                  <CartItemRow
                    item={justAddedItem}
                    onNavigate={handleNavigate}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                </div>
              )}

              {/* ── REST OF CART ── */}
              {otherItems.length > 0 && (
                <div className="px-6 py-4 space-y-4">
                  {justAddedItem && (
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium pb-1 border-b border-gray-100">
                      Also in your cart
                    </p>
                  )}
                  {otherItems.map((item) => {
                    const productKey =
                      item.productId ?? item.product?.id ?? "noprod";
                    const key = item.id ?? `product-${productKey}`;
                    return (
                      <CartItemRow
                        key={key}
                        item={item}
                        onNavigate={handleNavigate}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── FOOTER ── */}
            <div className="border-t border-gray-100 px-6 py-5 space-y-3 bg-white">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 uppercase tracking-widest text-xs font-medium">
                  Subtotal
                </span>
                <span className="text-gray-900 font-semibold text-base">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <p className="text-[11px] text-gray-400">
                Tax included. Shipping calculated at checkout.
              </p>

              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white text-sm font-medium py-3 rounded hover:bg-gray-900 transition-colors duration-300"
              >
                Checkout
              </button>
              <button
                onClick={handleViewCart}
                className="w-full bg-white text-gray-700 text-sm font-medium py-2.5 rounded border border-gray-200 hover:bg-gray-50 transition-colors duration-300"
              >
                View Full Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
