import { FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import defaultPrimaryImg from "../assets/default-products/necklace 3.png";
import defaultHoverImg from "../assets/default-products/model necklace 3.png";

const BASE_URL = "http://localhost:8080";

const formatImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("/")) return `${BASE_URL}${url}`;
  return url;
};

const ProductCard = ({ product }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const navigate = useNavigate();

  // Prefer new structured fields, fall back to legacy imageUrl, then local defaults
  const primaryImage =
    formatImageUrl(product.cardImageUrl) ||
    formatImageUrl(product.imageUrl) ||
    defaultPrimaryImg;

  const hoverImage =
    formatImageUrl(product.hoverImageUrl) || defaultHoverImg;

  const handleCardClick = () => {
    if (product.id) navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="group flex flex-col cursor-pointer w-full relative"
      onClick={handleCardClick}
    >
      {/* IMAGE CONTAINER — square ratio matching Prao */}
      <div className="relative w-full overflow-hidden bg-[#f9f9f9] aspect-square">

        {/* Primary (card) Image */}
        <img
          src={primaryImage}
          alt={product.name || product.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-all duration-[900ms] ease-out
            ${!isButtonHovered ? "group-hover:opacity-0" : ""}
            ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
          `}
        />

        {/* Hover Image (lazy, preloaded on hover via CSS) */}
        <img
          src={hoverImage}
          alt={product.name || product.title}
          loading="lazy"
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-all duration-[900ms] ease-out
            opacity-0
            ${!isButtonHovered ? "group-hover:opacity-100 group-hover:scale-105" : ""}
          `}
        />

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-black transition-colors z-20 bg-white/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 duration-300"
          onClick={(e) => { e.stopPropagation(); }}
          aria-label="Add to wishlist"
        >
          <FaRegHeart className="text-[16px]" />
        </button>

        {/* Add to Cart — Pill Button */}
        <div
          className="absolute bottom-4 left-4 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-20"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          <button
            className="bg-[#f0eee4] text-gray-900 text-[13px] font-normal px-7 py-3 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-shadow duration-300 whitespace-nowrap"
            onClick={(e) => { e.stopPropagation(); }}
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-3 flex flex-col items-center text-center">
        <h3 className="text-[13px] text-gray-800 line-clamp-1">
          {product.name || product.title}
        </h3>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[14px] text-gray-900 font-medium">
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
          <span className="text-[12px] text-gray-400 line-through">
            ₹{(product.price + 500)?.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
            SAVE {Math.round((500 / (product.price + 500)) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;