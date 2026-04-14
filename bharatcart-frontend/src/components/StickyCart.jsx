import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const StickyCart = () => {

  const { cartCount } = useCart();
  const navigate = useNavigate();

  if (cartCount === 0) return null;

  return (
    <div
      onClick={() => navigate("/cart")}
      className="fixed bottom-0 left-0 right-0 bg-yellow-400 text-black py-3 text-center font-medium cursor-pointer shadow-lg"
    >
      View Cart ({cartCount})
    </div>
  );
};

export default StickyCart;