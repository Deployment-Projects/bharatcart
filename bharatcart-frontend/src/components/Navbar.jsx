import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", search);
  };

  return (
    <nav className="bg-white/70 backdrop-blur-md shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* Logo */}
      <Link
  to="/"
  className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text"
>
  BharatCart
</Link>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3"
      >
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search for products..."
          className="bg-transparent outline-none ml-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>


      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Login / Logout */}
        {user ? (
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-500 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
          className="transition duration-300 hover:scale-105 hover:text-blue-600"
          >
            Login
          </Link>
        )}
        {/* Cart Icon */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer transition duration-300 hover:scale-110"
        >
          <ShoppingCart size={24} />

          {/* 🔥 Cart Count Badge */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {cartCount}
            </span>
          )}
        </div>

      </div>
    </nav>
  );
}