import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Info, FolderPlus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { addCustomCategory } from "../../data/customCategories";

export default function CategoryFormModal({ isOpen, onClose, onSaved }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (!isOpen) {
      reset({ name: "" });
    }
  }, [isOpen, reset]);

  const onSubmit = async (formData) => {
    try {
      const categoryName = formData.name.trim();
      await addCustomCategory(categoryName);

      toast.success(`Category "${categoryName}" added successfully`, {
        toastId: "add-category-success",
      });

      reset();
      if (onSaved) onSaved();
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to add category:", error);
      
      toast.error(error?.message || "Failed to add category", {
        toastId: "add-category-error",
      });
    }
  };

  const handleClose = () => {
    reset();
    if (onClose) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Category">
      {/* Notice Banner */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-start gap-3.5 mb-5 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-white border border-blue-100/80 flex items-center justify-center shrink-0 shadow-2xs text-blue-600">
          <Info size={18} />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
          There's no categories endpoint in the backend yet, so this is saved{" "}
          <strong className="font-semibold text-slate-900">locally on your browser</strong>{" "}
          only. It will appear in the product form's category list, but won't sync with other team members until a real Categories API is added.
        </p>
      </div>

      {/* Category Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Input
          label="Category Name"
          placeholder="e.g. Accessories"
          error={errors.name?.message}
          {...register("name", {
            required: "Category name is required",
            validate: {
              notEmpty: (value) =>
                (value && value.trim().length > 0) || "Category name cannot be empty spaces",
            },
          })}
        />

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm shadow-xs transition-all flex items-center gap-2 border border-indigo-500/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-100" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4 text-indigo-100" />
                <span>Add Category</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}