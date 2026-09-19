import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function TagsInput({ tags, onChange }) {
  const [value, setValue] = useState("");

  const addTag = () => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setValue("");
    }
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a tag and press +"
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="button"
          onClick={addTag}
          className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg w-10 flex items-center justify-center shrink-0"
        >
          <Plus size={18} />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 bg-primary-50 text-primary-600 text-xs px-2.5 py-1 rounded-full">
              {tag}
              <X size={12} className="cursor-pointer" onClick={() => removeTag(tag)} />
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2">Add one or more tags to organize the product.</p>
    </div>
  );
}