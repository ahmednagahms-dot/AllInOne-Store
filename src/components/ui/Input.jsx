import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, icon: Icon, rightElement, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        )}
        <input
          ref={ref}
          className={`w-full ${Icon ? "pl-10" : "px-3"} ${
            rightElement ? "pr-10" : "pr-3"
          } py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-colors
            ${error ? "border-danger" : "border-gray-300"} ${className}`}
          {...props}
        />
        {rightElement}
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

export default Input;