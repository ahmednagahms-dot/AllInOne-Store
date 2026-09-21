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
      // API may return data in different shapes
      const list =
        data.items ||
        data.wishlist ||
        data.products ||
        data.data?.items ||
        data.data ||
        data ||
        [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load wishlist");
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Set of product IDs in wishlist (for fast lookup)
  const wishlistIds = useMemo(() => {
    return new Set(
      items.map(
        (item) => item.product?._id || item.productId || item._id
      )
    );
  }, [items]);

  const isInWishlist = useCallback(
    (productId) => wishlistIds.has(productId),
    [wishlistIds]
  );

  const addItem = async (productId) => {
    if (!user) {
      toast.info("Please log in first to add to wishlist");
      return false;
    }
    try {
      await addToWishlist(productId);
      await fetchWishlist();
      toast.success("Added to wishlist");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to add to wishlist"
      );
      return false;
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      await fetchWishlist();
      toast.success("Removed from wishlist");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to remove from wishlist"
      );
      return false;
    }
  };

  const toggleItem = (productId) => {
    return isInWishlist(productId)
      ? removeItem(productId)
      : addItem(productId);
  };

  const clearAllWishlist = async () => {
    try {
      await clearWishlist();
      setItems([]);
      toast.success("Wishlist cleared");
      return true;
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to clear wishlist"
      );
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