import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import InputField from "../components/InputField";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext";

export default function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();
  const { refreshCart } = useCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
            // 🔐 Login request
      const response = await api.post("/auth/login", {
        email,
        password
      });

      const token = response.data;

        // 🧠 Save token in context
      login(token, { email });

      // 🔥 CART MERGE LOGIC (put it HERE)
      const guestCart =
        JSON.parse(localStorage.getItem("guestCart"));

      if (import.meta.env.DEV) {
        console.log("guestCart before merge:", guestCart);
      }

      if (guestCart && guestCart.length > 0) {

        for (let item of guestCart) {
          const productId = item.productId ?? item.product?.id;
          const quantity = item.quantity ?? 1;

          if (!productId) {
            continue;
          }

          if (import.meta.env.DEV) {
            console.log("Merging guest item productId:", productId, "quantity:", quantity);
          }

          for (let i = 0; i < quantity; i += 1) {
            await api.post(`/cart/add/${productId}`);
          }
        }

        localStorage.removeItem("guestCart");
      }

      await refreshCart();

      // 🚀 Redirect to home
      navigate("/");
    } catch (error) {
      alert("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back 👋"
      subtitle="Login to continue shopping"
    >
      <form onSubmit={handleSubmit}>
        
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition mt-4"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 cursor-pointer font-medium"
          >
            Sign up
          </span>
        </p>

      </form>
    </AuthLayout>
  );
}