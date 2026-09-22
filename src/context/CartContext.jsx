import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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
      setError("Failed to load cart");
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [user]);

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
      toast.info("Please log in first to add items to cart");
      return false;
    }
    try {
      const res = await addCartItem({ productId, quantity });
      setCart(res.data);
      toast.success("Added to cart");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to add item to cart"
      );
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
      toast.error(
        err.response?.data?.message || "Failed to update quantity"
      );
      return false;
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await removeCartItem(productId);
      setCart(res.data);
      toast.success("Removed from cart");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to remove item"
      );
      return false;
    }
  };

  const applyCartCoupon = async (code) => {
    try {
      const res = await applyCoupon({ code });
      setCart(res.data);
      toast.success("Coupon applied");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Invalid coupon"
      );
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
      toast.error(
        err.response?.data?.message || "Failed to remove coupon"
      );
      return false;
    }
  };

  const clearAllCart = async () => {
    try {
      await clearCart();
      setCart({ items: [] });
      toast.success("Cart cleared");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to clear cart"
      );
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