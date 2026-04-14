import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    return saved.includes(product.id);
  });

  const added = isInCart(product.id);

  const toggleWishlist = () => {
    let saved = JSON.parse(localStorage.getItem("wishlist")) || [];
  
    if (saved.includes(product.id)) {
      saved = saved.filter(id => id !== product.id);
      setWishlisted(false);
    } else {
      saved.push(product.id);
      setWishlisted(true);
    }
  
    localStorage.setItem("wishlist", JSON.stringify(saved));
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* ❤️ WISHLIST */}
      <div
        onClick={toggleWishlist}
        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer z-10"
      >
        {wishlisted ? "❤️" : "🤍"}
      </div>

      {/* 🖼 IMAGE */}
      <div className="h-56 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition duration-500 ${
            hovered ? "scale-110" : "scale-100"
          }`}
        />
      </div>

      {/* 📄 CONTENT */}
      <div className="p-4 space-y-2">

        <h3 className="font-medium text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        {/* ⭐ RATING */}
        <div className="text-yellow-500 text-sm">
          ⭐⭐⭐⭐☆ <span className="text-gray-500">(84)</span>
        </div>

        {/* 💰 PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price}
          </span>
          <span className="text-sm line-through text-gray-400">
            ₹{Math.floor(product.price * 1.4)}
          </span>
        </div>

        {/* ⚡ BUTTON */}
        {
          added ? (
            <button
              onClick={() => navigate("/cart")}
              className="w-full bg-green-600 text-white py-2 rounded-md mt-2 transition hover:bg-green-700"
            >
              Go to Cart
            </button>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-yellow-400 text-black py-2 rounded-md mt-2 transition hover:bg-yellow-500 active:scale-95"
            >
              Buy Now
            </button>
          )
        }

      </div>
    </div>
  );
};

export default ProductCard;
