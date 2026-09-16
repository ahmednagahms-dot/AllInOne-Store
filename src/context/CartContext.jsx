import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  removeCoupon,
  clearCart,
} from "../api/cart.api";
import { toast } from "react-toastify";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      toast.error("تعذر تحميل السلة");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    try {
      const res = await addCartItem({ productId, quantity });
      setCart(res.data);
      toast.success("تمت الإضافة للسلة");
    } catch (err) {
      toast.error("تعذر إضافة المنتج للسلة");
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const res = await updateCartItem({ productId, quantity });
      setCart(res.data);
    } catch (err) {
      toast.error("تعذر تحديث الكمية");
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await removeCartItem(productId);
      setCart(res.data);
      toast.success("تم الحذف من السلة");
    } catch (err) {
      toast.error("تعذر حذف المنتج");
    }
  };

  const applyCartCoupon = async (code) => {
    try {
      const res = await applyCoupon({ code });
      setCart(res.data);
      toast.success("تم تطبيق الكوبون");
    } catch (err) {
      toast.error("كوبون غير صالح");
    }
  };

  const removeCartCoupon = async () => {
    try {
      const res = await removeCoupon();
      setCart(res.data);
    } catch (err) {
      toast.error("تعذر إزالة الكوبون");
    }
  };

  const clearAllCart = async () => {
    try {
      await clearCart();
      setCart(null);
      toast.success("تم إفراغ السلة");
    } catch (err) {
      toast.error("تعذر إفراغ السلة");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        applyCartCoupon,
        removeCartCoupon,
        clearAllCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);