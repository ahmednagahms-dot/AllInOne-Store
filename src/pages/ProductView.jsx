import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Tag,
  Layers,
  Building2,
  Hash,
  ShoppingBag,
  Pencil,
  Star,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(`/products/${id}`, {
          signal: controller.signal,
        });
        const productData = data.product || data;

        if (!productData) {
          setProduct(null);
          return;
        }

        setProduct(productData);

        const firstImage = productData.images?.[0];
        if (typeof firstImage === "string") {
          setSelectedImage(firstImage);
        } else {
          setSelectedImage(
            firstImage?.url ||
              firstImage?.secure_url ||
              firstImage?.src ||
              ""
          );
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          return;
        }
        const message =
          err.response?.data?.message || "Failed to load product details.";
        setError(message);
        toast.error(message, { toastId: "product-view-fetch-error" });
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  const getImageUrl = (image) => {
    if (typeof image === "string") return image;
    return image?.url || image?.secure_url || image?.src || "";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoader text="Loading product..." />
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 w-full">
          <div className="max-w-lg mx-auto mt-16">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {error ? "Unable to load product" : "Product Not Found"}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {error || "The product you are looking for does not exist."}
              </p>
              <button
                type="button"
                onClick={() => navigate("/dashboard/products")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
              >
                <ArrowLeft size={16} />
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const images = Array.isArray(product.images)
    ? product.images.map(getImageUrl).filter(Boolean)
    : [];

  const price = Number(product.price || 0);
  const discountPrice =
    product.discountPrice !== undefined &&
    product.discountPrice !== null &&
    product.discountPrice !== ""
      ? Number(product.discountPrice)
      : null;

  const hasDiscount = discountPrice !== null && discountPrice < price;
  const displayPrice = hasDiscount ? discountPrice : price;
  const stock = Math.max(0, Number(product.stock || 0));

  const infoCards = [
    product.sku && { icon: Hash, label: "SKU", value: product.sku },
    product.brand && { icon: Building2, label: "Brand", value: product.brand },
    product.category && {
      icon: Layers,
      label: "Category",
      value: product.category,
    },
    product.subcategory && {
      icon: Tag,
      label: "Subcategory",
      value: product.subcategory,
    },
  ].filter(Boolean);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 w-full animate-fade-in">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/products")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>

          <button
            type="button"
            onClick={() => navigate(`/dashboard/products/${id}/edit`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            <Pencil size={15} />
            Edit Product
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 sm:p-7">
            {/* Gallery */}
            <div>
              <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <Package size={48} />
                    <span className="text-sm">No image</span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition ${
                        selectedImage === image
                          ? "border-indigo-500 ring-2 ring-indigo-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.category && (
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium capitalize">
                    {product.category}
                  </span>
                )}
                {product.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
                    <Star size={12} fill="currentColor" />
                    Featured
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${displayPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ${price.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-emerald-600">
                      Save ${(price - discountPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 mt-4">
                <Package size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">Stock:</span>
                <span
                  className={`text-sm font-semibold ${
                    stock === 0
                      ? "text-red-600"
                      : stock < 10
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {stock === 0 ? "Out of Stock" : `${stock} available`}
                </span>
              </div>

              {/* Info Cards */}
              {infoCards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
                  {infoCards.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                          <Icon size={14} />
                          <span className="text-xs">{item.label}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700 capitalize">
                          {item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 p-5 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={18} className="text-indigo-500" />
              <h2 className="text-base font-semibold text-gray-900">
                Product Description
              </h2>
            </div>
            <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">
              {product.description || "No description available."}
            </p>
          </div>

          {/* Tags */}
          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="border-t border-gray-100 p-5 sm:p-7">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 rounded-lg text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}