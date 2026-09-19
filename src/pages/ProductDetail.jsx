import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Search, ChevronLeft, ChevronRight, Heart, Lock, Truck, RotateCcw,
  ShieldCheck, Plus, Minus, Star, X, ShoppingCart, Check
} from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Thumbs, Zoom as SwiperZoom } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import "swiper/css/zoom"
import { getProductById, getProductReviews, getProducts, addProductReview } from "../api/products.api"
import { addCartItem } from "../api/cart.api"

const COLORS = [
  { name: "Natural Titanium", value: "#c6c3bd" },
  { name: "Silver", value: "#d9d9d9" },
  { name: "Blue", value: "#66758d" },
  { name: "Black", value: "#222222" }
]
const SIZES = ["128GB", "256GB", "512GB", "1TB"]
const PAYMENT_FEATURES = [
  [Lock, "Secure Payment", "SSL Encrypted"],
  [Truck, "Fast Shipping", "Orders over $50"],
  [RotateCcw, "Easy Returns", "30 Days Hassle Free"],
  [ShieldCheck, "Authentic Products", "100% Genuine"]
]
const RATING_DISTRIBUTION = [[5, 82], [4, 12], [3, 4], [2, 1], [1, 1]]
const SHIPPING_STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"]

const cx = (...c) => c.filter(Boolean).join(" ")

function Stars({ rating, size = 13, className = "" }) {
  return (
    <div className={cx("flex text-[#f5bd25]", className)}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={size} fill={n <= Math.round(rating) ? "currentColor" : "none"} />
      ))}
    </div>
  )
}

function SpecTable({ product, selectedSize, stock }) {
  const rows = [
    ["Brand", product.brand],
    ["Model", product.name],
    ["Display", product.display],
    ["Processor", product.processor],
    ["RAM", product.ram],
    ["Storage", selectedSize],
    ["Category", product.category],
    ["SKU", product.sku],
    ["Stock", stock]
  ].filter(([, v]) => v !== undefined && v !== null && v !== "")

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden text-xs bg-[#fbfbfc]">
      {rows.map(([key, value], i) => (
        <div key={key} className={cx("grid grid-cols-2 border-b last:border-0 border-gray-100", i === 0 ? "bg-[#eaf3ff]" : i % 2 ? "bg-white" : "bg-[#f3f4f6]")}>
          <span className={cx("p-2", i === 0 ? "text-[#2563eb] font-semibold" : "text-gray-600")}>{key}</span>
          <span className={cx("p-2 break-words", i === 0 ? "text-[#2563eb] font-semibold" : "text-[#374151]")}>{value}</span>
        </div>
      ))}
    </div>
  )
}

function ShippingInfo() {
  return (
    <div className="rounded-xl border border-[#dce6ff] bg-[#f8faff] p-4 sm:p-5">
      <div className="flex items-center gap-2 text-[#2149b8] font-bold text-base">
        <Truck size={18} /> Shipping Information
      </div>
      <p className="text-xs text-gray-500 mt-5">Estimated delivery</p>
      <p className="text-base font-bold text-[#263653] mt-1">2 - 5 business days</p>

      <div className="relative mt-7 grid grid-cols-4 gap-1 text-center">
        <div className="absolute left-[12.5%] right-[12.5%] top-4 h-0.5 bg-[#dce6ff]" />
        {SHIPPING_STEPS.map((step, i) => (
          <div key={step} className="relative z-10 min-w-0">
            <div className={cx("mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2", i < 3 ? "border-[#2149b8] bg-[#2149b8] text-white" : "border-gray-300 bg-white text-gray-400")}>
              {i < 3 ? <Check size={14} /> : <Truck size={13} />}
            </div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#263653] mt-2 leading-4">{step}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Truck size={14} className="text-[#2149b8]" /> Free shipping on orders over $50
      </p>
      <p className="mt-3 text-xs text-gray-500 leading-5">Your order will be carefully packed and delivered safely to your address.</p>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [related, setRelated] = useState([])
  const [relatedOffset, setRelatedOffset] = useState(0)
  const [relatedMode, setRelatedMode] = useState("similar")
  const [relatedLiked, setRelatedLiked] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [liked, setLiked] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [selectedColor, setSelectedColor] = useState("Black")
  const [selectedSize, setSelectedSize] = useState("256GB")
  const [showReview, setShowReview] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState("")
  const [addedIds, setAddedIds] = useState({})

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError("")
      try {
        const productRes = await getProductById(id)
        const data = productRes.data.product || productRes.data
        setProduct(data)

        try {
          const reviewsRes = await getProductReviews(id)
          setReviews(reviewsRes.data.reviews || [])
          setProduct(prev => ({
            ...prev,
            averageRating: reviewsRes.data.averageRating ?? prev?.averageRating ?? 0,
            numReviews: reviewsRes.data.numReviews ?? prev?.numReviews ?? 0
          }))
        } catch (err) { console.error(err) }

        try {
          const productsRes = await getProducts({ limit: 12 })
          const products = productsRes.data.products || productsRes.data || []
          setRelated(products.filter(item => item._id !== id && item.id !== id).slice(0, 12))
        } catch (err) { console.error(err) }
      } catch (err) {
        console.error(err)
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleReviewSubmit = async e => {
    e.preventDefault()
    if (!reviewComment.trim()) return setReviewError("Please write your review")

    setReviewLoading(true)
    setReviewError("")
    const newReview = {
      _id: `local-${Date.now()}`,
      rating: reviewRating,
      comment: reviewComment.trim(),
      username: "You",
      createdAt: new Date().toISOString()
    }
    try {
      const response = await addProductReview(id, { rating: reviewRating, comment: reviewComment.trim() })
      const payload = response?.data ?? response ?? {}
      const returned = payload.review || payload.data?.review || (payload.comment ? payload : null)
      setReviews(prev => [returned ? { ...newReview, ...returned } : newReview, ...prev])
      setProduct(prev => prev ? { ...prev, numReviews: (Number(prev.numReviews) || 0) + 1 } : prev)
      setReviewComment("")
      setReviewRating(5)
      setShowReview(false)
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to add review")
    } finally {
      setReviewLoading(false)
    }
  }

  const handleAddRelatedToCart = async (e, item) => {
    e.stopPropagation()
    const key = item._id || item.id
    try {
      await addCartItem({ productId: key, quantity: 1 })
      setAddedIds(prev => ({ ...prev, [key]: true }))
      setTimeout(() => setAddedIds(prev => ({ ...prev, [key]: false })), 1500)
    } catch (err) { console.error(err) }
  }

  const goTo = async path => {
    try {
      await addCartItem({ productId: product._id || product.id, quantity })
      navigate(path)
    } catch (err) { console.error(err) }
  }

  if (loading) return <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center text-[#263653]">Loading...</div>
  if (error || !product) return <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center text-red-500">{error || "Product not found"}</div>

  const images = product.images?.length
    ? product.images.map(img => (typeof img === "string" ? img : img.url)).filter(Boolean)
    : []
  const price = product.discountPrice ?? product.price
  const oldPrice = product.discountPrice != null ? product.price : null
  const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0
  const stock = product.stock ?? 0
  const rating = product.averageRating ?? 0
  const reviewCount = Math.max(Number(product.numReviews) || 0, reviews.length)
  const visibleRelated = related.slice(relatedOffset, relatedOffset + 6)

  const tabBtn = (key, label) => (
    <button
      key={key}
      type="button"
      onClick={() => {
        setActiveTab(key)
        if (key === "reviews") document.getElementById("customer-reviews")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }}
      className={cx(
        "font-semibold transition",
        activeTab === key && key !== "reviews" ? "text-[#2149b8] border-b-2 border-[#2149b8] pb-3 -mb-[14px]" : "text-gray-400 hover:text-[#2149b8]"
      )}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#374151] px-1 sm:px-2 lg:px-3 py-4">
      <div className="max-w-[1400px] mx-auto">

        <div className="text-[10px] text-gray-400 mb-4 px-1">
          Home<span className="mx-2">›</span>Shop<span className="mx-2">›</span>{product.category || "Products"}
          <span className="mx-2">›</span><span className="text-[#263653] font-medium">{product.name}</span>
        </div>

        
        <div className="bg-[#fbfbfc] border border-gray-200 rounded-2xl p-2.5 sm:p-3">
          <div className="grid lg:grid-cols-[0.98fr_1.02fr] items-start gap-4 lg:gap-5">
            <div className="min-w-0">
              <div className="flex gap-3">
                <div className="hidden sm:block w-[58px] shrink-0">
                  <Swiper onSwiper={setThumbsSwiper} modules={[Thumbs]} direction="vertical" slidesPerView={5} spaceBetween={9} className="h-[390px]">
                    {images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <button
                          onClick={() => setActiveImage(i)}
                          className={cx("w-full h-[68px] rounded-lg overflow-hidden border-2 bg-[#fafafa] transition",
                            activeImage === i ? "border-[#2149b8]" : "border-transparent hover:border-[#2149b8] hover:shadow-md")}>
                          <img src={img} alt="" className="w-full h-full object-contain p-2" />
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="relative flex-1 min-w-0">
                  {discount > 0 && (
                    <span className="absolute z-20 top-3 left-3 bg-[#2149b8] text-white text-[9px] px-2.5 py-1 rounded-md font-medium">-{discount}%</span>
                  )}
                  <Swiper
                    modules={[Navigation, Thumbs, SwiperZoom]}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    navigation={{ prevEl: ".product-prev", nextEl: ".product-next" }}
                    zoom
                    onSlideChange={s => setActiveImage(s.activeIndex)}
                    className="rounded-xl overflow-hidden" >
                    {images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <div className="swiper-zoom-container h-[320px] sm:h-[390px] flex items-center justify-center bg-[#eef0f3]">
                          <img src={img} alt={product.name} className="w-auto h-auto max-w-[44%] max-h-[44%] object-contain transition-transform duration-300" />
                        </div>
                      </SwiperSlide>
                    ))}
                    <button className="product-prev absolute z-20 left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#263653] hover:bg-[#eef3ff] transition">
                      <ChevronLeft size={15} />
                    </button>
                    <button className="product-next absolute z-20 right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-[#263653] hover:bg-[#eef3ff] transition">
                      <ChevronRight size={15} />
                    </button>
                  </Swiper>
                  <button onClick={() => setZoom(true)} className="absolute z-20 bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full shadow px-3 py-1.5 text-[9px] flex items-center gap-1.5 text-gray-600 hover:text-[#2149b8]">
                    <Search size={11} /> Hover to zoom
                  </button>
                </div>
              </div>

              <div className="sm:hidden mt-3">
                <Swiper slidesPerView={4} spaceBetween={8} modules={[Thumbs]}>
                  {images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <button
                        onClick={() => setActiveImage(i)}
                        className={cx("w-full h-[62px] rounded-lg border-2 overflow-hidden bg-[#fafafa]",
                          activeImage === i ? "border-[#2149b8]" : "border-transparent")}  >
                        <img src={img} alt="" className="w-full h-full object-contain p-2" />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            <div className="pt-1 p-2 sm:p-3">
              <p className="text-[9px] uppercase font-semibold text-gray-400 tracking-wide">{product.brand || "BRAND"}</p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-[#374151]">{product.name}</h1>
              {product.shortDescription && <p className="text-[10px] text-gray-500 mt-2 leading-5">{product.shortDescription}</p>}

              <div className="flex items-center gap-2 mt-3">
                <Stars rating={rating} />
                <span className="text-[9px] text-gray-500">{rating.toFixed(1)} ({reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <span className="text-2xl font-bold text-[#2149b8]">${Number(price).toFixed(2)}</span>
                {oldPrice > price && (
                  <>
                    <span className="text-[10px] text-gray-400 line-through">${Number(oldPrice).toFixed(2)}</span>
                    <span className="text-[9px] text-green-500 font-semibold">-{discount}% off</span>
                  </>
                )}
              </div>

              <p className={cx("text-[9px] mt-2 font-medium", stock > 0 ? "text-[#d28c16]" : "text-red-500")}>
                ● {stock > 0 ? `In stock (Only ${stock} left)` : "Out of stock"}
              </p>

              <div className="border-t border-gray-100 mt-5 pt-5">
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-semibold">Color:</p>
                    <span className="text-[9px] text-gray-400">{selectedColor}</span>
                  </div>
                  <div className="flex gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color.name}
                        type="button"
                        title={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={cx("w-7 h-7 rounded-full flex items-center justify-center border transition",
                          selectedColor === color.name
                            ? "border-[#2149b8] ring-2 ring-[#dce5ff] scale-110"
                            : "border-gray-200 hover:border-[#2149b8] hover:scale-110 hover:shadow-md")} >
                        <span className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ backgroundColor: color.value }} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-semibold">Size:</p>
                    <span className="text-[9px] text-gray-400">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={cx("min-w-[45px] h-7 px-3 rounded-md border text-[9px] transition",
                          selectedSize === size
                            ? "border-[#2149b8] text-[#2149b8] bg-[#f5f8ff] font-semibold shadow-sm scale-[1.03]"
                            : "border-gray-200 text-gray-500 hover:border-[#2149b8] hover:text-[#2149b8] hover:bg-[#f8faff] hover:-translate-y-0.5 hover:shadow-sm")}  >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] font-semibold mb-2">Quantity:</p>
                <div className="flex items-center border border-gray-200 rounded-lg w-fit overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-[#eef3ff] hover:text-[#2149b8] hover:scale-110 active:scale-95">
                    <Minus size={11} />
                  </button>
                  <span className="w-8 text-center text-[10px]">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(stock || 1, q + 1))} className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-[#eef3ff] hover:text-[#2149b8] hover:scale-110 active:scale-95">
                    <Plus size={11} />
                  </button>
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => goTo("/cart")}
                    disabled={!stock}
                    className="flex-1 h-10 bg-[#2149b8] text-white rounded-lg text-[10px] font-semibold hover:bg-[#193b9d] hover:shadow-lg hover:shadow-[#2149b8]/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none">
                    <Lock size={12} className="inline mr-1.5" /> Add to Cart
                  </button>
                  <button
                    onClick={() => goTo("/checkout")}
                    disabled={!stock}
                    className="flex-1 h-10 border border-[#2149b8] text-[#2149b8] rounded-lg text-[10px] font-semibold hover:bg-[#eef3ff] hover:shadow-md hover:shadow-[#2149b8]/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed" >
                    ⚡ Buy Now
                  </button>
                  <button
                    onClick={() => setLiked(!liked)}
                    className={cx("w-10 h-10 border rounded-lg flex items-center justify-center transition-all duration-200",
                      liked ? "border-gray-300 text-[#dc2626] bg-white shadow-sm" : "border-gray-300 text-gray-500 bg-white hover:border-gray-400 hover:text-[#dc2626] hover:shadow-md")}>
                    <Heart size={15} fill={liked ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

       
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-1">
          {PAYMENT_FEATURES.map(([Icon, title, text]) => (
            <div key={title} className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition-colors duration-300">
              <div className="w-11 h-11 rounded-xl bg-[#eef3ff] flex items-center justify-center text-[#2149b8] shrink-0 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <Icon size={14} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#263653]">{title}</p>
                <p className="text-xs text-gray-400 mt-1">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-white border border-gray-100 rounded-2xl mt-5 p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-5 sm:gap-7 border-b border-gray-100 pb-3 text-xs sm:text-sm whitespace-nowrap overflow-x-auto">
            {tabBtn("description", "Description")}
            {tabBtn("specifications", "Specifications")}
            {tabBtn("shipping", "Shipping")}
            {tabBtn("reviews", `Reviews (${reviewCount})`)}
          </div>

          {activeTab === "description" && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr_1fr] gap-5 lg:gap-6 items-start">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#263653] mb-3">{product.shortDescription || "Powerful. Professional. Reliable."}</h3>
                <p className="text-sm text-gray-500 leading-6">{product.description || product.shortDescription || "No description available."}</p>
                <div className="mt-5 space-y-3">
                  {[
                    "Premium quality and reliable performance",
                    "Carefully selected materials and details",
                    "Designed for everyday comfort and use",
                    "Fast and secure order processing",
                    "Made for everyday use and long-lasting performance"
                  ].map(point => (
                    <div key={point} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#eaf1ff] text-[#2149b8]">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#263653] mb-4">Specifications</h3>
                <SpecTable product={product} selectedSize={selectedSize} stock={stock} />
              </div>

              <ShippingInfo />
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="mt-6 w-full rounded-xl bg-[#f3f4f6] p-4">
              <h3 className="text-base font-bold text-[#263653] mb-4">Specifications</h3>
              <SpecTable product={product} selectedSize={selectedSize} stock={stock} />
            </div>
          )}

          {activeTab === "shipping" && <div className="mt-6 w-full"><ShippingInfo /></div>}
        </section>

      
        <section id="customer-reviews" className="bg-white border border-gray-100 rounded-2xl mt-5 p-4 sm:p-5 lg:p-6 scroll-mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-lg sm:text-xl text-[#263653]">Customer Reviews</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Based on {reviewCount} reviews</p>
            </div>
            <button
              type="button"
              onClick={() => { setReviewError(""); setShowReview(true) }}
              className="border border-[#2149b8] text-[#2149b8] rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-[#2149b8] hover:text-white hover:-translate-y-0.5 hover:shadow-md transition" >
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[285px_1fr] gap-14 lg:gap-20">
            <div>
              <div className="text-6xl font-bold text-[#263653] leading-none">{rating.toFixed(1)}</div>
              <Stars rating={rating} size={19} className="mt-3" />
              <p className="text-xs text-gray-400 mt-2">Based on {reviewCount} reviews</p>

              <div className="mt-5 space-y-2">
                {RATING_DISTRIBUTION.map(([stars, pct]) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-7">{stars}★</span>
                    <div className="flex-1 h-2 bg-[#edf0f4] rounded-full overflow-hidden">
                      <div className="h-full bg-[#2149b8] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
                <p className="text-base text-gray-500">No reviews yet</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to review this product</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {reviews.slice(0, 12).map((review, i) => (
                  <article key={review._id || i} className="border border-gray-100 rounded-xl p-2 sm:p-2.5 max-w-[220px] mx-auto w-full hover:border-[#dce5ff] hover:shadow-md transition">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-[#eef3ff] flex items-center justify-center text-xs text-[#2149b8] font-semibold">
                        {(review.username || review.user || "C").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] sm:text-xs font-semibold text-[#263653] truncate">{review.username || review.user || "Customer"}</p>
                        <p className="text-[10px] text-gray-400">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Verified Purchase"}</p>
                      </div>
                    </div>
                    <Stars rating={review.rating} size={11} className="mt-3" />
                    <h4 className="text-xs font-bold text-[#263653] mt-3">{review.title || "Great product!"}</h4>
                    <p className="text-[11px] text-gray-600 leading-4 mt-2 min-h-[48px]">{review.comment}</p>
                    <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
                      <span>👍 Helpful</span>
                      <span>Reply</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

     
        {related.length > 0 && (
          <div className="mt-6 pb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#374151]">Related Products</h2>
                <div className="flex items-center gap-2 mt-2">
                  <button type="button" onClick={() => { setRelatedMode("similar"); setRelatedOffset(0) }} className={cx("rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200", relatedMode === "similar" ? "text-[#b45309]" : "text-gray-500 hover:text-[#b45309]")}>Similar Products</button>
                  <span className="text-gray-300">•</span>
                  <button type="button" onClick={() => { setRelatedMode("frequently"); setRelatedOffset(0) }} className={cx("rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200", relatedMode === "frequently" ? "text-[#b45309]" : "text-gray-500 hover:text-[#b45309]")}>Frequently Bought Together</button>
                </div>
              </div>
              <div className="flex gap-1">
                <button type="button" disabled={relatedOffset === 0} onClick={() => setRelatedOffset(o => Math.max(0, o - 1))} aria-label="Previous related products" className="w-9 h-9 rounded-full border border-[#2149b8] bg-[#eef3ff] text-[#2149b8] flex items-center justify-center transition-all duration-200 hover:bg-[#2149b8] hover:text-white hover:-translate-y-0.5 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[#eef3ff] disabled:hover:text-[#2149b8]">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" disabled={relatedOffset + 6 >= related.length} onClick={() => setRelatedOffset(o => Math.min(Math.max(related.length - 6, 0), o + 1))} aria-label="Next related products" className="w-9 h-9 rounded-full border border-[#2149b8] bg-[#eef3ff] text-[#2149b8] flex items-center justify-center transition-all duration-200 hover:bg-[#2149b8] hover:text-white hover:-translate-y-0.5 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[#eef3ff] disabled:hover:text-[#2149b8]">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
              {visibleRelated.map(item => {
                const itemId = item._id || item.id
                const itemImage = item.images?.[0]
                const image = typeof itemImage === "string" ? itemImage : itemImage?.url
                const itemPrice = item.discountPrice ?? item.price
                const isAdded = addedIds[itemId]

                return (
                  <div
                    key={itemId}
                    onClick={() => navigate(`/products/${itemId}`)}
                    role="button"
                    tabIndex={0}
                    className="group relative bg-white border border-gray-100 rounded-2xl p-2 cursor-pointer transition-all duration-300">
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setRelatedLiked(prev => ({ ...prev, [itemId]: !prev[itemId] })) }}
                      aria-label="Favorite product"
                      className={cx("absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white transition-all duration-200",
                        relatedLiked[itemId] ? "text-[#dc2626] shadow-sm" : "text-gray-500 hover:text-[#dc2626] hover:border-gray-400 hover:shadow-md")} >
                      <Heart size={13} fill={relatedLiked[itemId] ? "currentColor" : "none"} />
                    </button>

                    <div className="w-full h-[128px] rounded-lg bg-[#fafafa] flex items-center justify-center overflow-hidden">
                      {image && <img src={image} alt={item.name} className="w-[82%] h-[82%] object-contain transition-transform duration-500 group-hover:scale-110" />}
                    </div>

                    <p className="text-[8px] text-gray-400 mt-2">{item.category || "Product"}</p>
                    <h3 className="text-[10px] font-semibold text-[#263653] mt-1 line-clamp-2 min-h-[25px]">{item.name}</h3>

                    <div className="flex items-center gap-1 mt-1">
                      <Star size={8} className="text-[#f5bd25]" fill="currentColor" />
                      <span className="text-[8px] text-gray-400">{Number(item.averageRating || 0).toFixed(1)}</span>
                    </div>

                    <p className="text-[10px] font-bold text-[#2149b8] mt-1">${Number(itemPrice || 0).toFixed(2)}</p>
                    <p className="text-[7px] text-green-500 mt-0.5">● In stock</p>

                    <button
                      onClick={e => handleAddRelatedToCart(e, item)}
                      className={cx("w-full h-7 mt-2 rounded-md text-[8px] font-semibold transition",
                        isAdded ? "bg-green-500 text-white" : "bg-[#2149b8] text-white hover:bg-[#193b9d] hover:shadow-lg hover:shadow-[#2149b8]/25 hover:-translate-y-0.5 active:scale-95")}  >
                      {isAdded ? <><Check size={9} className="inline mr-1" />Added</> : <><ShoppingCart size={9} className="inline mr-1" />Add to Cart</>}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      
      {zoom && images[activeImage] && (
        <div className="fixed inset-0 z-50 bg-[#374151]/80 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
          <button onClick={() => setZoom(false)} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-red-500">
            <X size={18} />
          </button>
          <img src={images[activeImage]} alt={product.name} onClick={e => e.stopPropagation()} className="max-w-[90%] max-h-[85vh] object-contain" />
        </div>
      )}

      
      {showReview && (
        <div className="fixed inset-0 z-50 bg-[#374151]/50 flex items-center justify-center p-4" onClick={() => setShowReview(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base text-[#263653]">Write a Review</h2>
              <button onClick={() => setShowReview(false)} className="text-gray-400 hover:text-red-500">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit}>
              <p className="text-[10px] font-semibold mb-2">Your Rating</p>
              <div className="flex gap-1 mb-5">
                {[1, 2, 3, 4, 5].map(n => (
                  <button type="button" key={n} onClick={() => setReviewRating(n)} className="text-[#f5bd25]">
                    <Star size={20} fill={n <= reviewRating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>

              <p className="text-[10px] font-semibold mb-2">Your Review</p>
              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                rows={5}
                name="reviewComment"
                required
                placeholder="Write your review..."
                className="w-full border border-gray-200 rounded-lg p-3 text-xs outline-none focus:border-[#2149b8] resize-none"  />

              {reviewError && <p className="text-[9px] text-red-500 mt-2">{reviewError}</p>}

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full h-10 mt-4 bg-[#2149b8] text-white rounded-lg text-xs font-semibold hover:bg-[#193b9d] hover:-translate-y-0.5 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed" >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
