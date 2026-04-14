import HeroSection from "../components/HeroSection";
import StyleFinder from "../components/StyleFinder";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import api from "../api/axios";
import TrustStrip from "../components/TrustStrip";

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
    <div className="space-y-10">
      {/* 🔥 1. HERO (TOP MOST) */}
      <HeroSection />

      {/* 🔥 2. TRUST STRIP (just below hero) */}
      <TrustStrip />

      {/* 🔥 3. STYLE FINDER */}
      <StyleFinder onSelect={setStyle} />

      {/* PRODUCTS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Trending Jewellery</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
