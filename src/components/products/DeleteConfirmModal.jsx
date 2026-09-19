import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import api from "../../api/axios";

export default function DeleteConfirmModal({
  isOpen,
  productId,
  productName = "this product",
  onClose,
  onDeleted,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // إعادة ضبط حالة الخطأ عند فتح أو إغلاق النافذة المنبثقة
  useEffect(() => {
    if (isOpen) {
      setError("");
    }
  }, [isOpen]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      await api.delete(`/products/${productId}`);

      onDeleted?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete product. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (deleting) return;
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Product">
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3.5">
          <AlertTriangle className="shrink-0 text-red-500 mt-0.5" size={18} />
          <div className="text-sm">
            <p className="text-gray-800">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">{productName}</span>?
            </p>
            <p className="text-xs text-red-600 mt-1">
              This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-xs font-medium text-red-600 bg-red-100/80 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}