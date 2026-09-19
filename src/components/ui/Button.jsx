export default function Button({ children, variant = "primary", ...props }) {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-danger text-white hover:opacity-90",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}