import { FaHeart, FaStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-transparent">

      {/* IMAGE */}
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-[180px] object-cover rounded-lg"
        />

        {/* Wishlist */}
        <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
          <FaHeart className="text-gray-400 text-sm" />
        </div>

        {/* Fake Discount */}
        <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
          50% OFF
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-2 space-y-1">

        {/* TITLE */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
          {product.title}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-1 text-yellow-500 text-xs">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} />
          ))}
          <span className="text-gray-500 ml-1 text-[11px]">
            (1,299)
          </span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-md font-semibold text-black">
            ₹{product.price}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹{product.price + 500}
          </span>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;