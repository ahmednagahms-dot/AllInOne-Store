import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white",
  secondary: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200",
  outline: "bg-transparent hover:bg-primary-50 text-primary-500 border border-primary-500",
  danger: "bg-danger hover:bg-red-600 text-white",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}