import { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState("");
  const { token } = useAuth();
  const refreshRequestRef = useRef(0);

  const getToken = () => localStorage.getItem("token");
  const normalizeItem = (item) => ({
    ...item,
    id: item?.id ?? null,
    productId: item?.productId ?? item?.product?.id ?? null,
  });
  const sortItemsStable = (items) =>
    [...items].sort((a, b) => {
      const aId = Number(a?.id ?? Number.MAX_SAFE_INTEGER);
      const bId = Number(b?.id ?? Number.MAX_SAFE_INTEGER);

      if (aId !== bId) return aId - bId;

      const aProductId = Number(
        a?.productId ?? a?.product?.id ?? Number.MAX_SAFE_INTEGER,
      );
      const bProductId = Number(
        b?.productId ?? b?.product?.id ?? Number.MAX_SAFE_INTEGER,
      );
      return aProductId - bProductId;
    });

  const refreshCart = async () => {
    const requestId = ++refreshRequestRef.current;
    const effectiveToken = getToken();
    // Guest cart
    if (!effectiveToken) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      if (requestId === refreshRequestRef.current) {
        setCartItems(sortItemsStable(guestCart.map(normalizeItem)));
      }
      return;
    }

    // Logged user cart
    try {
      const response = await api.get("/cart");
      if (import.meta.env.DEV) {
        console.log("GET /cart response.data:", response.data);
      }
      const normalizedItems = (response.data?.items ?? []).map(normalizeItem);
      if (requestId === refreshRequestRef.current) {
        setCartItems(sortItemsStable(normalizedItems));
      }
    } catch {
      console.log("Cart load failed");
    }
  };

  // Load/reload cart when auth changes (login/logout)
  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Add to cart
  const addToCart = async (product) => {
    const effectiveToken = getToken();

    // Guest user
    if (!effectiveToken) {
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      const existing = guestCart.find(
        (item) => (item.productId ?? item.product?.id) === product.id,
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        guestCart.push({
          productId: product.id,
          product,
          quantity: 1,
        });

        setToast("Added to Cart ✅");
        setTimeout(() => setToast(""), 2000);
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(sortItemsStable(guestCart.map(normalizeItem)));
      return;
    }

    // Logged user
    await api.post(`/cart/add/${product.id}`);
    await refreshCart();

    setToast("Added to Cart ✅");
    setTimeout(() => setToast(""), 2000);
  };

  // Remove item
  const removeFromCart = async (item) => {
    const effectiveToken = getToken();

    if (!effectiveToken) {
      const updated = cartItems.filter(
        (i) =>
          (i.productId ?? i.product?.id) !==
          (item.productId ?? item.product?.id),
      );

      localStorage.setItem("guestCart", JSON.stringify(updated));
      setCartItems(sortItemsStable(updated.map(normalizeItem)));

      return;
    }

    if (!item.id) {
      const productId = item.productId ?? item.product?.id;
      if (!productId) {
        console.log("Cannot remove item: missing cart item id and product id");
        return;
      }

      await api.delete(`/cart/remove/by-product/${productId}`);
      await refreshCart();
      return;
    }

    await api.delete(`/cart/remove/${item.id}`);
    await refreshCart();
  };

  // Update quantity
  const updateQuantity = async (item, qty) => {
    const effectiveToken = getToken();

    if (qty < 1) return;

    if (!effectiveToken) {
      const updated = cartItems.map((i) =>
        (i.productId ?? i.product?.id) === (item.productId ?? item.product?.id)
          ? { ...i, quantity: qty }
          : i,
      );

      localStorage.setItem("guestCart", JSON.stringify(updated));
      setCartItems(sortItemsStable(updated.map(normalizeItem)));

      return;
    }

    if (!item.id) {
      const productId = item.productId ?? item.product?.id;
      if (!productId) {
        console.log(
          "Cannot update quantity: missing cart item id and product id",
        );
        return;
      }
      await api.put(`/cart/update/by-product/${productId}?quantity=${qty}`);
      await refreshCart();
      return;
    }

    await api.put(`/cart/update/${item.id}?quantity=${qty}`);
    await refreshCart();
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isInCart = (productId) => {
    return cartItems.some(
      (item) => (item.productId ?? item.product?.id) === productId,
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        refreshCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        isInCart,
      }}
    >
      {children}
      {/* ✅ TOAST UI HERE */}
      {toast && <Toast message={toast} />}
    </CartContext.Provider>
  );
};
