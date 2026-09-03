import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080";

const formatImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return url;
};

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // ── EMPTY STATE ──────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f4ef] px-4">
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🛒</p>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-400 mb-8 text-sm">
            Add some beautiful jewellery to get started
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white text-sm px-8 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ── CART PAGE ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f4ef] font-sans">
      {/* Page title */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-4">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          My Cart
        </h1>

        {/* ── TABLE HEADER ── */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-gray-300 pb-2 mb-2">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
            Product
          </span>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium text-center">
            Price
          </span>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium text-center">
            Quantity
          </span>
          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium text-right">
            Total
          </span>
        </div>

        {/* ── CART ITEMS ── */}
        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => {
            const productKey = item.productId ?? item.product?.id ?? "noprod";
            const key = item.id ?? `product-${productKey}`;

            const imageUrl =
              formatImageUrl(item.product?.cardImageUrl) ||
              formatImageUrl(item.product?.imageUrl) ||
              null;

            const itemTotal = item.product.price * item.quantity;

            return (
              <div
                key={key}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center py-5"
              >
                {/* ── PRODUCT COLUMN ── */}
                <div className="flex items-start gap-4">
                  {/* Clickable: image + name + meta → product detail */}
                  <div
                    className="flex items-start gap-4 cursor-pointer group/link flex-1"
                    onClick={() => {
                      const id = item.product?.id ?? item.productId;
                      if (id) navigate(`/product/${id}`);
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 flex-shrink-0 bg-white rounded overflow-hidden border border-gray-100 transition-opacity duration-200 group-hover/link:opacity-80">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Name + meta */}
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium text-gray-800 leading-snug group-hover/link:underline underline-offset-2">
                        {item.product.name}
                      </p>
                      {item.product.category && (
                        <p className="text-xs text-gray-500">
                          {item.product.category}
                        </p>
                      )}
                      {item.product.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 max-w-[220px]">
                          {item.product.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Remove — sits outside clickable zone */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFromCart(item); }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 underline underline-offset-2 mt-1 flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>

                {/* ── PRICE COLUMN ── */}
                <div className="text-center">
                  <span className="text-sm text-gray-700">
                    ₹{item.product.price?.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* ── QUANTITY STEPPER ── */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-150 text-base"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm text-gray-800 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-150 text-base"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ── TOTAL COLUMN ── */}
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-800">
                    ₹{itemTotal?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SUBTOTAL SUMMARY BOX ── */}
        <div className="mt-8 ml-auto max-w-sm bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm text-gray-500 uppercase tracking-widest font-medium border-b border-gray-100 pb-3">
            <span>Subtotal</span>
            <span className="text-gray-900 text-base font-semibold">
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Tax included. Shipping calculated at checkout.
          </p>

          {/* BUY NOW button */}
          <button
            className="w-full bg-black text-white text-sm font-medium py-3.5 rounded flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors duration-300"
            onClick={() => navigate("/checkout")}
          >
            BUY NOW
            <span className="text-lg leading-none">→</span>
          </button>

          {/* Minimum order notice */}
          {subtotal < 500 && (
            <p className="text-xs text-center text-red-500 font-medium">
              Minimum Order Value: ₹500
              <br />
              <span className="text-gray-400 font-normal">
                (Please add more products to complete your order)
              </span>
            </p>
          )}

          {/* Payment icons */}
          <div className="flex items-center justify-center gap-2 pt-1 opacity-60">
            {["VISA", "MC", "PayPal", "GPay", "UPI"].map((brand) => (
              <span
                key={brand}
                className="text-[9px] font-semibold text-gray-500 border border-gray-300 rounded px-1.5 py-0.5"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}