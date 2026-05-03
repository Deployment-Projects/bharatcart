import { FaRegHeart } from "react-icons/fa";
import { useState } from "react";

// Import sample images from assets to demonstrate the hover swap
import defaultPrimaryImg from "../assets/products/necklace 3.png";
import defaultHoverImg from "../assets/products/model necklace 3.png";

const ProductCard = ({ product }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const formatImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("/")) return `http://localhost:8080${url}`;
    return url;
  };

  // Use product images if available, otherwise use the imported premium samples
  const primaryImage = formatImageUrl(product.imageUrl) || defaultPrimaryImg;
  const hoverImage = formatImageUrl(product.hoverImageUrl) || defaultHoverImg;

  return (
    <div className="group flex flex-col cursor-pointer w-full relative">

      {/* IMAGE CONTAINER */}
      <div className="relative w-full overflow-hidden bg-[#f9f9f9] aspect-square">
        
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.name || product.title}
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1000ms] ease-out ${!isButtonHovered ? 'group-hover:opacity-0' : ''} ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
        />

        {/* Secondary Hover Image */}
        <img
          src={hoverImage}
          alt={product.name || product.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1000ms] ease-out opacity-0 ${!isButtonHovered ? 'group-hover:opacity-100 group-hover:scale-105' : ''}`}
        />

        {/* Wishlist (Minimal Outline) */}
        <button className="absolute top-3 right-3 p-2 text-gray-400 hover:text-black transition-colors z-20 bg-white/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 duration-300">
          <FaRegHeart className="text-[18px]" />
        </button>

        {/* Add to cart Overlay - Prao Style Pill Button */}
        <div 
          className="absolute bottom-4 left-4 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-20"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          <button className="bg-[#f0eee4] text-gray-900 text-[14px] font-normal px-8 py-3.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.16)] transition-shadow duration-300">
            Add to cart
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-3 flex flex-col items-center text-center">
        {/* TITLE */}
        <h3 className="text-[13px] text-gray-800 line-clamp-1">
          {product.name || product.title}
        </h3>

        {/* PRICE */}
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[14px] text-gray-900 font-medium">
            ₹{product.price}
          </span>
          <span className="text-[12px] text-gray-500 line-through">
            ₹{product.price + 500}
          </span>
          <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wide">
            SAVE {Math.round((500 / (product.price + 500)) * 100)}%
          </span>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;