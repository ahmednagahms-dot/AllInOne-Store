import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { FiSearch, FiTrash2, FiPlus, FiMessageSquare } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import DashboardLayout from '../components/layout/DashboardLayout';
import PageLoader from "../components/ui/sessionLoader/PageLoader";
import api from "../api/axios";

const formatDate = (dateString, language = 'en') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const StarRating = ({ rating, setRating, isInteractive = false }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-lg transition-colors ${
            isInteractive ? 'cursor-pointer' : 'cursor-default'
          } ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
          onClick={() => isInteractive && setRating && setRating(star)}
        />
      ))}
    </div>
  );
};

const AddReviewModal = ({ isOpen, onClose, products, onReviewAdded }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      await api.post(`/products/${data.productId}/reviews`, {
        rating,
        comment: data.comment,
      });

      reset();
      setRating(5);
      onReviewAdded();
      onClose();
      toast.success(t("reviews.added") || "Review added successfully!", {
        toastId: "review-add-success",
      });
    } catch (error) {
      console.error('Failed to add review:', error);
      toast.error(
        error.response?.data?.message || t("reviews.addFailedRetry") || "Failed to add review. Please try again.",
        { toastId: "review-add-error" }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{t("reviews.add")}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <IoClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("reviews.product")}
            </label>
            <select
              {...register('productId', { required: t("reviews.selectProduct") })}
              className="w-full bg-gray-50 border-0 rounded-lg p-2.5 text-sm shadow-inner focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            >
              <option value="">{t("reviews.selectProductOption")}</option>
              {products.map((product) => (
                <option
                  key={product._id || product.id}
                  value={product._id || product.id}
                >
                  {product.title || product.name}
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.productId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("reviews.rating")}
            </label>
            <StarRating rating={rating} setRating={setRating} isInteractive={true} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("reviews.comment")}
            </label>
            <textarea
              {...register('comment', { required: t("reviews.commentRequired") })}
              rows="4"
              placeholder={t("reviews.writeReview")}
              className="w-full bg-gray-50 border-0 rounded-lg p-2.5 text-sm shadow-inner focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            ></textarea>
            {errors.comment && (
              <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {isSubmitting ? t("reviews.adding") : t("reviews.add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, deleting }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
        <h3 className="text-lg font-semibold text-gray-800">{t("reviews.delete")}</h3>
        <p className="text-sm text-gray-500 mt-2">
          {t("reviews.deleteConfirm")}
        </p>
        <div className="flex justify-center space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg shadow hover:bg-red-700 transition disabled:opacity-60"
          >
            {deleting ? (t("common.deleting") || 'Deleting...') : (t("common.delete") || 'Delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

const Reviews = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchData = async ({ isInitial = false } = {}) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const { data: resData } = await api.get('/products');

      const productsList = Array.isArray(resData)
        ? resData
        : resData.data || resData.products || [];

      setProducts(productsList);

      // For each product, prefer embedded reviews if present; otherwise
      // fetch that product's reviews individually. This handles a mix of
      // products with and without embedded reviews correctly, instead of
      // an all-or-nothing check across the whole list.
      const perProductPromises = productsList.map(async (prod) => {
        const pId = prod._id || prod.id;
        const productName = prod.title || prod.name || 'Product';

        if (Array.isArray(prod.reviews) && prod.reviews.length > 0) {
          return prod.reviews.map((r) => ({
            ...r,
            productName,
            productId: pId,
          }));
        }

        try {
          const { data: revData } = await api.get(`/products/${pId}/reviews`);
          const list = Array.isArray(revData)
            ? revData
            : revData.data || revData.reviews || [];

          return list.map((r) => ({
            ...r,
            productName,
            productId: pId,
          }));
        } catch (err) {
          console.error(`Failed to fetch reviews for product ${pId}`, err);
          return [];
        }
      });

      const results = await Promise.all(perProductPromises);
      setReviews(results.flat());
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to load reviews.", { toastId: "reviews-fetch-error" });
      setReviews([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData({ isInitial: true });
  }, []);

  const handleDelete = async () => {
    if (!selectedReview) return;
    const reviewId = selectedReview._id || selectedReview.id;

    try {
      setDeleting(true);
      await api.delete(`/products/${selectedReview.productId}/reviews/${reviewId}`);

      setIsDeleteModalOpen(false);
      setSelectedReview(null);
      toast.success("Review deleted successfully.", {
        toastId: "review-delete-success",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(
        error.response?.data?.message || t("reviews.loadFailed") || "Failed to delete review.",
        { toastId: "review-delete-error" }
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      (r.user?.name || r.customerName || 'ADMIN')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (r.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : '0.0';

  return (
    <DashboardLayout>
      {loading ? (
        <PageLoader text={t("reviews.loading")} />
      ) : (
        <div className="animate-fade-in p-6 max-w-7xl mx-auto space-y-6 w-full">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                {t("pages.catalog")}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{t("navigation.reviews")}</h1>
              <p className="text-sm text-gray-500">
                {t("reviews.description", { count: reviews.length })}
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition"
            >
              <FiPlus size={16} />
              <span>{t("reviews.add")}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-yellow-50 text-yellow-500 rounded-lg">
                <FaStar size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{avgRating}</div>
                <div className="text-xs text-gray-500">{t("reviews.averageRating")}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
                <FiMessageSquare size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {reviews.length}
                </div>
                <div className="text-xs text-gray-500">{t("reviews.total")}</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t("reviews.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white shadow-sm rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div
            className={`bg-white rounded-xl shadow-sm overflow-hidden transition-opacity duration-150 ${
              refreshing ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">{t("reviews.customer")}</th>
                  <th className="py-3.5 px-4">{t("reviews.product")}</th>
                  <th className="py-3.5 px-4">{t("reviews.rating")}</th>
                  <th className="py-3.5 px-4">{t("reviews.comment")}</th>
                  <th className="py-3.5 px-4">{t("reviews.date")}</th>
                  <th className="py-3.5 px-4 text-right">{t("reviews.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <tr
                      key={review._id || review.id}
                      className="hover:bg-gray-50/50 transition"
                    >
                      <td className="py-3.5 px-4 font-medium text-gray-900">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800">
                          {review.user?.name || review.customerName || 'ADMIN'} ✓
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {review.productName}
                      </td>
                      <td className="py-3.5 px-4">
                        <StarRating rating={review.rating} />
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">
                        {review.comment}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {formatDate(review.createdAt || review.date, i18n.language)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-400 hover:text-red-600 transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      {t("reviews.empty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <AddReviewModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            products={products}
            onReviewAdded={fetchData}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            deleting={deleting}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reviews;