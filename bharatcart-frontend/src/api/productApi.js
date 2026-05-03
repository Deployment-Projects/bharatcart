import api from "./axios";

export const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const uploadProductImages = async (imageFile, hoverImageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  if (hoverImageFile) {
    formData.append("hoverImage", hoverImageFile);
  }

  const response = await api.post("/products/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};