import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function Cart() {

  const {
    cartItems,
    updateQuantity,
    removeFromCart
  } = useCart();


  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="p-10 text-center">
          <h2 className="text-xl font-semibold">
            🛒 Your cart is empty
            Start shopping
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto py-10">

        <h2 className="text-2xl font-bold mb-6">
          My Cart
        </h2>

        {cartItems.map((item) => {
          const productKey = item.productId ?? item.product?.id ?? "noprod";
          const key = item.id ?? `product-${productKey}`;

          return (

          <div
            key={key}
            className="flex justify-between items-center border-b py-4"
          >

            <div>
              <h3 className="font-semibold">
                {item.product.name}
              </h3>

              <p className="text-gray-500">
                ₹ {item.product.price}
              </p>
            </div>


            {/* Quantity Controls */}
            <div className="flex items-center gap-3">

              <button
                onClick={() => updateQuantity(item, item.quantity - 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>

              <span className="font-medium">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQuantity(item, item.quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>

            </div>


            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item)}
              className="text-red-500"
            >
              Remove
            </button>

          </div>

          );
        })}

      </div>

    </div>
  );
}