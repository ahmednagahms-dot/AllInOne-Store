import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../api/wishlist.api";
import { toast } from "react-toastify";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyWishlist();
      // الـ API ممكن يرجع البيانات بأشكال مختلفة
      const list = data.items || data.wishlist || data.products || data || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setError("تعذر تحميل المفضلة");
      toast.error("تعذر تحميل المفضلة");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // مجموعة IDs للمنتجات الموجودة في المفضلة، عشان نعرف نعرض قلب ممتلئ ولا لأ بسرعة
  const wishlistIds = useMemo(() => {
    return new Set(
      items.map((item) => item.product?._id || item.productId || item._id)
    );
  }, [items]);

  const isInWishlist = useCallback(
    (productId) => wishlistIds.has(productId),
    [wishlistIds]
  );

  const addItem = async (productId) => {
    if (!user) {
      toast.info("سجّل الدخول الأول عشان تضيف للمفضلة");
      return false;
    }
    try {
      await addToWishlist(productId);
      await fetchWishlist();
      toast.success("تمت الإضافة للمفضلة");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("تعذر إضافة المنتج للمفضلة");
      return false;
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      await fetchWishlist();
      toast.success("تم الحذف من المفضلة");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("تعذر حذف المنتج من المفضلة");
      return false;
    }
  };

  const toggleItem = (productId) => {
    return isInWishlist(productId) ? removeItem(productId) : addItem(productId);
  };

  const clearAllWishlist = async () => {
    try {
      await clearWishlist();
      setItems([]);
      toast.success("تم إفراغ المفضلة");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("تعذر إفراغ المفضلة");
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        loading,
        error,
        fetchWishlist,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearAllWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);