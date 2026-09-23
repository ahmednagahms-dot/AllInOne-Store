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
      // API returns: { success, totalProducts, wishlist: { _id, user, products: [...] } }
      const list =
        data.wishlist?.products ||
        data.items ||
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

  const [togglingIds, setTogglingIds] = useState(new Set());

  const addItem = async (productId) => {
    if (!user) {
      toast.info("Please log in first to add to wishlist");
      return false;
    }
    // Prevent duplicate adds
    if (isInWishlist(productId)) return true;
    // Optimistic: add placeholder immediately
    setItems((prev) => [...prev, { _id: productId }]);
    try {
      await addToWishlist(productId);
      // Sync with server to get full product data
      await fetchWishlist();
      return true;
    } catch (err) {
      // Rollback on error
      setItems((prev) => prev.filter((item) => item._id !== productId));
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to add to wishlist"
      );
      return false;
    }
  };

  const removeItem = async (productId) => {
    // Optimistic: remove immediately
    const prevItems = items;
    setItems((prev) =>
      prev.filter(
        (item) =>
          (item.product?._id || item.productId || item._id) !== productId
      )
    );
    try {
      await removeFromWishlist(productId);
      return true;
    } catch (err) {
      // Rollback on error
      setItems(prevItems);
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to remove from wishlist"
      );
      return false;
    }
  };

  const toggleItem = async (productId) => {
    // Prevent rapid double-clicks from causing race conditions
    if (togglingIds.has(productId)) return false;
    setTogglingIds((prev) => new Set(prev).add(productId));
    try {
      return isInWishlist(productId)
        ? await removeItem(productId)
        : await addItem(productId);
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
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