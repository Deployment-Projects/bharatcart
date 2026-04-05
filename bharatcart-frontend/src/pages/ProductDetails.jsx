import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function ProductDetails() {

  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch product from backend
  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const response = await api.get(`/products/${id}`);

        setProduct(response.data);

      } catch (error) {

        console.log("Failed to load product");

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);


  if (loading) {

    return (
      <div>
        <Navbar />
        <div className="text-center py-20">
          Loading product...
        </div>
      </div>
    );

  }

  if (!product) {

    return (
      <div>
        <Navbar />
        <div className="text-center py-20">
          Product Not Found
        </div>
      </div>
    );

  }

  return (

    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-16">

        {/* Image */}
        <div>

          <img
            src={product.imageUrl}
            alt={product.name}
            className="rounded-2xl shadow-lg"
          />

        </div>

        {/* Details */}
        <div>

          <h1 className="text-4xl font-bold mb-6">
            {product.name}
          </h1>

          <p className="text-green-600 text-3xl font-bold mb-6">
            ₹ {product.price}
          </p>

          <p className="text-gray-600 mb-8">
            {product.description}
          </p>

          <div className="flex gap-6">

            <button
              onClick={() => addToCart(product)}
              className="bg-accent text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Add to Cart
            </button>

            <button
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Buy Now
            </button>

          </div>

          <div className="mt-10 p-6 bg-white rounded-xl shadow">

            <p className="font-semibold">Delivery:</p>
            <p>Free delivery in 3-5 days</p>
            <p>Cash on Delivery Available</p>

          </div>

        </div>

      </div>

    </div>

  );

}