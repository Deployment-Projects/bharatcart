import api from "../api/axios";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";

// const products = [
//   {
//     image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
//   },{
//     image: "https://images.unsplash.com/photo-1593784991095-a205069470b6"
//  },{
//     image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
//   }
// ];

export default function Home() {

  const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      console.log("Calling backend...");
      const response = await api.get("/products");
      console.log("Response:", response);
      setProducts(response.data);
    } catch (error) {
      console.log("Full error object:", error);
    }
  };

  fetchProducts();
}, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* <Navbar /> */}

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white text-center py-24">
        <h1 className="text-5xl font-bold mb-6">
          Shop Smart. Shop BharatCart.
        </h1>
        <p className="text-xl mb-8">
          Best Prices | Fast Delivery | Cash on Delivery
        </p>
        <button className="bg-accent px-8 py-3 rounded-lg text-lg hover:bg-orange-600 transition transform hover:scale-105">
          Explore Products
        </button>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}