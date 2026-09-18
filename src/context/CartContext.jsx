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
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error(err);
      setError("تعذر تحميل السلة");
      toast.error("تعذر تحميل السلة");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // عدد العناصر في السلة (الـ API ممكن يرجع البيانات بأشكال مختلفة)
  const cartItems = cart?.items || cart?.products || [];
  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    if (!user) {
      toast.info("سجّل الدخول الأول عشان تضيف للسلة");
      return false;
    }
    try {
      const res = await addCartItem({ productId, quantity });
      setCart(res.data);
      toast.success("تمت الإضافة للسلة");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("تعذر إضافة المنتج للسلة");
      return false;
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const res = await updateCartItem({ productId, quantity });
      setCart(res.data);
      return true;
    } catch (err) {
      console.error(err);
      toast.error("تعذر تحديث الكمية");
      return false;
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await removeCartItem(productId);
      setCart(res.data);
      toast.success("تم الحذف من السلة");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("تعذر حذف المنتج");
      return false;
    }
  };

  const applyCartCoupon = async (code) => {
    try {
      const res = await applyCoupon({ code });
      setCart(res.data);
      toast.success("تم تطبيق الكوبون");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("كوبون غير صالح");
      return false;
    }
  };

  const removeCartCoupon = async () => {
    try {
      const res = await removeCoupon();
      setCart(res.data);
      return true;
    } catch (err) {
      console.error(err);
      toast.error("تعذر إزالة الكوبون");
      return false;
    }
  };

  const clearAllCart = async () => {
    try {
      await clearCart();
      setCart(null);
      toast.success("تم إفراغ السلة");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("تعذر إفراغ السلة");
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItemsCount,
        loading,
        error,
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