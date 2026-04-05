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

    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 p-5">

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
                        className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        Go to Cart
                    </button>
                ) : (
                    <button
                        onClick={() => addToCart(product)}
                        className="mt-6 w-full bg-accent text-white py-2 rounded-lg hover:bg-orange-600 transition"
                    >
                        Add to Cart
                    </button>
                )
            }

    </div>

  );

}