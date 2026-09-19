export default function Textarea({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        rows={4}
        className={`px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none
          ${error ? "border-danger" : "border-gray-300"}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
