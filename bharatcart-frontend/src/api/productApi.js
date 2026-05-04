import api from "./axios";

export const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

/**
 * Upload all product images in one multipart request.
 *
 * @param {File}   cardImage      - Required. Optimized card thumbnail (4:5).
 * @param {File}   hoverImage     - Optional. Lifestyle/model image (4:5).
 * @param {File[]} detailImages   - Optional. Array of high-res gallery images.
 * @returns {{ cardImageUrl, hoverImageUrl, detailImageUrls, imageUrl }}
 */
export const uploadProductImages = async (cardImage, hoverImage, detailImages = []) => {
  const formData = new FormData();
  formData.append("cardImage", cardImage);

  if (hoverImage) {
    formData.append("hoverImage", hoverImage);
  }

  detailImages.forEach((file) => {
    formData.append("detailImages", file);
  });

  const response = await api.post("/products/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};