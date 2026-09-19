import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TopProductsList({ products = [], onViewAll }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-slate-800">Top Products</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
        >
          View all
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-1 flex-1">
        {products.length === 0 ? (
          <div className="py-10 text-center my-auto">
            <Package size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm text-slate-400">No sales in this period</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id || product.name}
              className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {/* Image */}
              <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={16} className="text-slate-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {product.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {product.sold} sold
                </p>
              </div>

              {/* Revenue */}
              <p className="text-sm font-semibold text-slate-900 shrink-0">
                ${Number(product.revenue || 0).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}