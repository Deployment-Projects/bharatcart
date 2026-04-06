import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {

  const { addToCart, isInCart } = useCart();

  const navigate = useNavigate();

   const alreadyAdded = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (

    <div className="bg-white shadow-md p-4 rounded-lg transition duration-300 hover:scale-105 hover:shadow-xl">

      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="cursor-pointer"
      >

        <img
          src={product.imageUrl}
          alt=""
          className="w-full h-60 object-cover rounded-xl"
        />

        <h3 className="mt-5 text-lg font-semibold">
          {product.name}
        </h3>

      </div>

      <p className="text-green-600 font-bold text-xl mt-2">
        ₹ {product.price}
      </p>



      {
                alreadyAdded ? (
                    <button
                        onClick={() => navigate("/cart")}
                      className="bg-green-500 px-4 py-2 rounded transition duration-300 hover:scale-105 hover:bg-green-600"
                    >
                        Go to Cart
                    </button>
                ) : (
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-yellow-500 px-4 py-2 rounded transition duration-300 hover:scale-105 hover:bg-yellow-600"
                    >
                        Add to Cart
                    </button>
                )
            }

    </div>

  );

}