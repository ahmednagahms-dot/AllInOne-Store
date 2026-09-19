import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import ProductFormFields from "./ProductFormFields";
import api from "../../api/axios";

export default function QuickEditModal({
  isOpen,
  onClose,
  productId,
  onUpdated,
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // raw File objects
  const [tags, setTags] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: "",
      discountPrice: "",
      stock: "",
      sku: "",
      category: "",
      subcategory: "",
      brand: "",
      featured: false,
      isActive: true,
    },
  });

  // =========================
  // Fetch Product
  // =========================
  useEffect(() => {
    if (!isOpen || !productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setSubmitError("");

        const { data } = await api.get(`/products/${productId}`);
        const product = data.product || data;

        reset({
          name: product.name || "",
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          price: product.price ?? "",
          discountPrice: product.discountPrice ?? "",
          stock: product.stock ?? "",
          sku: product.sku || "",
          category: product.category || "",
          subcategory: product.subcategory || "",
          brand: product.brand || "",
          featured: Boolean(product.featured),
          isActive: product.active !== false,
        });

        setTags(Array.isArray(product.tags) ? product.tags : []);
        setExistingImages(product.images || []);
        setDeletedImages([]);
        setImageFiles([]);
      } catch (err) {
        setSubmitError(
          err.response?.data?.message ||
            "Failed to fetch product details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isOpen, productId, reset]);

  // =========================
  // Delete existing image
  // =========================
  const handleRemoveExistingImage = (publicId) => {
    setExistingImages((prev) =>
      prev.filter((img) => img.public_id !== publicId)
    );
    setDeletedImages((prev) => [...prev, publicId]);
  };

  // =========================
  // Submit (FormData - same as ProductForm)
  // =========================
  const onSubmit = async (formData) => {
    setSubmitError("");

    // At least one image required
    if (existingImages.length === 0 && imageFiles.length === 0) {
      setSubmitError("At least 1 image is required.");
      return;
    }

    const data = new FormData();

    data.append("name", formData.name);
    data.append("shortDescription", formData.shortDescription || "");
    data.append("description", formData.description || "");
    data.append("price", formData.price);
    if (formData.discountPrice) {
      data.append("discountPrice", formData.discountPrice);
    }
    data.append("stock", formData.stock);
    if (formData.sku) data.append("sku", formData.sku);
    if (formData.category) data.append("category", formData.category);
    if (formData.subcategory) data.append("subcategory", formData.subcategory);
    if (formData.brand) data.append("brand", formData.brand);
    data.append("featured", formData.featured || false);
    data.append("isActive", formData.isActive ?? true);

    if (tags.length > 0) {
      data.append("tags", JSON.stringify(tags));
    }

    // New images (raw File objects)
    imageFiles.forEach((file) => {
      data.append("images", file);
    });

    // Deleted images
    if (deletedImages.length > 0) {
      data.append("deletedImages", JSON.stringify(deletedImages));
    }

    try {
      setSaving(true);

      await api.patch(`/products/update/${productId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully");
      onUpdated?.();
      handleClose();
    } catch (err) {
      console.error("Quick Edit Error:", err.response?.data || err);
      setSubmitError(
        err.response?.data?.message ||
          "Failed to save product. Please try again."
      );
      toast.error(
        err.response?.data?.message || "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Close
  // =========================
  const handleClose = () => {
    if (saving) return;

    setSubmitError("");
    setExistingImages([]);
    setDeletedImages([]);
    setImageFiles([]);
    setTags([]);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Quick Edit Product">
      {loading ? (
        <p className="text-sm text-gray-500 py-10 text-center">
          Loading product...
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <ProductFormFields
            register={register}
            errors={errors}
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            existingImages={existingImages}
            onDeleteExistingImage={handleRemoveExistingImage}
            tags={tags}
            setTags={setTags}
            watch={watch}
          />

          {submitError && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mt-5">
              {submitError}
            </p>
          )}

          <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}