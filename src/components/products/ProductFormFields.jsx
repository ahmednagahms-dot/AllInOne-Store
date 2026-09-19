import { useEffect, useMemo } from "react";
import { ImagePlus, X, Sparkles, Tag, DollarSign, Layers, Boxes } from "lucide-react";
import Input from "../ui/Input";
import TagsInput from "./TagsInput";
import { getAllCategories } from "../../data/customCategories";

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div>
        <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function ProductFormFields({
  register,
  errors,
  imageFiles,
  setImageFiles,
  existingImages = [],
  onDeleteExistingImage,
  tags,
  setTags,
  watch,
}) {
  const existingCount = existingImages?.length || 0;
  const maxNewAllowed = Math.max(0, 5 - existingCount);
  const totalImages = existingCount + imageFiles.length;

  // إدارة روابط المعاينة وتنظيف الذاكرة بشكل آمن
  const newImagePreviews = useMemo(() => {
    return imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [imageFiles]);

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newImagePreviews]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const combined = [...imageFiles, ...files].slice(0, maxNewAllowed);
    setImageFiles(combined);
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const categories = useMemo(() => getAllCategories(), []);
  const shortDescValue = watch ? watch("shortDescription") || "" : "";
  const descValue = watch ? watch("description") || "" : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="flex flex-col gap-5">
        {/* Gallery */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader icon={ImagePlus} title="Product Gallery" subtitle="Up to 5 images · first image is the cover" />
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {totalImages}/5
            </span>
          </div>

          {totalImages > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {existingImages.map((img, i) => (
                <div key={img.public_id || i} className="relative rounded-xl overflow-hidden border border-gray-100 aspect-square">
                  <img src={img.url} alt="Existing product" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-primary-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                      COVER
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => onDeleteExistingImage(img.public_id)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {newImagePreviews.map((preview, index) => (
                <div key={preview.url} className="relative rounded-xl overflow-hidden border border-primary-100 aspect-square">
                  <img src={preview.url} alt={`New upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition"
                  >
                    <X size={12} />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-primary-500/90 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    NEW
                  </span>
                </div>
              ))}
            </div>
          )}

          {totalImages < 5 && (
            <label className="border-2 border-dashed border-gray-200 rounded-xl py-7 flex flex-col items-center justify-center text-gray-400 text-sm cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition">
              <ImagePlus size={20} className="text-gray-300 mb-1.5" />
              <span className="font-medium text-gray-500">Click or drag images here</span>
              <span className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP</span>
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Organization */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <SectionHeader icon={Layers} title="Organization" subtitle="Category, brand, and tags" />

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  {...register("category")}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <Input label="Subcategory" placeholder="e.g. audio" {...register("subcategory")} />
            </div>

            <Input label="Brand" placeholder="e.g. Sony" {...register("brand")} />

            <TagsInput tags={tags} onChange={setTags} />
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <SectionHeader icon={Tag} title="Visibility" />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input type="checkbox" className="peer sr-only" {...register("featured")} />
                <div className="w-10 h-5.5 bg-gray-200 rounded-full peer-checked:bg-primary-500 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4.5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input type="checkbox" defaultChecked className="peer sr-only" {...register("isActive")} />
                <div className="w-10 h-5.5 bg-gray-200 rounded-full peer-checked:bg-primary-500 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4.5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <SectionHeader icon={Sparkles} title="Basic Information" />

          <div className="flex flex-col gap-4">
            <Input
              label="Product Name"
              placeholder="iPhone 16 Pro"
              error={errors.name?.message}
              {...register("name", { required: "Required", minLength: { value: 3, message: "Minimum 3 characters" } })}
            />

            <div>
              <Input
                label="Short Description"
                placeholder="A brief, catchy summary"
                error={errors.shortDescription?.message}
                {...register("shortDescription", { required: "Required", minLength: { value: 10, message: "Minimum 10 characters" } })}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{shortDescValue.length} characters</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                placeholder="Full product details, specs, and features..."
                className={`px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? "border-danger" : "border-gray-300"
                }`}
                {...register("description", { required: "Required", minLength: { value: 20, message: "Minimum 20 characters" } })}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.description ? (
                  <span className="text-xs text-danger">{errors.description.message}</span>
                ) : (
                  <span />
                )}
                <p className="text-xs text-gray-400">{descValue.length} characters</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <SectionHeader icon={DollarSign} title="Pricing & Inventory" />

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.price?.message}
                {...register("price", { required: "Required", min: 0, valueAsNumber: true })}
              />
              <Input
                label="Discount Price"
                type="number"
                step="0.01"
                placeholder="Optional"
                {...register("discountPrice", { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stock"
                type="number"
                placeholder="0"
                error={errors.stock?.message}
                {...register("stock", { required: "Required", min: 0, valueAsNumber: true })}
              />
              <Input label="SKU" placeholder="Optional" {...register("sku")} />
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-100 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-primary-500 flex items-center justify-center shrink-0 shadow-sm">
            <Boxes size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-800">Quick tip</p>
            <p className="text-xs text-primary-700 mt-0.5">
              Clear product names and a cover image improve visibility in search and category pages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}