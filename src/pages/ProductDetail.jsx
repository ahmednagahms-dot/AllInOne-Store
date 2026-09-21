import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProductById,
  getProductReviews,
  addProductReview,
  getProducts,
} from "../api/products.api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Loader2,
  Lock,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import "swiper/css/thumbs";
import ProductCard from "../components/products/ProductCard";

/* =========================================================
   Constants
========================================================= */
const PAYMENT_FEATURES = [
  [Lock, "Secure Payment", "SSL Encrypted"],
  [Truck, "Fast Shipping", "Orders over $50"],
  [RotateCcw, "Easy Returns", "30 Days Hassle Free"],
  [ShieldCheck, "Authentic Products", "100% Genuine"],
];

const SHIPPING_STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];

const cx = (...c) => c.filter(Boolean).join(" ");

/* =========================================================
   Sub-components
========================================================= */
function Stars({ rating, size = 13, className = "" }) {
  return (
    <div className={cx("flex text-[#f5bd25]", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function SpecTable({ product, stock }) {
  // دعم شكلين: product.specifications (object) أو حقول مباشرة
  const fromObject =
    product.specifications && typeof product.specifications === "object"
      ? Object.entries(product.specifications)
      : [];

  const rows =
    fromObject.length > 0
      ? fromObject
      : [
          ["Brand", product.brand],
          ["Model", product.name],
          ["Category", product.category],
          ["SKU", product.sku],
          ["Stock", stock],
        ].filter(([, v]) => v !== undefined && v !== null && v !== "");

  if (rows.length === 0) {
    return (
      <div className="border border-dashed border-gray-200 dark:border-slate-800 rounded-xl p-6 text-center text-xs text-gray-400 dark:text-slate-500">
        No specifications available
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs bg-[#fbfbfc] dark:bg-slate-900">
      {rows.map(([key, value], i) => (
        <div
          key={key}
          className={cx(
            "grid grid-cols-2 border-b last:border-0 border-gray-100 dark:border-slate-800",
            i === 0
              ? "bg-[#eaf3ff] dark:bg-indigo-950/40"
              : i % 2
              ? "bg-white dark:bg-slate-900"
              : "bg-[#f3f4f6] dark:bg-slate-800/40"
          )}
        >
          <span
            className={cx(
              "p-2 capitalize",
              i === 0
                ? "text-[#2563eb] dark:text-indigo-400 font-semibold"
                : "text-gray-600 dark:text-slate-400"
            )}
          >
            {String(key)}
          </span>
          <span
            className={cx(
              "p-2 break-words",
              i === 0
                ? "text-[#2563eb] dark:text-indigo-400 font-semibold"
                : "text-[#374151] dark:text-slate-200"
            )}
          >
            {String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ShippingInfo() {
  return (
    <div className="rounded-xl border border-[#dce6ff] dark:border-slate-800 bg-[#f8faff] dark:bg-slate-900/80 p-4 sm:p-5">
      <div className="flex items-center gap-2 text-[#2149b8] dark:text-indigo-400 font-bold text-base">
        <Truck size={18} /> Shipping Information
      </div>
      <p className="text-xs text-gray-500 dark:text-slate-400 mt-5">Estimated delivery</p>
      <p className="text-base font-bold text-[#263653] dark:text-white mt-1">
        2 - 5 business days
      </p>

      <div className="relative mt-7 grid grid-cols-4 gap-1 text-center">
        <div className="absolute left-[12.5%] right-[12.5%] top-4 h-0.5 bg-[#dce6ff] dark:bg-slate-700" />
        {SHIPPING_STEPS.map((step, i) => (
          <div key={step} className="relative z-10 min-w-0">
            <div
              className={cx(
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2",
                i < 3
                  ? "border-[#2149b8] dark:border-indigo-500 bg-[#2149b8] dark:bg-indigo-600 text-white"
                  : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500"
              )}
            >
              {i < 3 ? <Star size={14} /> : <Truck size={13} />}
            </div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#263653] dark:text-slate-300 mt-2 leading-4">
              {step}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-slate-400">
        <Truck size={14} className="text-[#2149b8] dark:text-indigo-400" /> Free shipping on orders
        over $50
      </p>
      <p className="mt-3 text-xs text-gray-500 dark:text-slate-400 leading-5">
        Your order will be carefully packed and delivered safely to your
        address.
      </p>
    </div>
  );
}

/* =========================================================
   Main Component
========================================================= */
export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  // Review form
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, reviewsRes] = await Promise.all([
          getProductById(id),
          getProductReviews(id).catch(() => ({ data: [] })),
        ]);

        const fetchedProduct = productRes.data.product || productRes.data;
        setProduct(fetchedProduct);

        const reviewsData = reviewsRes.data.reviews || reviewsRes.data || [];
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);

        // Related products (same category, excluding current product)
        if (fetchedProduct?.category) {
          try {
            const relatedRes = await getProducts({ limit: 20 });
            const list =
              relatedRes.data.products ||
              relatedRes.data.data ||
              relatedRes.data ||
              [];
            const filtered = (Array.isArray(list) ? list : [])
              .filter(
                (p) =>
                  p.category === fetchedProduct.category &&
                  p._id !== fetchedProduct._id
              )
              .slice(0, 5);
            setRelatedProducts(filtered);
          } catch (err) {
            console.error(err);
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    const success = await addItem(product._id, quantity);
    if (success) {
      // optional: navigate to cart
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      toast.error("Please select a rating from 1 to 5 stars first");
      return;
    }
    setSubmittingReview(true);
    try {
      await addProductReview(product._id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Your review has been added, thank you!");
      setReviewRating(0);
      setReviewComment("");
      const { data } = await getProductReviews(id);
      const reviewsData = data.reviews || data || [];
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Product not found</p>
        <Link to="/shop" className="text-primary-500 hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const price = product.price || 0;
  const discountPrice = product.discountPrice;
  const hasDiscount = discountPrice && discountPrice < price;
  const stock = product.stock ?? 0;
  const images = product.images?.length
    ? product.images
    : [{ url: "https://via.placeholder.com/600" }];

  const reviewCount = Math.max(
    Number(product.numReviews) || 0,
    reviews.length
  );

  const tabBtn = (key, label) => (
    <button
      key={key}
      type="button"
      onClick={() => {
        setActiveTab(key);
        if (key === "reviews")
          document
            .getElementById("customer-reviews")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className={cx(
        "font-semibold transition",
        activeTab === key
          ? "text-[#5046E5] dark:text-indigo-400 border-b-2 border-[#5046E5] dark:border-indigo-400 pb-3 -mb-[14px]"
          : "text-gray-400 dark:text-slate-400 hover:text-[#5046E5] dark:hover:text-indigo-300"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-slate-950 text-[#374151] dark:text-slate-200 px-1 sm:px-2 lg:px-3 py-4 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <div className="text-[10px] text-gray-400 dark:text-slate-400 mb-4 px-1">
          <Link to="/" className="hover:text-primary-500">
            Home
          </Link>
          <span className="mx-2">›</span>
          <Link to="/shop" className="hover:text-primary-500">
            Shop
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#263653] dark:text-slate-100 font-medium">{product.name}</span>
        </div>

        {/* Main Product Card */}
        <div className="bg-[#fbfbfc] dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-sm">
          <div className="grid lg:grid-cols-[0.98fr_1.02fr] items-start gap-4 lg:gap-5">
            {/* Images */}
            <div className="min-w-0">
              <div className="flex gap-3">
                <div className="hidden sm:block w-[58px] shrink-0">
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    modules={[Thumbs]}
                    direction="vertical"
                    slidesPerView={5}
                    spaceBetween={9}
                    className="h-[390px]"
                  >
                    {images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div className="w-full h-[68px] rounded-lg overflow-hidden border-2 border-transparent bg-[#fafafa] dark:bg-slate-800 hover:border-[#5046E5] transition cursor-pointer">
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="relative flex-1 min-w-0">
                  {hasDiscount && (
                    <span className="absolute z-20 top-3 left-3 bg-[#5046E5] text-white text-[9px] px-2.5 py-1 rounded-md font-medium shadow-sm">
                      -
                      {Math.round(((price - discountPrice) / price) * 100)}%
                    </span>
                  )}
                  <Swiper
                    modules={[Navigation, Thumbs]}
                    thumbs={{ swiper: thumbsSwiper }}
                    navigation={{
                      prevEl: ".product-prev",
                      nextEl: ".product-next",
                    }}
                    className="rounded-xl overflow-hidden"
                  >
                    {images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div className="h-[320px] sm:h-[390px] flex items-center justify-center bg-[#eef0f3] dark:bg-slate-800/60">
                          <img
                            src={img.url}
                            alt={product.name}
                            className="w-auto h-auto max-w-[60%] max-h-[80%] object-contain"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                    <button className="product-prev absolute z-20 left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow flex items-center justify-center text-[#263653] dark:text-slate-200 hover:bg-[#eef3ff] dark:hover:bg-slate-700 transition cursor-pointer">
                      ‹
                    </button>
                    <button className="product-next absolute z-20 right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow flex items-center justify-center text-[#263653] dark:text-slate-200 hover:bg-[#eef3ff] dark:hover:bg-slate-700 transition cursor-pointer">
                      ›
                    </button>
                  </Swiper>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="pt-1 p-2 sm:p-3">
              <p className="text-[9px] uppercase font-semibold text-gray-400 dark:text-slate-400 tracking-wide">
                {product.brand || product.category || "BRAND"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-[#374151] dark:text-white">
                {product.name}
              </h1>

              {product.sku && (
                <p className="text-[9px] text-gray-400 dark:text-slate-500 mt-1">
                  SKU: {product.sku}
                </p>
              )}

              {product.shortDescription && (
                <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-2 leading-5">
                  {product.shortDescription}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3">
                <Stars rating={product.averageRating || 0} />
                <span className="text-[9px] text-gray-500 dark:text-slate-400">
                  {(product.averageRating || 0).toFixed(1)} ({reviewCount}{" "}
                  reviews)
                </span>
                <span className="text-gray-300 dark:text-slate-600">|</span>
                <span
                  className={cx(
                    "text-[9px] font-medium",
                    stock > 0 ? "text-[#d28c16] dark:text-amber-400" : "text-red-500"
                  )}
                >
                  ● {stock > 0 ? "In stock" : "Out of stock"}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-5">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl font-bold text-[#5046E5] dark:text-indigo-400">
                      ${Number(discountPrice).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 line-through">
                      ${Number(price).toFixed(2)}
                    </span>
                    <span className="text-[9px] text-green-500 font-semibold">
                      -
                      {Math.round(((price - discountPrice) / price) * 100)}% off
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-[#5046E5] dark:text-indigo-400">
                    ${Number(price).toFixed(2)}
                  </span>
                )}
              </div>

              {stock > 0 && (
                <p className="text-[9px] mt-2 font-medium text-[#d28c16] dark:text-amber-400">
                  ● In stock (Only {stock} left)
                </p>
              )}

              {/* Quantity + Buttons */}
              <div className="border-t border-gray-100 dark:border-slate-800 mt-5 pt-5">
                <p className="text-[10px] font-semibold mb-2 text-slate-800 dark:text-slate-200">Quantity:</p>
                <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg w-fit overflow-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-[#eef3ff] dark:hover:bg-slate-700 hover:text-[#5046E5] dark:hover:text-indigo-400 cursor-pointer"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-8 text-center text-[10px]">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(stock || 1, q + 1))
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-[#eef3ff] dark:hover:bg-slate-700 hover:text-[#5046E5] dark:hover:text-indigo-400 cursor-pointer"
                  >
                    <Plus size={11} />
                  </button>
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={handleAddToCart}
                    disabled={stock <= 0}
                    className="flex-1 h-10 bg-[#5046E5] hover:bg-[#4338CA] text-white rounded-lg text-[10px] font-semibold hover:shadow-lg transition disabled:bg-gray-300 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Lock size={12} className="inline mr-1.5" /> Add to Cart
                  </button>
                  <button
                    onClick={() => toggleItem(product._id)}
                    className={cx(
                      "w-10 h-10 border rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer",
                      isInWishlist(product._id)
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-gray-300 dark:border-slate-700 text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-800 hover:border-gray-400 dark:hover:border-slate-600 hover:text-red-500 hover:shadow-md"
                    )}
                  >
                    <Heart
                      size={15}
                      fill={isInWishlist(product._id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Payment Features ===== */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-1">
          {PAYMENT_FEATURES.map(([Icon, title, text]) => (
            <div
              key={title}
              className="group flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors duration-300 shadow-sm"
            >
              <div className="w-11 h-11 rounded-xl bg-[#eef3ff] dark:bg-indigo-950/40 flex items-center justify-center text-[#5046E5] dark:text-indigo-400 shrink-0 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <Icon size={14} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#263653] dark:text-slate-100">{title}</p>
                <p className="text-xs text-gray-400 dark:text-slate-400 mt-1">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Tabs Section ===== */}
        <section className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl mt-5 p-4 sm:p-5 lg:p-6 shadow-sm">
          <div className="flex items-center gap-5 sm:gap-7 border-b border-gray-100 dark:border-slate-800 pb-3 text-xs sm:text-sm whitespace-nowrap overflow-x-auto">
            {tabBtn("description", "Description")}
            {tabBtn("specifications", "Specifications")}
            {tabBtn("shipping", "Shipping")}
            {tabBtn("reviews", `Reviews (${reviewCount})`)}
          </div>

          {activeTab === "description" && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 lg:gap-6 items-start">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#263653] dark:text-slate-100 mb-3">
                  {product.shortDescription || product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-300 leading-7 whitespace-pre-line">
                  {product.description ||
                    product.shortDescription ||
                    "No description available."}
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-[#263653] dark:text-slate-100 mb-4">
                    Specifications
                  </h3>
                  <SpecTable product={product} stock={stock} />
                </div>
                <ShippingInfo />
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="mt-6 w-full rounded-xl bg-[#f3f4f6] dark:bg-slate-800/50 p-4">
              <h3 className="text-base font-bold text-[#263653] dark:text-slate-100 mb-4">
                Specifications
              </h3>
              <SpecTable product={product} stock={stock} />
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="mt-6 w-full">
              <ShippingInfo />
            </div>
          )}

          {activeTab === "reviews" && (
            <div id="customer-reviews" className="mt-6 space-y-6 scroll-mt-6">
              {isAuthenticated ? (
                <form
                  onSubmit={handleSubmitReview}
                  className="border border-gray-100 dark:border-slate-800 rounded-2xl p-5 space-y-4"
                >
                  <p className="font-medium text-gray-900 dark:text-slate-100">
                    Write your review
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        aria-label={`${star} stars`}
                      >
                        <Star
                          size={24}
                          className={
                            star <= reviewRating
                              ? "fill-warning text-warning"
                              : "text-gray-300 dark:text-slate-600"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your opinion about the product..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-[#5046E5] hover:bg-[#4338CA] text-white font-medium rounded-lg transition disabled:opacity-50 cursor-pointer"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="border border-gray-100 dark:border-slate-800 rounded-2xl p-5 text-sm text-gray-500 dark:text-slate-400">
                  <Link
                    to="/login"
                    className="text-primary-500 hover:underline"
                  >
                    Log in
                  </Link>{" "}
                  to write a review.
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-gray-500 dark:text-slate-400">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-gray-100 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-indigo-950/60 flex items-center justify-center text-primary-600 dark:text-indigo-400 font-bold">
                          {(review.user?.username || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-slate-100">
                            {review.user?.username || "User"}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star
                              size={14}
                              className="fill-warning text-warning"
                            />
                            <span className="text-sm text-gray-600 dark:text-slate-300">{review.rating}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US"
                        )}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-slate-300">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* ===== Related Products ===== */}
        {relatedProducts.length > 0 && (
          <div className="mt-6 pb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#374151] dark:text-white mb-4">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}