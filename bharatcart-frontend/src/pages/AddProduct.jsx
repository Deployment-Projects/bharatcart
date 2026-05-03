import { useState } from "react";
import { uploadProductImages, createProduct } from "../api/productApi";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [hoverImage, setHoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please provide at least a primary image.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // 1. Upload Images
      const uploadedImages = await uploadProductImages(image, hoverImage);
      
      // 2. Create Product
      const productPayload = {
        ...formData,
        price: parseFloat(formData.price),
        imageUrl: uploadedImages.imageUrl,
        hoverImageUrl: uploadedImages.hoverImageUrl || null,
      };

      await createProduct(productPayload);
      alert("Product added successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Product</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
            placeholder="e.g., Elegant Gold Necklace"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none transition"
              placeholder="999"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none transition"
              placeholder="e.g., necklace"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 outline-none transition resize-none"
            placeholder="Product details..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image *</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hover Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHoverImage(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-black transition-colors disabled:bg-gray-400"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
