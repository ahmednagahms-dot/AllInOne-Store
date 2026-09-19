import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart as CartIcon,
  Trash2,
  Heart,
  Lock,
  RotateCcw,
  MessageCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
} from "../../api/cart.api"; 

/* =========================================================
   استخراج الـ cart من أي شكل رد
========================================================= */
function extractCart(response) {
  const data = response?.data ?? response;

  // نلاقي الـ cart object
  const cart = data?.cart ?? data?.data?.cart ?? data?.data ?? data;

  // نلاقي الـ items array
  const items =
    cart?.items ??
    cart?.cartItems ??
    cart?.products ??
    data?.items ??
    [];

  return {
    cart,
    items: Array.isArray(items) ? items : [],
    coupon: cart?.coupon || null,
    couponCode: cart?.couponCode || null,
    discount: Number(cart?.discount) || 0,
    couponError: cart?.couponError || null,
  };
}

/* =========================================================
   استخراج بيانات منتج من عنصر cart
========================================================= */
function normalizeItem(item) {
  const product = item.product || item;
  const id = product._id || product.id || item.productId || item._id;

  // الصورة
  const images = product.images || item.images;
  const rawImg =
    (Array.isArray(images) && images[0]) ||
    product.image ||
    item.image ||
    item.img ||
    null;

  const img =
    typeof rawImg === "string"
      ? rawImg
      : rawImg?.url||  rawImg?.path || null;

  return {
    id,
    name: product.name||  product.title||  item.name || "منتج",
    brand: product.brand || product.category || item.brand || "",
    desc:
      item.variant ||
      item.description ||
      product.description ||
      "",
    price: Number(item.price ?? product.price) || 0,
    oldPrice: Number(product.oldPrice || product.comparePrice) || 0,
    qty: Number(item.quantity ?? item.qty) || 1,
    img,
    stock: product.stock,
    stockStatus:
      typeof product.stock === "number"
        ? product.stock === 0
          ? "Out of stock"
          : product.stock < 5
          ? "Low stock"
          : "In stock"
        : item.stock || "In stock",
    discount: product.discount || 0,
  };
}

/* =========================================================
   مكوّن بسيط لعرض حالة (Empty/Loading/Error)
========================================================= */
function StateCard({ title, children }) {
  return (
    <div className="rounded-xl border bg-white p-6 text-center">
      <p className="mb-4 text-left text-[11px] font-bold text-gray-500">
        {title}
      </p>
      {children}
    </div>
  );
}

/* =========================================================
   المكوّن الرئيسي
========================================================= */
export default function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState(null); // { type: "success"|"error", text }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  /* =========================================================
     جلب السلة
  ========================================================= */
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCart();
      const { items: raw, coupon: c } = extractCart(res);
      setItems(raw.map(normalizeItem));
      setCoupon(c);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setError("تعذر تحميل السلة");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  /* =========================================================
     الإجماليات
  ========================================================= */
  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const oldSubtotal = items.reduce(
      (s, i) => s + (i.oldPrice || i.price) * i.qty,
      0
    );

    const productDiscount = oldSubtotal - subtotal;
    const couponDiscount = `coupon?.discountAmount  coupon?.discount  0`;
    const discount = productDiscount + couponDiscount;

    const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal - couponDiscount + shipping + tax;

    return {
      subtotal,
      discount,
      couponDiscount,
      shipping,
      tax,
      total: Math.max(0, total),
      count: items.reduce((s, i) => s + i.qty, 0),
    };
  }, [items, coupon]);

  /* =========================================================
     تعديل الكمية
  ========================================================= */
  const handleUpdateQty = async (id, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(id);

    // Optimistic update
    const prev = items;
    setItems((list) =>
      list.map((i) => (i.id === id ? { ...i, qty: newQty } : i))
    );

    try {
      await updateCartItem({ productId: id, quantity: newQty });
    } catch (err) {
      console.error(err);
      setItems(prev); // rollback
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     حذف عنصر
  ========================================================= */
  const handleRemove = async (id) => {
    setUpdatingId(id);
    const prev = items;
    setItems((list) => list.filter((i) => i.id !== id));

    try {
      await removeCartItem(id);
    } catch (err) {
      console.error(err);
      setItems(prev);
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     تفريغ السلة
  ========================================================= */
  const handleClear = async () => {
    if (!window.confirm("متأكد إنك عايز تفرّغ السلة؟")) return;
    const prev = items;
    setItems([]);

    try {
      await clearCart();
    } catch (err) {
      console.error(err);
      setItems(prev);
    }
  };

  /* =========================================================
     تطبيق كوبون
  ========================================================= */
  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;

    try {
      const res = await applyCoupon({ code });
      const { coupon: c } = extractCart(res);

      setCoupon(c || { code, discountAmount: 0 });
      setCouponMessage({
        type: "success",
        text:` Coupon "${code}" applied successfully!`,
      });
      setCouponInput("");
    } catch (err) {
      console.error(err);
      setCouponMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Invalid coupon code. Please try again.",
      });
    }
  };

  /* =========================================================
     إزالة الكوبون
  ========================================================= */
  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
      setCoupon(null);
      setCouponMessage(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================================================
     Loading State
  ========================================================= */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={36} />
          <p className="text-sm text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }
  /* =========================================================
     Error State
  ========================================================= */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] p-4">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-lg font-bold">Oops! Something went wrong</h2>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchCart}
            className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     Empty State
  ========================================================= */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] p-4 md:p-6">
        <div className="mx-auto max-w-md rounded-xl border bg-white p-8 text-center">
          <div className="mb-4 text-5xl">🛒</div>
          <h3 className="text-base font-extrabold">Your cart is empty</h3>
          <p className="mt-1 text-xs text-gray-400">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-block rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     Main Render
  ========================================================= */
  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4 md:p-6">
      <div className="mx-auto max-w-[1280px]">
        {/* ============ Header ============ */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-[11px] text-gray-400">Home › Cart</p>
            <h1 className="mt-1 text-[22px] font-extrabold">Shopping Cart</h1>
            <p className="mt-1 text-[11px] text-gray-500">
              Review your items and proceed to checkout when you're ready.
            </p>
          </div>
        </div>

        {/* ============ Main Layout ============ */}
        <div className="flex flex-col items-start gap-5 lg:flex-row">
          {/* ===== Cart Items ===== */}
          <div className="w-full rounded-xl border border-gray-100 bg-white p-4 lg:w-[68%]">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[13px] font-bold">
                {items.length} item{items.length !== 1 ? "s" : ""} in your cart
              </h2>
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-red-500"
              >
                <Trash2 size={12} />
                Clear Cart
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 border-b py-4 last:border-0"
              >
                <img
                  src={item.img || "/placeholder.png"}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                  alt={item.name}
                  className="h-[64px] w-[64px] rounded-lg border bg-gray-50 object-cover"
                />

                <div className="flex-1">
                  <h3 className="text-[12px] font-bold">{item.name}</h3>
                  <p className="text-[10px] text-gray-400">{item.brand}</p>
                  {item.desc && (
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  )}
                  <span
                    className={`text-[10px] ${
                      item.stockStatus === "Low stock"
                        ? "text-amber-500"
                        : item.stockStatus === "Out of stock"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    ● {item.stockStatus}
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.oldPrice > item.price && (
                      <>
                        <span className="text-[10px] text-gray-400 line-through">
                          ${item.oldPrice.toFixed(2)}
                        </span>
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] text-red-500">
                          -
                          {Math.round(
                            ((item.oldPrice - item.price) / item.oldPrice) *
                              100
                          )}
                          %
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 rounded-full border px-2 py-1">
                      <button
                        onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1 || updatingId === item.id}
                        className="h-5 w-5 disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-[11px] font-bold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                        disabled={updatingId === item.id}
                        className="h-5 w-5 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[12px] font-bold">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2 flex gap-3 text-[10px] text-gray-400">
                    <button className="flex items-center gap-1 hover:text-blue-600">
                      <Heart size={11} />
                      Wishlist
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={updatingId === item.id}
                      className="flex items-center gap-1 hover:text-red-500 disabled:opacity-40"
                    >
                      <Trash2 size={11} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== Order Summary ===== */}
          <div className="h-fit w-full rounded-xl border border-gray-100 bg-white p-4 lg:w-[32%]">
            <h2 className="mb-4 text-[13px] font-bold">Order Summary</h2>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal ({totals.count} items)
                </span>
                <span className="font-medium">
                  ${totals.subtotal.toFixed(2)}
                </span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-red-500">
                    -${totals.discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Shipping
                  <br />
                  <span className="text-[9px]">
                    Free shipping on orders over $50
                  </span>
                </span>
                <span>
                  {totals.shipping === 0
                    ? "$0.00"
                    :`$$ {totals.shipping.toFixed(2)`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Tax</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>

              <div className="mt-3 flex justify-between border-t pt-3 text-[13px] font-extrabold">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-4 flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full rounded-lg border px-3 py-2 text-[11px] outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                className="rounded-lg border px-4 text-[11px] font-bold text-blue-600"
              >
                Apply
              </button>
            </div>

            {/* Coupon Message */}
            {couponMessage && (
              <div
                className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2.5 ${
                  couponMessage.type === "success"
                    ? "border-green-100 bg-green-50 text-green-700"
                    : "border-red-100 bg-red-50 text-red-600"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full text-white ${
                    couponMessage.type === "success"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {couponMessage.type === "success" ? (
                    <CheckCircle2 size={10} />
                  ) : (
                    <XCircle size={10} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold leading-none">
                    {couponMessage.type === "success"
                      ? "Coupon applied successfully!"
                      : "Invalid coupon code!"}
                  </p>
                  <p className="mt-1 text-[9px]">{couponMessage.text}</p>
                </div>
                <button
                  onClick={() => setCouponMessage(null)}
                  className="text-[10px]"
                >
                  ×
                </button>
              </div>
            )}

            {/* Applied Coupon */}
            {coupon?.code && (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-[10px] text-green-700">
                <span>
                  Coupon <b>{coupon.code}</b> applied
                </span>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-green-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            )}
            <Link
              to="/checkout"
              className="mt-4 block w-full rounded-lg bg-blue-600 py-2.5 text-center text-[11px] font-bold text-white"
            >
              Proceed to Checkout →
            </Link>

            <Link
              to="/shop"
              className="mt-2 block w-full rounded-lg border py-2.5 text-center text-[11px]"
            >
              Continue Shopping
            </Link>

            {/* Trust badges */}
            <div className="mt-5 grid grid-cols-3 gap-2 border-t pt-4 text-center">
              <div>
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-gray-50">
                  <Lock size={13} className="text-gray-500" />
                </div>
                <p className="mt-1 text-[9px] font-bold">Secure</p>
              </div>
              <div>
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-gray-50">
                  <RotateCcw size={13} className="text-gray-500" />
                </div>
                <p className="mt-1 text-[9px] font-bold">Easy Returns</p>
              </div>
              <div>
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-gray-50">
                  <MessageCircle size={13} className="text-gray-500" />
                </div>
                <p className="mt-1 text-[9px] font-bold">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}