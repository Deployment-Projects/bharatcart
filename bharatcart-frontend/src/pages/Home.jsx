import HeroSection from "../components/HeroSection";
import StyleFinder from "../components/StyleFinder";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import api from "../api/axios";
import TrustStrip from "../components/TrustStrip";
import CategoryStrip from "../components/CategoryStrip";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [style, setStyle] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/products");
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  const filtered = (style
    ? products.filter(p =>
        p.category?.toLowerCase().includes(style)
      )
    : products
  ).sort((a, b) => b.price - a.price); // temp trending logic

  return (
    <div className="bg-[#f8f5f1] min-h-screen pb-8">
  
      {/* HERO */}
      <HeroSection />
  
      {/* MAIN CONTAINER (IMPORTANT FIX) */}
      <div className="max-w-[1400px] mx-auto space-y-1">
  
        {/* CATEGORY */}
        <div className="mt-1">
          <CategoryStrip />
        </div>
  
        {/* TRUST */}
        <div className="">
          <TrustStrip />
        </div>
  
        {/* PRODUCTS */}
        <div className="mt-6 px-2">
  
          <div className="flex justify-between items-center mt-3 mb-3">
            <h2 className="text-xl font-semibold">🔥 Trending Now</h2>
            <button className="text-sm text-gray-600 hover:text-black">
              View All →
            </button>
          </div>
  
          {/* 🔥 USE FILTERED (IMPORTANT FIX) */}
          <div className="grid grid-cols-5 gap-4">
  
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
  
          </div>
  
        </div>
  
      </div>
  
    </div>
  );
};

export default Home;
