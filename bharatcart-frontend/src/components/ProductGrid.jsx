import { useEffect, useState } from "react";
import axios from "../api/axios";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto mt-8">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">🔥 Trending Now</h2>
        <button className="text-sm text-gray-600">View All →</button>
      </div>

      <div className="grid grid-cols-5 gap-4">

        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">

            <img src={p.imageUrl} className="h-40 w-full object-cover" />

            <div className="p-3">
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-orange-600 font-semibold mt-1">₹{p.price}</p>

              <button className="mt-2 w-full bg-yellow-400 py-1 rounded-md text-sm">
                Add to Cart
              </button>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default ProductGrid;